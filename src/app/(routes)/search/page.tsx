import SearchResults from "./SearchResults";
import styles from "./search.module.css";

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() ?? "";

  return (
    <main className={styles.searchPage}>
      <section className={styles.searchHeader}>
        <p className={styles.eyebrow}>Search</p>
        <h1 className={styles.title}>{query || "Find videos"}</h1>
      </section>
      <SearchResults query={query} />
    </main>
  );
}
