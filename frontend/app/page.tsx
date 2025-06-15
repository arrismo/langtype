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
  // Track used prompt IDs for the current test session
  const [usedPromptIds, setUsedPromptIds] = useState<number[]>([]);
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

  const generateText = useCallback((isInitial: boolean = false) => {
    const promptsList = currentMode === 'easy' ? easyPrompts : hardPrompts;
    // Filter out prompts that have already been used
    const availablePrompts = promptsList.filter(p => !usedPromptIds.includes(p.id));
    const prompts = currentMode === 'easy' ? easyPrompts : hardPrompts;
    
    if (isInitial) {
      // For initial text, combine multiple prompts (no repeats)
      const numPrompts = 3;
      let combinedSource: string[] = [];
      let combinedTranslation: string[] = [];
      let chosenIds: number[] = [];
      let available = [...availablePrompts];
      for (let i = 0; i < numPrompts && available.length > 0; i++) {
        const idx = Math.floor(Math.random() * available.length);
        const randomPrompt = available[idx];
        available.splice(idx, 1);
        if (randomPrompt) {
          chosenIds.push(randomPrompt.id);
          const sourceWords = (randomPrompt[sourceLanguage] || "").split(" ");
          const translationWords = (randomPrompt[translationLanguage] || "").split(" ");
          combinedSource.push(...sourceWords);
          combinedTranslation.push(...translationWords);
        }
      }
      setUsedPromptIds(prev => [...prev, ...chosenIds]);
      return {
        source: combinedSource.join(" "),
        translation: combinedTranslation.join(" ")
      };
    } else {
      // For subsequent additions, just get one word from a random prompt
      // For subsequent additions, pick from unused prompts, or fallback to any if all are used
      let pool = availablePrompts.length > 0 ? availablePrompts : promptsList;
      const idx = Math.floor(Math.random() * pool.length);
      const randomPrompt = pool[idx];
      if (!randomPrompt) return { source: "", translation: "" };
      if (availablePrompts.length > 0) setUsedPromptIds(prev => [...prev, randomPrompt.id]);
      const sourceWords = (randomPrompt[sourceLanguage] || "").split(" ");
      const translationWords = (randomPrompt[translationLanguage] || "").split(" ");
      // Get a random word from the prompt
      const randomIndex = Math.floor(Math.random() * sourceWords.length);
      return {
        source: sourceWords[randomIndex] || "",
        translation: translationWords[randomIndex] || ""
      };
    }
  }, [sourceLanguage, translationLanguage, currentMode])

  const initializeTest = useCallback(() => {
    setUsedPromptIds([]); // Reset used prompts on test restart
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
    const generated = generateText(true);
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
    // Remove this check since we're generating text earlier now
    if (key !== "Backspace" && testActive && typedText.length >= targetTranslationText.length) {
      return;
    }

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

    // Remove this check since we're generating text earlier now

    const sourceWordsArray = currentText.split(" ").filter((w) => w !== "");
    const targetWordsArray = targetTranslationText.split(" ").filter((w) => w !== "");
    const typedWordsArray = newTypedText.trim().split(" ").filter((w) => w !== "");

    // Generate one new word when approaching the end
    if (typedWordsArray.length >= 5 && typedWordsArray.length >= targetWordsArray.length - 5) {
      const generated = generateText(false);
      if (generated.source && generated.translation) {
        setCurrentText(prev => prev + " " + generated.source);
        setTargetTranslationText(prev => prev + " " + generated.translation);
      }
    }

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
    if (!testActive && typedText.length === 0) {
      return <span className="text-gray-900 dark:text-white text-lg sm:text-3xl font-medium">Start typing the translation here...</span>;
    }
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
      <header className="flex items-center justify-between px-4 sm:px-8 py-2 border-b border-border">
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

      <div className="container mx-auto px-2 sm:px-4 py-4 max-w-full sm:max-w-4xl">
        {/* Test Configuration */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-6 mb-4 text-xs sm:text-sm">
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
        <div className="mb-2 text-center">
          <div className="text-lg sm:text-2xl leading-tight text-gray-400 max-w-full sm:max-w-4xl mx-auto whitespace-normal px-2 sm:px-4 break-words">
            {currentText ? renderSourcePromptDisplay() : <span className="text-gray-600">Loading source prompt...</span>}
          </div>
        </div>

        {/* Main Typing Area */}
        <div className="mb-2">
          <div className="text-xl sm:text-3xl leading-tight font-mono text-center max-w-full sm:max-w-4xl mx-auto min-h-[56px] sm:min-h-[80px] flex items-center justify-center break-words px-2 sm:px-0">
            <div className="w-full">
              {renderTypedTranslation()}
            </div>
          </div>
        </div>



        {/* Stats */}
        <div className="flex justify-center space-x-4 sm:space-x-8 text-xs sm:text-sm mt-2">
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
        <div className="mt-2 sm:mt-4">
          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-wrap justify-center mt-2 sm:mt-4 gap-2 sm:space-x-4">
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