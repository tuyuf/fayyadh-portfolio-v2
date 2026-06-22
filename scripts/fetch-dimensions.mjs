import { createRequire } from "module";

// Try to import the project's prisma client config
// Since this is a script, we'll configure Prisma manually with the same settings
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_rOlAPV2uf8DU@ep-winter-darkness-aipgtclw-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Parse image dimensions from binary buffer.
 * Supports JPEG, PNG, and WebP.
 */
function getImageDimensions(buffer) {
  const buf = Buffer.from(buffer);

  // PNG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { width, height };
  }

  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] === 0xff) {
        const marker = buf[i + 1];
        if (marker === 0xd9) break;
        if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
          const height = buf.readUInt16BE(i + 5);
          const width = buf.readUInt16BE(i + 7);
          return { width, height };
        }
        if (marker !== 0x00 && marker !== 0x01 && (marker < 0xd0 || marker > 0xd9)) {
          const len = buf.readUInt16BE(i + 2);
          i += 2 + len;
          continue;
        }
      }
      i++;
    }
  }

  // WebP
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) {
    if (buf[15] === 0x20 && buf[20] === 0x56 && buf[21] === 0x50) {
      const width = buf.readUInt16LE(26) & 0x3fff;
      const height = buf.readUInt16LE(28) & 0x3fff;
      return { width, height };
    }
    if (buf[15] === 0x58) {
      const width = 1 + ((buf[24] | (buf[25] << 8) | (buf[26] << 16)) & 0x00ffffff);
      const height = 1 + ((buf[27] | (buf[28] << 8) | (buf[29] << 16)) & 0x00ffffff);
      return { width, height };
    }
  }

  return null;
}

async function fetchImageDimensions(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      console.error(`HTTP ${response.status} for ${url}`);
      return null;
    }
    const buffer = await response.arrayBuffer();
    const dims = getImageDimensions(buffer);
    if (!dims) {
      console.error(`Could not parse dimensions for ${url}`);
    }
    return dims;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function main() {
  const images = await prisma.caseStudyImage.findMany({
    where: { OR: [{ width: null }, { height: null }] },
    select: { id: true, imageUrl: true },
  });

  console.log(`Found ${images.length} images without dimensions`);

  for (const img of images) {
    const dims = await fetchImageDimensions(img.imageUrl);
    if (dims) {
      await prisma.caseStudyImage.update({
        where: { id: img.id },
        data: { width: dims.width, height: dims.height },
      });
      console.log(`✅ Updated ${img.id}: ${dims.width}x${dims.height}`);
    } else {
      console.log(`❌ Failed: ${img.id} (${img.imageUrl})`);
    }

    // Delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log("\nDone backfilling image dimensions!");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
