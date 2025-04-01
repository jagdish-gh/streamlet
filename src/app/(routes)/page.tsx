import styles from "./page.module.css";

import MainContainer from "../_component/Template/MainContainer/MainContainer";

export default function Home() {
  return (
    <main className={styles.main}>
      <MainContainer/>
    </main>
  );
}
