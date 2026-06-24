"use client";

import VideoThumbnail from "@/app/_component/Molecule/VideoThumbnail/VideoThumbnail";
import fetchYouTubeSearchResults, { YouTubeSearchResult } from "@/app/_util/fetchYouTubeSearchResults";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./search.module.css";

type SearchResultsProps = {
  query: string;
};

export default function SearchResults({ query }: SearchResultsProps) {
  const { data: session } = useSession();
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session || !query) {
      setResults([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError("");

    fetchYouTubeSearchResults(session, query)
      .then((items) => {
        if (isMounted) {
          setResults(items);
        }
      })
      .catch((searchError) => {
        if (isMounted) {
          setError(searchError instanceof Error ? searchError.message : "Search failed.");
          setResults([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query, session]);

  return (
    <>
      <p className={styles.summary}>
        {isLoading
          ? "Loading results..."
          : `${results.length} ${results.length === 1 ? "result" : "results"}`}
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
    </>
  );
}
