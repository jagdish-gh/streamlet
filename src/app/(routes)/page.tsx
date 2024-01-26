import styles from "./page.module.css";

import SigninButton from "../_component/Atom/SigninButton";
import MainContainer from "../_component/Template/MainContainer/MainContainer";

export default function Home() {
  return (
    <main className={styles.main}>
      <SigninButton />
      <MainContainer/>
    </main>
  );
}
