"use client"

import { useTheme } from "@/app/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full ${
        theme === "light"
          ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
          : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  )
}
