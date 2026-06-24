"use client";

import VideoThumbnail from "@/app/_component/Molecule/VideoThumbnail/VideoThumbnail";
import fetchYouTubeSearchResults, { YouTubeSearchResult } from "@/app/_util/fetchYouTubeSearchResults";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./search.module.css";

type SearchResultsProps = {
  query: string;
};

export default function SearchResults({ query }: SearchResultsProps) {
  const { data: session } = useSession();
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string>();
  const [totalResults, setTotalResults] = useState<number>();
  const isLoadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadSearchResults = useCallback(async (pageToken?: string, replace = false) => {
    if (!session || !query || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setError("");

    try {
      const page = await fetchYouTubeSearchResults(session, query, 24, pageToken);
      setResults(currentResults => {
        if (replace) {
          return page.items;
        }

        const seenIds = new Set(currentResults.map(result => result.id.videoId));
        const newResults = page.items.filter(result => !seenIds.has(result.id.videoId));
        return [...currentResults, ...newResults];
      });
      setNextPageToken(page.nextPageToken);
      setTotalResults(page.totalResults);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Search failed.");
      if (replace) {
        setResults([]);
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [query, session]);

  useEffect(() => {
    if (!session || !query) {
      setResults([]);
      setNextPageToken(undefined);
      setTotalResults(undefined);
      return;
    }

    setResults([]);
    setNextPageToken(undefined);
    setTotalResults(undefined);
    loadSearchResults(undefined, true);
  }, [loadSearchResults, query, session]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !nextPageToken) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          loadSearchResults(nextPageToken);
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadSearchResults, nextPageToken]);

  return (
    <>
      <p className={styles.summary}>
        {isLoading
          ? "Loading results..."
          : `${results.length}${totalResults ? ` of ${totalResults}` : ""} ${results.length === 1 ? "result" : "results"}`}
      </p>

      {error && <p className={styles.message}>{error}</p>}

      {!error && !isLoading && query && results.length === 0 && (
        <p className={styles.message}>No videos found.</p>
      )}

      <section className={styles.resultsGrid}>
        {results.map((video) => (
          <VideoThumbnail key={video.id.videoId} video={video} />
        ))}
      </section>
      <div className={styles.loadSentinel} ref={sentinelRef}>
        {isLoading && results.length > 0 && <span>Loading more results...</span>}
        {!isLoading && !nextPageToken && results.length > 0 && <span>All results loaded</span>}
      </div>
    </>
  );
}
