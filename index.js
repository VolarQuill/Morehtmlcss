const root = document.documentElement;

// ADD THESE THREE LINES: Your script needs these targets defined at the top
const userInput = document.getElementById('userInput');
const terminalLog = document.getElementById('terminalLog');
const activeInputRow = document.getElementById('activeInputRow');

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

        const question = userInput.value.trim();
        if (!question) return;
        
        const historyRow = document.createElement('div');
        historyRow.className = 'inputline';
        historyRow.innerHTML = `<span class="prefix"> PS C:\\Ask\\Something\\About\\Me&gt; </span><span style="color: white;">${question}</span>`;
        terminalLog.insertBefore(historyRow, activeInputRow);

        userInput.value = '';
        activeInputRow.style.opacity = '0.4';
        userInput.disabled = true;

        const answer = await fetchAIResponse(question);
        const answerRow = document.createElement('div');
        answerRow.className = 'inputline';
        answerRow.style.color = '#38ff70';
        answerRow.style.paddingLeft = '20px';
        answerRow.style.marginBottom = '15px';
        answerRow.innerText = answer;
        
        // FIXED: Changed 'innerBefore' to 'insertBefore'
        terminalLog.insertBefore(answerRow, activeInputRow);

        activeInputRow.style.opacity = '1';
        userInput.disabled = false;
        userInput.focus();

        terminalLog.scrollTop = terminalLog.scrollHeight;
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

