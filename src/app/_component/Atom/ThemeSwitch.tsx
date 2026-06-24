'use client'

import { FiMoon, FiSun } from "react-icons/fi"
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import styles from "./ThemeSwitch.module.css"

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <span className={styles.placeholder} aria-hidden="true" />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={styles.themeButton}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      type="button"
    >
      {isDark ? <FiSun /> : <FiMoon />}
    </button>
  )
}
