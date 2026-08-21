const root = document.documentElement;

const userInput = document.getElementById('userInput');
const terminalLog = document.getElementById('terminalLog');
const activeInputRow = document.getElementById('activeInputRow');

let isProcessing = false;
let movementTimer;
let lastX = -1000;
let lastY = -1000;

function triggerGlow() {
    root.style.setProperty('--glow-opacity', '1');
    clearTimeout(movementTimer);

    movementTimer = setTimeout(() => {
        root.style.setProperty('--glow-opacity', '0');
    }, 500);
}

window.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    root.style.setProperty('--mouse-x', `${lastX}px`);
    root.style.setProperty('--mouse-y', `${lastY}px`);
    triggerGlow();
});

window.addEventListener('scroll', () => {
    root.style.setProperty('--mouse-x', `${lastX}px`);
    root.style.setProperty('--mouse-y', `${lastY}px`);
    triggerGlow();
});

userInput.addEventListener('keydown', async (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();

        if (isProcessing) return;

        const question = userInput.value.trim();
        if (!question) return;

        isProcessing = true;

        const historyRow = document.createElement('div');
        historyRow.className = 'inputline';
        historyRow.innerHTML = `<span class="prefix"> PS C:\\Ask\\Something\\About\\Me&gt; </span><span class="past";">${question}</span>`;
        terminalLog.insertBefore(historyRow, activeInputRow);

        userInput.value = '';
        activeInputRow.style.display = 'none'; // CHANGED: hide entirely instead of dimming
        userInput.disabled = true;

        const loadingRow = document.createElement('div');
        loadingRow.className = 'inputline';
        loadingRow.style.color = '#F44747';
        loadingRow.style.paddingLeft = '20px';
        loadingRow.style.fontSize = '16px';
        loadingRow.style.marginTop = '4px';
        loadingRow.innerText = 'Reckoning...';
        terminalLog.insertBefore(loadingRow, activeInputRow);
        terminalLog.scrollTop = terminalLog.scrollHeight;

        try {
            const answer = await fetchAIResponse(question);

            loadingRow.remove();

            const answerRow = document.createElement('div');
            answerRow.className = 'inputline';
            answerRow.style.color = '#38ff70';
            answerRow.style.paddingLeft = '20px';
            answerRow.style.marginBottom = '15px';
            answerRow.style.marginTop = '10px';
            answerRow.style.fontSize = '16px';
            answerRow.innerText = answer || '⚠️ No response received.';
            terminalLog.insertBefore(answerRow, activeInputRow);

        } finally {
            activeInputRow.style.display = 'flex'; // CHANGED: bring it back (matches .inputline's display:flex)
            userInput.disabled = false;
            userInput.focus();
            terminalLog.scrollTop = terminalLog.scrollHeight;
            isProcessing = false;
        }
    }
});

async function fetchAIResponse(userQuestion) {
    try {
        const response = await fetch("/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: userQuestion})
        });

        const data = await response.json();
        return data.answer;
    } catch (error) {
        console.error("error details:", error);
        return "error";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const song = document.getElementById("song");
    const imgButton = document.getElementById("songbutton");

    song.volume = 0.5;

    window.toggleMusic = function() {
        if (song.paused) {
            song.play()
                .then(() => {
                    imgButton.src = "images/1067282812327490052.jpg";
                })
                .catch(error => {
                    console.error("Playback blocked by browser settings:", error);
                });
        } else {
            song.pause();
            imgButton.src = "images/1067282812327490052.jpg"
        }
    }
});

