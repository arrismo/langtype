document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');
    const textToTypeElement = document.getElementById('text-to-type');
    const typingInputElement = document.getElementById('typing-input');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const nextTextBtn = document.getElementById('next-text-btn');

    let currentLanguage = 'english';
    let currentText = '';
    let startTime;
    let timerInterval; // For live WPM update if needed, or just calculate at end/on input

    function getRandomText(lang) {
        const texts = sampleTexts[lang];
        if (!texts || texts.length === 0) {
            return "No texts available for this language.";
        }
        return texts[Math.floor(Math.random() * texts.length)];
    }

    function displayText() {
        currentText = getRandomText(currentLanguage);
        textToTypeElement.innerHTML = ''; // Clear previous text
        currentText.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            textToTypeElement.appendChild(span);
        });
        typingInputElement.value = '';
        typingInputElement.focus();
        resetSession();
    }

    function resetSession() {
        startTime = null;
        if (timerInterval) clearInterval(timerInterval);
        wpmElement.textContent = '0';
        accuracyElement.textContent = '0';
        typingInputElement.disabled = false;
        // Reset styles on the text to type
        textToTypeElement.querySelectorAll('span').forEach(span => span.className = '');
    }

    function updateDisplayAndStats() {
        const typedText = typingInputElement.value;
        const textCharsSpans = textToTypeElement.querySelectorAll('span');
        let correctCharsCount = 0;
        let errorsCount = 0;

        if (!startTime && typedText.length > 0) {
            startTime = new Date().getTime();
        }

        textCharsSpans.forEach((charSpan, index) => {
            const typedChar = typedText[index];
            if (typedChar == null) { // Not yet typed
                charSpan.className = '';
            } else if (typedChar === charSpan.textContent) {
                charSpan.className = 'correct';
                correctCharsCount++;
            } else { // Incorrectly typed
                charSpan.className = 'incorrect';
                errorsCount++;
            }
        });
        
        // Reset styling for characters beyond current input length if user deletes
        for (let i = typedText.length; i < textCharsSpans.length; i++) {
            textCharsSpans[i].className = '';
        }

        // Calculate WPM
        if (startTime && typedText.length > 0) {
            const currentTime = new Date().getTime();
            const timeElapsedMinutes = (currentTime - startTime) / 60000;
            
            if (timeElapsedMinutes > 0) {
                // WPM = (correct characters / 5) / time in minutes
                const wpm = Math.round((correctCharsCount / 5) / timeElapsedMinutes);
                wpmElement.textContent = wpm < 0 ? 0 : wpm;
            } else {
                wpmElement.textContent = '0';
            }
        } else {
            wpmElement.textContent = '0';
        }

        // Calculate Accuracy
        const totalTypedChars = typedText.length;
        if (totalTypedChars > 0) {
            const accuracy = Math.round((correctCharsCount / totalTypedChars) * 100);
            accuracyElement.textContent = accuracy < 0 ? 0 : accuracy;
        } else {
            accuracyElement.textContent = '0'; 
        }

        // Check if text is fully and correctly typed
        if (typedText.length === currentText.length && errorsCount === 0) {
            // Optionally, disable input or show a "completed" message
            // typingInputElement.disabled = true; // Example: disable input on correct completion
            // Could also automatically fetch next text or highlight the "Next Text" button
        }
    }

    typingInputElement.addEventListener('input', updateDisplayAndStats);

    languageSelect.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        displayText();
    });

    nextTextBtn.addEventListener('click', () => {
        displayText();
    });

    // Initial load
    displayText();
});
