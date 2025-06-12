"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { useTheme } from "@/app/providers/theme-provider"

interface ResultsModalProps {
  isOpen: boolean
  onClose: () => void
  onRestart: () => void
  results: {
    mode: string
    language: string
    wpm: number
    accuracy: number
    correctChars: number
    incorrectChars: number
    timeTaken: number
  }
}

export function ResultsModal({ isOpen, onClose, onRestart, results }: ResultsModalProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const getPerformanceLevel = (wpm: number) => {
    if (wpm >= 70)
      return {
        level: "Expert",
        color: isDark ? "text-purple-400" : "text-purple-600",
        bg: isDark ? "bg-purple-400/10" : "bg-purple-100",
      }
    if (wpm >= 50)
      return {
        level: "Advanced",
        color: isDark ? "text-blue-400" : "text-blue-600",
        bg: isDark ? "bg-blue-400/10" : "bg-blue-100",
      }
    if (wpm >= 30)
      return {
        level: "Intermediate",
        color: isDark ? "text-green-400" : "text-emerald-600",
        bg: isDark ? "bg-green-400/10" : "bg-emerald-100",
      }
    return {
      level: "Beginner",
      color: isDark ? "text-yellow-400" : "text-amber-600",
      bg: isDark ? "bg-yellow-400/10" : "bg-amber-100",
    }
  }

  const performance = getPerformanceLevel(results.wpm)

  const handleRestart = () => {
    onClose()
    onRestart()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={
          isDark
            ? "bg-gray-800 border-gray-700 text-white max-w-md"
            : "bg-white border-gray-200 text-gray-900 shadow-2xl max-w-md"
        }
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Test Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Performance Badge */}
          <div className="text-center">
            <Badge className={`${performance.bg} ${performance.color} border-0 px-4 py-2 text-lg font-semibold`}>
              <Trophy className="w-4 h-4 mr-2" />
              {performance.level}
            </Badge>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className={`w-5 h-5 mr-2 ${isDark ? "text-yellow-400" : "text-amber-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>WPM</span>
                </div>
                <div className={`text-3xl font-bold ${isDark ? "text-yellow-400" : "text-amber-600"}`}>
                  {results.wpm}
                </div>
              </CardContent>
            </Card>

            <Card className={isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className={`w-5 h-5 mr-2 ${isDark ? "text-green-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Accuracy</span>
                </div>
                <div className={`text-3xl font-bold ${isDark ? "text-green-400" : "text-emerald-600"}`}>
                  {results.accuracy}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-3">
            <div
              className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-gray-700/30" : "bg-gray-50"}`}
            >
              <div className="flex items-center">
                <Clock className={`w-4 h-4 mr-2 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>Time Taken</span>
              </div>
              <span className={`font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                {results.timeTaken.toFixed(1)}s
              </span>
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-gray-700/30" : "bg-gray-50"}`}
            >
              <div className="flex items-center">
                <CheckCircle className={`w-4 h-4 mr-2 ${isDark ? "text-green-400" : "text-emerald-600"}`} />
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>Correct Characters</span>
              </div>
              <span className={`font-semibold ${isDark ? "text-green-400" : "text-emerald-600"}`}>
                {results.correctChars}
              </span>
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-gray-700/30" : "bg-gray-50"}`}
            >
              <div className="flex items-center">
                <XCircle className={`w-4 h-4 mr-2 ${isDark ? "text-red-400" : "text-red-600"}`} />
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>Incorrect Characters</span>
              </div>
              <span className={`font-semibold ${isDark ? "text-red-400" : "text-red-600"}`}>
                {results.incorrectChars}
              </span>
            </div>
          </div>

          {/* Test Info */}
          <div className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {results.mode.charAt(0).toUpperCase() + results.mode.slice(1)} mode •{" "}
            {results.language.charAt(0).toUpperCase() + results.language.slice(1)}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleRestart} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className={`flex-1 ${
                isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
