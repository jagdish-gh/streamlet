"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from './SigninButton.module.css';
import ThemeSwitch from "./ThemeSwitch";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";

const GOOGLE_AUTH_SCOPE = "openid profile email https://www.googleapis.com/auth/youtube.readonly";

const SigninButton = () => {
  const { data: session } = useSession();
  const router = useRouter()
  const signInWithGoogle = () => {
    signIn("google", undefined, {
      prompt: "consent",
      access_type: "offline",
      scope: GOOGLE_AUTH_SCOPE,
    });
  };

  const onNameClick = () => {
    if (session && session.user) {
      router.push('/')
    }
  }
  if (session && session.user) {
    return (
      <div className={`${styles.header} streamletHeader`}>
        <button className={styles.brand} onClick={onNameClick} type="button">
          <span className={styles.brandMark}>S</span>
          <span className={styles.brandName}>Streamlet</span>
        </button>
        <SearchBar />
        <div className={styles.rightSide}>
          <span className={styles.username}>{session.user.name}</span>
          <ThemeSwitch/>
          {session.error === "RefreshAccessTokenError" && (
            <button onClick={signInWithGoogle} className={styles.loginButton}>
              Reconnect Google
            </button>
          )}
          <button onClick={() => signOut()} className={`${styles.logoutButton} ${styles.loginButton}`}>
            Sign Out
          </button>
        </div>
        
      </div>
    );
  }
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <span className={styles.brandMark}>S</span>
        <h1 className={styles.loginTitle}>Streamlet</h1>
        <p className={styles.description}>Your subscriptions, focused search, and a cleaner watch flow.</p>
        <button onClick={signInWithGoogle} className={styles.loginButton}>
              Let&rsquo;s Start
        </button>
      </div>
      
    </div>
  );
};

export default SigninButton;
