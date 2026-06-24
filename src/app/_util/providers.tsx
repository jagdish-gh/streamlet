'use client'
import { ThemeProvider } from "next-themes"
export function Provider({children}:{children: React.ReactNode}) {
    return (
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
    )
}
