document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const languageSelect = document.getElementById('language-select');
    const testModeSelect = document.getElementById('test-mode-select');
    const timeOptionsContainer = document.getElementById('time-options-container');
    const timeSelect = document.getElementById('time-select');
    const wordsOptionsContainer = document.getElementById('words-options-container');
    const wordsSelect = document.getElementById('words-select');
    const timerDisplayElement = document.getElementById('timer-display');
    const timeLeftElement = document.getElementById('time-left');
    const textToTypeElement = document.getElementById('text-to-type');
    const typingInputElement = document.getElementById('typing-input');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const startResetBtn = document.getElementById('start-reset-btn');

    // Results Modal Elements
    const resultsModal = document.getElementById('results-modal');
    const closeResultsBtn = document.getElementById('close-results-btn');
    const resultModeElement = document.getElementById('result-mode');
    const resultWpmElement = document.getElementById('result-wpm');
    const resultAccuracyElement = document.getElementById('result-accuracy');
    const resultCorrectCharsElement = document.getElementById('result-correct-chars');
    const resultIncorrectCharsElement = document.getElementById('result-incorrect-chars');
    const resultTimeTakenElement = document.getElementById('result-time-taken');
    const restartTestBtnModal = document.getElementById('restart-test-btn-modal');

    // State Variables
    let currentLanguage = 'english';
    let currentMode = 'practice'; // practice, time, words
    let timeSetting = 30; // Default time in seconds
    let wordCountSetting = 25; // Default word count

    let currentText = '';
    let testActive = false;
    let startTime;
    let timerInterval;
    let timeLeft = 0;

    let typedCharsCount = 0;
    let correctCharsInSession = 0;
    let errorsInSession = 0;

    // --- Text Generation ---
    function generateText() {
        const langTexts = sampleTexts[currentLanguage];
        if (!langTexts || langTexts.length === 0) return "No texts available.";

        if (currentMode === 'words') {
            let words = [];
            let availableWords = langTexts.join(' ').split(/\s+/).filter(w => w.length > 0);
            if (availableWords.length === 0) return "Not enough words for word count mode.";
            
            // Shuffle available words for variety
            for (let i = availableWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableWords[i], availableWords[j]] = [availableWords[j], availableWords[i]];
            }

            words = availableWords.slice(0, wordCountSetting);
            if (words.length < wordCountSetting) {
                 // If not enough unique words, allow repetition or inform user
                 console.warn(`Requested ${wordCountSetting} words, but only ${words.length} unique words available. Reusing words.`);
                 while(words.length < wordCountSetting && availableWords.length > 0) {
                    words.push(availableWords[Math.floor(Math.random() * availableWords.length)]);
                 }
            }
            return words.join(' ');
        } else { // Practice or Time mode
            return langTexts[Math.floor(Math.random() * langTexts.length)];
        }
    }

    // --- UI Updates & Initialization ---
    function updateModeSpecificUI() {
        timeOptionsContainer.style.display = currentMode === 'time' ? 'block' : 'none';
        wordsOptionsContainer.style.display = currentMode === 'words' ? 'block' : 'none';
        timerDisplayElement.style.display = currentMode === 'time' ? 'block' : 'none';
        initializeTest();
    }

    function initializeTest() {
        testActive = false;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        startTime = null;

        typedCharsCount = 0;
        correctCharsInSession = 0;
        errorsInSession = 0;

        currentText = generateText();
        textToTypeElement.innerHTML = '';
        currentText.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            textToTypeElement.appendChild(span);
        });

        typingInputElement.value = '';
        typingInputElement.disabled = false;
        typingInputElement.focus();

        wpmElement.textContent = '0';
        accuracyElement.textContent = '0';
        startResetBtn.textContent = 'Start';

        if (currentMode === 'time') {
            timeLeft = timeSetting;
            timeLeftElement.textContent = timeLeft;
        }
        hideResultsModal();
    }

    // --- Test Logic ---
    function startTest() {
        if (testActive) return; // Prevent re-starting if already active

        testActive = true;
        startTime = new Date().getTime(); // Record start time when first char is typed or test explicitly started
        // For time mode, timer starts immediately
        if (currentMode === 'time') {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timeLeft--;
                timeLeftElement.textContent = timeLeft;
                if (timeLeft <= 0) {
                    endTest();
                }
            }, 1000);
        }
        startResetBtn.textContent = 'Reset';
        typingInputElement.focus();
    }

    function endTest() {
        testActive = false;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        typingInputElement.disabled = true;

        const timeElapsedSeconds = (new Date().getTime() - startTime) / 1000;
        
        // Final WPM calculation
        // Based on correctly typed characters, standard is (correct chars / 5) / time_in_minutes
        const wpm = timeElapsedSeconds > 0 ? Math.round((correctCharsInSession / 5) / (timeElapsedSeconds / 60)) : 0;
        wpmElement.textContent = wpm;

        // Final Accuracy
        const accuracy = typedCharsCount > 0 ? Math.round((correctCharsInSession / typedCharsCount) * 100) : 0;
        accuracyElement.textContent = accuracy;

        showResultsModal(wpm, accuracy, timeElapsedSeconds);
        startResetBtn.textContent = 'Try Again';
    }

    function handleTyping() {
        if (!testActive && typingInputElement.value.length > 0 && currentMode !== 'time') {
            // For practice/words mode, start timer on first input if not already started
            // Time mode starts timer via 'Start' button click
            startTest(); 
        }
        if (!testActive && currentMode === 'time' && typingInputElement.value.length > 0) {
             // This case should ideally be handled by the start button for time mode
             // but as a fallback, if user types before clicking start in time mode:
             startTest();
        }

        if (!testActive && typingInputElement.value.length === 0) return; // Don't process if test not active and no input
        if (!testActive && currentMode === 'time') return; // In time mode, test must be explicitly started


        const typedText = typingInputElement.value;
        const textCharsSpans = textToTypeElement.querySelectorAll('span');
        
        correctCharsInSession = 0;
        errorsInSession = 0; // Recalculate errors based on current input
        typedCharsCount = typedText.length;

        textCharsSpans.forEach((charSpan, index) => {
            const typedChar = typedText[index];
            if (typedChar == null) { // Not yet typed
                charSpan.className = '';
            } else if (typedChar === charSpan.textContent) {
                charSpan.className = 'correct';
                if (index < typedCharsCount) correctCharsInSession++;
            } else { // Incorrectly typed
                charSpan.className = 'incorrect';
                if (index < typedCharsCount) errorsInSession++;
            }
        });

        // Reset styling for characters beyond current input length if user deletes
        for (let i = typedText.length; i < textCharsSpans.length; i++) {
            textCharsSpans[i].className = '';
        }

        // Live WPM and Accuracy
        if (startTime && typedCharsCount > 0) {
            const currentTime = new Date().getTime();
            const timeElapsedMinutes = (currentTime - startTime) / 60000;
            if (timeElapsedMinutes > 0) {
                const liveWpm = Math.round((correctCharsInSession / 5) / timeElapsedMinutes);
                wpmElement.textContent = liveWpm < 0 ? 0 : liveWpm;
            }
            const liveAccuracy = Math.round((correctCharsInSession / typedCharsCount) * 100);
            accuracyElement.textContent = liveAccuracy < 0 ? 0 : liveAccuracy;
        } else if (typedCharsCount === 0) {
            wpmElement.textContent = '0';
            accuracyElement.textContent = '0';
        }

        // Check for completion in 'words' or 'practice' mode
        if (currentMode === 'words' || currentMode === 'practice') {
            if (typedText.length === currentText.length) {
                endTest(); // Also ends if all typed, even with errors for words/practice
            }
        }
    }

    // --- Modal Logic ---
    function showResultsModal(wpm, accuracy, timeTaken) {
        resultModeElement.textContent = `${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} (${currentLanguage})`;
        resultWpmElement.textContent = wpm;
        resultAccuracyElement.textContent = accuracy;
        resultCorrectCharsElement.textContent = correctCharsInSession;
        resultIncorrectCharsElement.textContent = errorsInSession;
        resultTimeTakenElement.textContent = parseFloat(timeTaken).toFixed(2);
        resultsModal.style.display = 'flex';
    }

    function hideResultsModal() {
        resultsModal.style.display = 'none';
    }

    // --- Event Listeners Setup ---
    languageSelect.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        initializeTest();
    });

    testModeSelect.addEventListener('change', (event) => {
        currentMode = event.target.value;
        updateModeSpecificUI();
    });

    timeSelect.addEventListener('change', (event) => {
        timeSetting = parseInt(event.target.value, 10);
        if (currentMode === 'time') initializeTest(); // Re-init if in time mode
    });

    wordsSelect.addEventListener('change', (event) => {
        wordCountSetting = parseInt(event.target.value, 10);
        if (currentMode === 'words') initializeTest(); // Re-init if in words mode
    });

    startResetBtn.addEventListener('click', () => {
        if (!testActive || startResetBtn.textContent === 'Try Again' || startResetBtn.textContent === 'Start') {
            if (currentMode === 'time' && timeLeft === 0 && !testActive) { // After a timed test ended
                initializeTest(); // Reset settings for a new timed test
            }
            if (currentMode === 'time') {
                 initializeTest(); // Always re-initialize fully for time mode before start
                 startTest(); // Then explicitly start
            } else {
                initializeTest(); // For practice/words, init resets and user typing starts it
                                  // Or if they click start, it can also trigger startTest()
                // If user clicks 'Start' for practice/words, we can also call startTest()
                // but current logic starts on first type for these modes.
                // Let's make 'Start' button explicitly start for all modes if not active.
                startTest(); 
            }
        } else { // Test is active, button says 'Reset'
            initializeTest();
        }
    });

    typingInputElement.addEventListener('input', handleTyping);

    closeResultsBtn.addEventListener('click', hideResultsModal);

    restartTestBtnModal.addEventListener('click', () => {
        hideResultsModal();
        initializeTest();
        // For time mode, explicitly start the test again
        if (currentMode === 'time') {
            startTest();
        }
    });

    // Initial Setup
    updateModeSpecificUI(); // This also calls initializeTest()
});
