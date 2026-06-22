import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

/**
 * Shared hook for fetching marquee images.
 * Uses SWR for deduplication, caching, and revalidation.
 */
export default function useMarqueeImages() {
    const { data, error, isLoading } = useSWR("/api/marquee-images", fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 5000,
    });

    return {
        images: data || [],
        isLoading,
        isError: !!error,
    };
}
