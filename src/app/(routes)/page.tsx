import styles from "./page.module.css";
import ThemeSwitch from "../_component/Atom/ThemeSwitch";
import SigninButton from "../_component/Atom/SigninButton";

export default function Home() {
  return (
    <main className={styles.main}>
      <ThemeSwitch />
      <SigninButton />
    </main>
  );
}
