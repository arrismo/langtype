"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a placeholder or null on the server and initial client render
    // to avoid hydration mismatch. The button itself can be rendered
    // as its attributes don't depend on the theme directly.
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-gray-400 hover:text-yellow-400 hover:bg-gray-800 transition-colors h-9 w-9" // Ensure consistent size
        aria-label="Toggle theme"
        disabled // Disable until mounted to prevent interaction before theme is known
      />
    )
  }

  // Determine the actual current theme taking system preference into account
  const currentTheme = theme === "system" ? resolvedTheme : theme

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="rounded-full text-gray-400 hover:text-yellow-400 hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}