'use client';
import { useRouter } from 'next/navigation';
import React from 'react'
import styles from './BackButton.module.css';
export default function BackButton() {
    const router = useRouter();
    const handleBack = () => {
        router.back();
      };
  return (
    <button onClick={handleBack} className={styles.button_74}>Back</button>
  )
}
