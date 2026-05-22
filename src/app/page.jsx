import { getAllHomepageData } from "../lib/data";
import PageContent from "./components/PageContent";

export const revalidate = 60;

export default async function Home() {
  const { caseStudies, photos, videos, webProjects } = await getAllHomepageData();

  return (
    <main className="overflow-x-hidden relative bg-white text-[#051A24]">
      <PageContent
        caseStudies={caseStudies}
        photos={photos}
        videos={videos}
        webProjects={webProjects}
      />
    </main>
  );
}
