"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { useTheme } from "next-themes"

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
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
      }
    if (wpm >= 50)
      return {
        level: "Advanced",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
      }
    if (wpm >= 30)
      return {
        level: "Intermediate",
        color: "text-green-400",
        bg: "bg-green-400/10",
      }
    return {
      level: "Beginner",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    }
  }

  const performance = getPerformanceLevel(results.wpm)

  const handleRestart = () => {
    onClose()
    onRestart()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-yellow-400">
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
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">WPM</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400">
                  {results.wpm}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Accuracy</span>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {results.accuracy}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-gray-300">Time Taken</span>
              </div>
              <span className="font-semibold text-blue-400">
                {results.timeTaken.toFixed(1)}s
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                <span className="text-gray-300">Correct Characters</span>
              </div>
              <span className="font-semibold text-green-400">
                {results.correctChars}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
              <div className="flex items-center">
                <XCircle className="w-4 h-4 mr-2 text-red-400" />
                <span className="text-gray-300">Incorrect Characters</span>
              </div>
              <span className="font-semibold text-red-400">
                {results.incorrectChars}
              </span>
            </div>
          </div>

          {/* Test Info */}
          <div className="text-center text-sm text-gray-400">
            {results.mode.charAt(0).toUpperCase() + results.mode.slice(1)} mode •{" "}
            {results.language.charAt(0).toUpperCase() + results.language.slice(1)}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleRestart} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 hover:bg-gray-700 text-gray-300"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}