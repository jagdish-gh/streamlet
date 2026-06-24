"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={onSubmit} role="search">
      <FaSearch className={styles.searchIcon} aria-hidden="true" />
      <input
        aria-label="Search YouTube"
        className={styles.searchInput}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search videos"
        type="search"
        value={query}
      />
      <button className={styles.searchButton} type="submit">
        Search
      </button>
    </form>
  );
}
