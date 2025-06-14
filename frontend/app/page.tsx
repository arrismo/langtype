"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Timer, RotateCcw, Play, Pause, Trophy, Target, Zap, Settings, User, Crown, Info } from "lucide-react"
import { ResultsModal } from "./components/results-modal"
import { easyPrompts, hardPrompts, Prompt, Language as AppLanguage } from "./data/texts"
import { ThemeToggle } from "./components/theme-toggle"
import { useTheme } from "next-themes"

type TestMode = "easy" | "hard"
type Language = AppLanguage

type TimeDuration = 15 | 20 | 30 | 50;

export default function TypingTest() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [currentMode, setCurrentMode] = useState<TestMode>("easy")
  const [selectedDuration, setSelectedDuration] = useState<TimeDuration>(30)
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateText = useCallback(() => {
    const prompts = currentMode === 'easy' ? easyPrompts : hardPrompts;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    if (!randomPrompt) return { source: "", translation: "" };

    let sourceText = randomPrompt[sourceLanguage] || "";
    let translationText = randomPrompt[translationLanguage] || "";

    return { source: sourceText, translation: translationText };
  }, [sourceLanguage, translationLanguage, currentMode])

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

  useEffect(() => {
    if (timeElapsed >= selectedDuration) {
      endTest()
    }
  }, [timeElapsed, selectedDuration, endTest])

  const handleKeyPressLogic = useCallback((key: string) => {
    if (showResults) return;
    if (key !== "Backspace" && testActive && typedText.length >= targetTranslationText.length) return;

    let newTypedText = typedText;

    if (key === "Backspace") {
      if (newTypedText.length > 0) {
        newTypedText = newTypedText.slice(0, -1);
      }
    } else if (key.length === 1) {
      if (!testActive && newTypedText.length === 0) {
        startTest();
      }
      if (testActive || (newTypedText.length === 0)) {
        if (newTypedText.length < targetTranslationText.length) {
           newTypedText += key;
        }
      }
    } else {
      return;
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

    if (total === 0) {
      setWpm(0);
      setAccuracy(0);
    }

    const progressPercent = testActive ? (timeElapsed / selectedDuration) * 100 : 0;
    setProgress(Math.min(100, progressPercent));

    if (newTypedText.length >= targetTranslationText.length && targetTranslationText.length > 0) {
      endTest();
    }

    const sourceWordsArray = currentText.split(" ").filter((w) => w !== "");
    const targetWordsArray = targetTranslationText.split(" ").filter((w) => w !== "");
    const typedWordsArray = newTypedText.trim().split(" ").filter((w) => w !== "");

    let highlightIndex = 0;
    if (typedWordsArray.length === 0) {
      highlightIndex = 0;
    } else {
      const atWordBoundary = newTypedText.endsWith(" ");
      let currentTargetWordPos = atWordBoundary ? typedWordsArray.length : typedWordsArray.length - 1;

      if (currentTargetWordPos >= targetWordsArray.length) {
        highlightIndex = sourceWordsArray.length;
      } else if (currentTargetWordPos === targetWordsArray.length - 1) {
        highlightIndex = Math.max(0, sourceWordsArray.length - 1);
      } else {
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
        className += " text-gray-600"; // Dimmed words
      } else if (index === currentHighlightWordIndex) {
        className += " text-yellow-400"; // Active word highlight
      } else {
        className += " text-gray-400"; // Upcoming words
      }
      return (
        <span key={`src-word-${index}`}>
          <span className={className}>{word}</span>{" "}
        </span>
      );
    });
  };

  const renderTypedTranslation = () => {
    if (!targetTranslationText && typedText.length === 0) return null;
    if (!targetTranslationText && typedText.length > 0) {
      return typedText.split("").map((char: string, index: number) => (
        <span key={`typed-${index}`} className="text-foreground">{char}</span>
      )).concat(
        testActive || typedText.length > 0 ? 
        [<span key="typed-cursor" className="cursor bg-yellow-400 opacity-100 animate-pulse">&nbsp;</span>] 
        : []
      );
    }

    return typedText.split("").map((char: string, index: number) => {
      let className = "transition-colors duration-75 ";
      if (index < targetTranslationText.length) {
        if (char === targetTranslationText[index]) {
          className += "text-foreground";
        } else {
          className += "text-red-400 bg-red-400/20";
        }
      }
      return <span key={`typed-${index}`} className={className}>{char}</span>;
    }).concat(
      testActive || typedText.length > 0 ? 
      [<span key="typed-cursor" className="cursor bg-yellow-400 opacity-100 animate-pulse">&nbsp;</span>] 
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

      const activeEl = document.activeElement;
      if (showResults || (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.tagName === "SELECT" || activeEl.hasAttribute("role")) && activeEl.getAttribute("role") !== "button" && activeEl.getAttribute("role") !== "menuitem")) {
        if (e.key !== "Enter" && e.key !== "Escape") {
             return;
        }
      }
      
      if (e.key === " ") {
        e.preventDefault();
      }
      if (e.key === "Backspace") {
        e.preventDefault(); 
      }

      if (e.key === "Backspace") {
        handleKeyPressLogic("Backspace");
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        handleKeyPressLogic(e.key);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [initializeTest, handleKeyPressLogic, showResults]);



  if (!mounted) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">LT</span>
            </div>
            <span className="text-xl font-bold text-foreground">langtype</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Test Configuration */}
        <div className="flex items-center justify-center space-x-6 mb-8 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">source</span>
            <Select value={sourceLanguage} onValueChange={(value: Language) => {
              setSourceLanguage(value);
              if (value === translationLanguage) {
                setTranslationLanguage(value === "english" ? "spanish" : "english");
              }
            }}>
              <SelectTrigger className="w-24 h-8 bg-transparent border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="english">EN</SelectItem>
                <SelectItem value="spanish">ES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-500">target</span>
            <Select value={translationLanguage} onValueChange={(value: Language) => {
              setTranslationLanguage(value);
              if (value === sourceLanguage) {
                setSourceLanguage(value === "english" ? "spanish" : "english");
              }
            }}>
              <SelectTrigger className="w-24 h-8 bg-transparent border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="english">EN</SelectItem>
                <SelectItem value="spanish">ES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-500">mode</span>
            <Select value={currentMode} onValueChange={(value: TestMode) => {
              setCurrentMode(value);
              initializeTest();
            }}>
              <SelectTrigger className="w-24 h-8 bg-transparent border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-500">time</span>
            <Select value={selectedDuration.toString()} onValueChange={(value: string) => {
              setSelectedDuration(parseInt(value) as TimeDuration);
              initializeTest();
            }}>
              <SelectTrigger className="w-24 h-8 bg-transparent border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="15">15s</SelectItem>
                <SelectItem value="20">20s</SelectItem>
                <SelectItem value="30">30s</SelectItem>
                <SelectItem value="50">50s</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Language indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
            <span>{sourceLanguage}</span>
          </div>
        </div>

        {/* Source Text Display */}
        <div className="mb-8 text-center">
          <div className="text-lg leading-relaxed text-gray-400 max-w-3xl mx-auto">
            {currentText ? renderSourcePromptDisplay() : <span className="text-gray-600">Loading source prompt...</span>}
          </div>
        </div>

        {/* Main Typing Area */}
        <div className="mb-8">
          <div className="text-2xl leading-relaxed font-mono text-center max-w-3xl mx-auto min-h-[120px] flex items-center justify-center">
            <div className="w-full">
              {renderTypedTranslation()}
            </div>
          </div>
        </div>



        {/* Stats */}
        <div className="flex justify-center space-x-8 text-sm">
          <div className="text-center">
            <div className="text-yellow-400 text-2xl font-bold">{wpm}</div>
            <div className="text-gray-500">wpm</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 text-2xl font-bold">{accuracy}%</div>
            <div className="text-gray-500">acc</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 text-2xl font-bold">{timeElapsed}s</div>
            <div className="text-gray-500">time</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-center mt-8 space-x-4">
          <button 
            onClick={initializeTest}
            className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/80 rounded border border-border transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>restart test</span>
          </button>
        </div>

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