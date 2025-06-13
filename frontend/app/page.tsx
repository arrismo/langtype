"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Timer, RotateCcw, Play, Pause, Trophy, Target, Zap } from "lucide-react"
import { ResultsModal } from "./components/results-modal"
import { samplePrompts, Prompt, Language as AppLanguage } from "./data/texts"
import { ThemeToggle } from "./components/theme-toggle"
import { useTheme } from "./providers/theme-provider"

type TestMode = "easy" | "hard"
type Language = AppLanguage // Using the imported Language type

const DEFAULT_DURATION = 60; // seconds

export default function TypingTest() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [currentMode, setCurrentMode] = useState<TestMode>("easy")
  const [sourceLanguage, setSourceLanguage] = useState<Language>("english");
  const [translationLanguage, setTranslationLanguage] = useState<Language>("spanish")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [testActive, setTestActive] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [currentText, setCurrentText] = useState("")
  const [typedText, setTypedText] = useState("")
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [progress, setProgress] = useState(0);
  const [targetTranslationText, setTargetTranslationText] = useState("")
  const [currentHighlightWordIndex, setCurrentHighlightWordIndex] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const generateText = useCallback(() => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    if (!randomPrompt) return { source: "", translation: "" };

    let sourceText = randomPrompt[sourceLanguage] || "";
    let translationText = randomPrompt[translationLanguage] || "";

    return { source: sourceText, translation: translationText };
  }, [sourceLanguage, translationLanguage])

  const initializeTest = useCallback(() => {
    setTestActive(false)
    if (timerRef.current) clearInterval(timerRef.current)
    setStartTime(null)
    setTimeElapsed(0)
    setTypedText("")
    setWpm(0)
    setAccuracy(0)
    setCorrectChars(0)
    setTotalChars(0)
    setProgress(0);
    setCurrentHighlightWordIndex(0);
    const generated = generateText();
    setCurrentText(generated.source);
    setTargetTranslationText(generated.translation);
    setShowResults(false)
  }, [generateText, sourceLanguage, translationLanguage])

  const startTest = useCallback(() => {
    if (testActive) return
    setTestActive(true)
    const now = Date.now()
    setStartTime(now)
    
    // Start counting up from 0
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  }, [testActive])

  const endTest = useCallback(() => {
    setTestActive(false)
    if (timerRef.current) clearInterval(timerRef.current)
    
    const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0
    const finalWpm = timeElapsed > 0 ? Math.round((correctChars / 5) / (timeElapsed / 60)) : 0

    setWpm(finalWpm)
    setAccuracy(finalAccuracy)
    setShowResults(true)
  }, [correctChars, totalChars, timeElapsed])

  const handleKeyPressLogic = useCallback((key: string) => {
    if (showResults) return;
    // Prevent typing past the end in non-time modes, unless it's backspace
    if (key !== "Backspace" && testActive && typedText.length >= targetTranslationText.length) return;

    let newTypedText = typedText;

    if (key === "Backspace") {
      if (newTypedText.length > 0) {
        newTypedText = newTypedText.slice(0, -1);
      }
    } else if (key.length === 1) { // Character key (letters, numbers, space, symbols)
      if (!testActive && newTypedText.length === 0) {
        startTest(); // Start test on the first character typed
      }
      // Only add char if test is active or it's the first char to start the test
      // And ensure not to type beyond currentText in practice/words mode
      if (testActive || (newTypedText.length === 0)) {
        if (newTypedText.length < targetTranslationText.length) {
           newTypedText += key;
        }
      }
    } else {
      return; // Ignore other keys like Enter, Shift, Ctrl, etc.
    }

    setTypedText(newTypedText);

    let correct = 0;
    const total = newTypedText.length;
    for (let i = 0; i < newTypedText.length && i < targetTranslationText.length; i++) {
      if (newTypedText[i] === targetTranslationText[i]) {
        correct++;
      }
    }
    setCorrectChars(correct);
    setTotalChars(total);

    if (total === 0) { // Reset stats if typedText is empty
      setWpm(0);
      setAccuracy(0);
    }

    const progressPercent = targetTranslationText.length > 0 ? (newTypedText.length / targetTranslationText.length) * 100 : 0;
    setProgress(Math.min(100, progressPercent));

    // Check completion for words/practice mode
    if (newTypedText.length >= targetTranslationText.length && targetTranslationText.length > 0) {
      // End test if all characters are typed (correctly or not, matching currentText length)
      endTest();
    }

    // ----- WORD-BASED HIGHLIGHT CALCULATION -----
    const sourceWordsArray = currentText.split(" ").filter((w) => w !== "");
    const targetWordsArray = targetTranslationText.split(" ").filter((w) => w !== "");
    const typedWordsArray = newTypedText.trim().split(" ").filter((w) => w !== "");

    let highlightIndex = 0;
    if (typedWordsArray.length === 0) {
      highlightIndex = 0;
    } else {
      // If the last character typed is a space, we just finished a word
      const atWordBoundary = newTypedText.endsWith(" ");
      let currentTargetWordPos = atWordBoundary ? typedWordsArray.length : typedWordsArray.length - 1;

      if (currentTargetWordPos >= targetWordsArray.length) {
        // Translation complete – dim all source words
        highlightIndex = sourceWordsArray.length;
      } else if (currentTargetWordPos === targetWordsArray.length - 1) {
        // Typing LAST target word – highlight LAST source word
        highlightIndex = Math.max(0, sourceWordsArray.length - 1);
      } else {
        // Map 1-to-1 up to the penultimate source word
        highlightIndex = Math.min(currentTargetWordPos, Math.max(0, sourceWordsArray.length - 2));
      }
    }

    setCurrentHighlightWordIndex(highlightIndex);
  }, [typedText, targetTranslationText, testActive, startTest, endTest, startTime, currentText]);

  const renderSourcePromptDisplay = () => {
    if (!currentText) return null;
    const sourceWords = currentText.split(" ").filter((w) => w !== "");
    return sourceWords.map((word, index) => {
      let className = "transition-colors duration-75";
      if (index < currentHighlightWordIndex) {
        className += isDark ? " text-gray-500" : " text-gray-400"; // Dimmed words
      } else if (index === currentHighlightWordIndex) {
        className += isDark ? " bg-blue-400/30" : " bg-blue-200"; // Active word highlight
      } else {
        className += isDark ? " text-gray-400" : " text-gray-700"; // Upcoming words
      }
      return (
        <span key={`src-word-${index}`}>
          <span className={className}>{word}</span>{" "}
        </span>
      );
    });
  };

  const renderTypedTranslation = () => {
    if (!targetTranslationText && typedText.length === 0) return null; // Return null if no target and no typed text
    // If there's typed text but no target (e.g. during initialization or error), display typed text without highlights
    if (!targetTranslationText && typedText.length > 0) {
      return typedText.split("").map((char: string, index: number) => (
        <span key={`typed-${index}`} className={isDark ? "text-gray-300" : "text-gray-700"}>{char}</span>
      )).concat(
        testActive || typedText.length > 0 ? 
        [<span key="typed-cursor" className={`cursor ${isDark ? "bg-blue-400/30" : "bg-blue-200"} opacity-100 animate-pulse`}>&nbsp;</span>] 
        : []
      );
    }

    return typedText.split("").map((char: string, index: number) => {
      let className = "transition-colors duration-75 ";
      if (index < targetTranslationText.length) {
        if (char === targetTranslationText[index]) {
          className += isDark ? "text-green-400" : "text-green-600";
        } else {
          className += isDark ? "text-red-400 bg-red-400/20" : "text-red-600 bg-red-100"; // Keep bg for incorrect
        }
      }
      return <span key={`typed-${index}`} className={className}>{char}</span>;
    }).concat(
      // Add a cursor at the end of the typed text
      testActive || typedText.length > 0 ? 
      [<span key="typed-cursor" className={`cursor ${isDark ? "bg-blue-400/30" : "bg-blue-200"} opacity-100 animate-pulse`}>&nbsp;</span>] 
      : []
    );
  };

  useEffect(() => {
    initializeTest()
  }, [initializeTest, sourceLanguage, translationLanguage])

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        initializeTest();
        return;
      }

      // If results are shown, or if an input/textarea/select elsewhere has focus, generally ignore typing keys
      const activeEl = document.activeElement;
      if (showResults || (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.tagName === "SELECT" || activeEl.hasAttribute("role")) && activeEl.getAttribute("role") !== "button" && activeEl.getAttribute("role") !== "menuitem")) {
        // Allow Enter/Escape for modals, etc. Tab is handled above.
        if (e.key !== "Enter" && e.key !== "Escape") {
             return;
        }
      }
      
      // Prevent default for space and backspace to avoid unwanted browser actions
      if (e.key === " ") {
        e.preventDefault();
      }
      if (e.key === "Backspace") {
        e.preventDefault(); 
      }

      // Process relevant typing keys
      if (e.key === "Backspace") {
        handleKeyPressLogic("Backspace");
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // e.key.length === 1 captures letters, numbers, symbols, and space.
        // Check for ctrlKey/metaKey/altKey to avoid capturing shortcuts.
        handleKeyPressLogic(e.key);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [initializeTest, handleKeyPressLogic, showResults]);

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
                <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Source Language</label>
                <Select value={sourceLanguage} onValueChange={(value: Language) => {
                  setSourceLanguage(value);
                  if (value === translationLanguage) {
                    setTranslationLanguage(value === "english" ? "spanish" : "english");
                  }
                }}>
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
                <label className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Translation Language</label>
                <Select value={translationLanguage} onValueChange={(value: Language) => {
                  setTranslationLanguage(value);
                  if (value === sourceLanguage) {
                    setSourceLanguage(value === "english" ? "spanish" : "english");
                  }
                }}>
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
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration selector removed */}
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

            {/* Source Prompt Display Area */}
            <Card className={`mt-6 w-full max-w-4xl mx-auto ${isDark ? "bg-gray-800/50 border-gray-700/50" : "bg-gray-50/50 border-gray-200/80 shadow-md"} backdrop-blur-sm`}>
              <CardContent className="p-6 text-lg font-mono text-gray-500 tracking-wider leading-relaxed break-all min-h-[100px] flex items-center justify-center">
                <div className={`text-center w-full ${isDark ? "text-gray-400" : "text-gray-600"}`} style={{ maxWidth: "80ch" }}>
                  {currentText ? renderSourcePromptDisplay() : <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>Loading source prompt...</span>}
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
                <div className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>{timeElapsed}s</div>
              </CardContent>
            </Card>
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
            <div className="text-xl leading-relaxed font-mono tracking-wide">{renderTypedTranslation()}</div>
          </CardContent>
        </Card>

        {/* Translation Display - Only show in Easy mode */}
        {currentMode === 'easy' && (
          <Card className={`mb-6 ${
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-200 shadow-lg backdrop-blur-sm"
          }`}>
            <CardContent className="p-6">
              <div className={`text-lg font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Translation
              </div>
              <div className={`text-xl leading-relaxed font-mono tracking-wide ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {targetTranslationText || 'No translation available'}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Modal */}
        <ResultsModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          onRestart={initializeTest}
          results={{
            mode: currentMode,
            language: sourceLanguage,
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
