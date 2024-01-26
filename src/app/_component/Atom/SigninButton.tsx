"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from './SigninButton.module.css';
import ThemeSwitch from "./ThemeSwitch";
const SigninButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className={styles.header}>
        <p className={styles.username}>{session.user.name}</p>
        <div className={styles.rightSide}>
          <ThemeSwitch/>
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
        Welcome to the Streamlet.
        <p className={styles.description}>Start your awesome journey of personalization.</p>
        <button onClick={() => signIn()} className={styles.loginButton}>
              Let&rsquo;s Start
        </button>
      </div>
      
    </div>
   
  );
};

export default SigninButton;