"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Timer, RotateCcw, Play, Pause, Trophy, Target, Zap } from "lucide-react"
import { ResultsModal } from "./components/results-modal"
import { sampleTexts } from "./data/texts"
import { ThemeToggle } from "./components/theme-toggle"
import { useTheme } from "./providers/theme-provider"

type TestMode = "practice" | "time" | "words"
type Language = "english" | "spanish"

export default function TypingTest() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [currentMode, setCurrentMode] = useState<TestMode>("practice")
  const [currentLanguage, setCurrentLanguage] = useState<Language>("english")
  const [timeSetting, setTimeSetting] = useState(30)
  const [wordCountSetting, setWordCountSetting] = useState(25)
  const [timeLeft, setTimeLeft] = useState(30)
  const [testActive, setTestActive] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [currentText, setCurrentText] = useState("")
  const [typedText, setTypedText] = useState("")
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [progress, setProgress] = useState(0)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const generateText = useCallback(() => {
    const texts = sampleTexts[currentLanguage]
    if (currentMode === "words") {
      const wordsNeeded = wordCountSetting
      let result = ""
      let wordCount = 0

      while (wordCount < wordsNeeded) {
        const randomText = texts[Math.floor(Math.random() * texts.length)]
        const words = randomText.split(" ")
        for (const word of words) {
          if (wordCount >= wordsNeeded) break
          result += (wordCount > 0 ? " " : "") + word
          wordCount++
        }
      }
      return result
    } else {
      return texts[Math.floor(Math.random() * texts.length)]
    }
  }, [currentLanguage, currentMode, wordCountSetting])

  const initializeTest = useCallback(() => {
    setTestActive(false)
    if (timerRef.current) clearInterval(timerRef.current)
    setStartTime(null)
    setTypedText("")
    setWpm(0)
    setAccuracy(0)
    setCorrectChars(0)
    setTotalChars(0)
    setProgress(0)
    setCurrentText(generateText())
    if (currentMode === "time") {
      setTimeLeft(timeSetting)
    }
    setShowResults(false)
    inputRef.current?.focus()
  }, [generateText, currentMode, timeSetting])

  const startTest = useCallback(() => {
    if (testActive) return
    setTestActive(true)
    setStartTime(Date.now())

    if (currentMode === "time") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [testActive, currentMode])

  const endTest = useCallback(() => {
    setTestActive(false)
    if (timerRef.current) clearInterval(timerRef.current)

    const endTime = Date.now()
    const timeElapsed = startTime ? (endTime - startTime) / 1000 : 0
    const finalWpm = timeElapsed > 0 ? Math.round(correctChars / 5 / (timeElapsed / 60)) : 0
    const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0

    setWpm(finalWpm)
    setAccuracy(finalAccuracy)
    setShowResults(true)
  }, [startTime, correctChars, totalChars])

  const handleInput = useCallback(
    (value: string) => {
      if (!testActive && value.length > 0) {
        startTest()
      }

      setTypedText(value)

      let correct = 0
      const total = value.length

      for (let i = 0; i < value.length && i < currentText.length; i++) {
        if (value[i] === currentText[i]) {
          correct++
        }
      }

      setCorrectChars(correct)
      setTotalChars(total)

      // Calculate live stats
      if (startTime && total > 0) {
        const currentTime = Date.now()
        const timeElapsed = (currentTime - startTime) / 60000 // minutes
        if (timeElapsed > 0) {
          const liveWpm = Math.round(correct / 5 / timeElapsed)
          setWpm(Math.max(0, liveWpm))
        }
        const liveAccuracy = Math.round((correct / total) * 100)
        setAccuracy(Math.max(0, liveAccuracy))
      }

      // Calculate progress
      const progressPercent = (value.length / currentText.length) * 100
      setProgress(Math.min(100, progressPercent))

      // Check completion
      if ((currentMode === "words" || currentMode === "practice") && value.length >= currentText.length) {
        endTest()
      }
    },
    [testActive, startTest, currentText, startTime, currentMode, endTest],
  )

  const renderText = () => {
    return currentText.split("").map((char, index) => {
      let className = "transition-colors duration-75"

      if (index < typedText.length) {
        if (typedText[index] === char) {
          className += isDark ? " text-green-400 bg-green-400/10" : " text-green-600 bg-green-100"
        } else {
          className += isDark ? " text-red-400 bg-red-400/20" : " text-red-600 bg-red-100"
        }
      } else if (index === typedText.length) {
        className += isDark ? " bg-blue-400/30" : " bg-blue-200"
      } else {
        className += isDark ? " text-gray-400" : " text-gray-700"
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      )
    })
  }

  useEffect(() => {
    initializeTest()
  }, [initializeTest])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault()
        initializeTest()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [initializeTest])

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              LangType
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>Test your typing speed and accuracy</p>
          </div>
          <div className="absolute right-8 top-8">
            <ThemeToggle />
          </div>
        </div>

        {/* Settings */}
        <Card
          className={`mb-8 ${
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200 shadow-lg backdrop-blur-sm"
          }`}
        >
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Language</label>
                <Select value={currentLanguage} onValueChange={(value: Language) => setCurrentLanguage(value)}>
                  <SelectTrigger className={isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Mode</label>
                <Select value={currentMode} onValueChange={(value: TestMode) => setCurrentMode(value)}>
                  <SelectTrigger className={isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practice">Practice</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentMode === "time" && (
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Duration
                  </label>
                  <Select
                    value={timeSetting.toString()}
                    onValueChange={(value) => setTimeSetting(Number.parseInt(value))}
                  >
                    <SelectTrigger className={isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15s</SelectItem>
                      <SelectItem value="30">30s</SelectItem>
                      <SelectItem value="60">60s</SelectItem>
                      <SelectItem value="120">120s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentMode === "words" && (
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Words</label>
                  <Select
                    value={wordCountSetting.toString()}
                    onValueChange={(value) => setWordCountSetting(Number.parseInt(value))}
                  >
                    <SelectTrigger className={isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-end">
                <Button
                  onClick={initializeTest}
                  variant="outline"
                  size="sm"
                  className={
                    isDark
                      ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                      : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                  }
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Bar */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
            <Card
              className={
                isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200 shadow-lg backdrop-blur-sm"
              }
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className={`w-5 h-5 mr-2 ${isDark ? "text-yellow-400" : "text-amber-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>WPM</span>
                </div>
                <div className={`text-2xl font-bold ${isDark ? "text-yellow-400" : "text-amber-600"}`}>{wpm}</div>
              </CardContent>
            </Card>

            <Card
              className={
                isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200 shadow-lg backdrop-blur-sm"
              }
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className={`w-5 h-5 mr-2 ${isDark ? "text-green-400" : "text-emerald-600"}`} />
                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Accuracy</span>
                </div>
                <div className={`text-2xl font-bold ${isDark ? "text-green-400" : "text-emerald-600"}`}>
                  {accuracy}%
                </div>
              </CardContent>
            </Card>

            {currentMode === "time" ? (
              <Card
                className={
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200 shadow-lg backdrop-blur-sm"
                }
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Timer className={`w-5 h-5 mr-2 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Time</span>
                  </div>
                  <div className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>{timeLeft}s</div>
                </CardContent>
              </Card>
            ) : (
              <Card
                className={
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200 shadow-lg backdrop-blur-sm"
                }
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className={`w-5 h-5 mr-2 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                    <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Progress
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                    {Math.round(progress)}%
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className={`h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        </div>

        {/* Text Display */}
        <Card
          className={`mb-6 ${
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200 shadow-lg backdrop-blur-sm"
          }`}
        >
          <CardContent className="p-8">
            <div className="text-xl leading-relaxed font-mono tracking-wide">{renderText()}</div>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card
          className={`mb-8 ${
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200 shadow-lg backdrop-blur-sm"
          }`}
        >
          <CardContent className="p-6">
            <textarea
              ref={inputRef}
              value={typedText}
              onChange={(e) => handleInput(e.target.value)}
              placeholder={testActive ? "Keep typing..." : "Click here and start typing to begin the test"}
              className={`w-full h-32 rounded-lg p-4 resize-none focus:ring-2 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 shadow-inner"
              }`}
              disabled={showResults}
            />
            <div className="mt-4 flex justify-between items-center">
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Press Tab to restart • {currentText.length} characters total
              </div>
              <Badge
                variant="outline"
                className={isDark ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700 bg-white/50"}
              >
                {testActive ? (
                  <>
                    <Pause className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-1" />
                    Ready
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Results Modal */}
        <ResultsModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          onRestart={initializeTest}
          results={{
            mode: currentMode,
            language: currentLanguage,
            wpm,
            accuracy,
            correctChars,
            incorrectChars: totalChars - correctChars,
            timeTaken: startTime ? (Date.now() - startTime) / 1000 : 0,
          }}
        />
      </div>
    </div>
  )
}
