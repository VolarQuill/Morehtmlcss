const root = document.documentElement;

const userInput = document.getElementById('userInput');
const terminalLog = document.getElementById('terminalLog');
const activeInputRow = document.getElementById('activeInputRow');

 document.querySelectorAll('.name2').forEach((card) => {
    function handleMove(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height /2;   
        const maxTilt = 14; //Degrees

        const tiltY = ((centerY - y) / centerY) * maxTilt;
        const tiltX = ((x - centerX) / centerX) * maxTilt;

        card.style.setProperty('--tilt-y', `${tiltY}deg`);
        card.style.setProperty('--tilt-x', `${tiltX}deg`);

        card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
        card.style.setProperty('--glow-opacity', '1');
    }

    function resetCard() {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--glow-opacity', '0');
    }

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', resetCard);
});

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


    const localCommands = {
        about: "Hey - So my Creator is a high schooler with some hobbies, and he made this as a cool personal site, and a cooler terminal bot, who is talking to you right now.",
        help: "Available commands: about, help, music, clear. Type one and hit Enter, or click a button above.",
        music: "Scroll up and hit play on the music player — full playlist is under 'Music that I Like'."
    };

    async function fetchAIResponse(question) {                  //AI response terminal
        const response = await fetch('api/ask.js', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ question })
        });

        const data = await responsee.json();

        if(!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data.answer;
    }

    async function runCommand(question) {               //questions terminal
        if (isProcessing) return;
        if(!question) return;

        const lower = question.toLowerCase();

        if (lower === 'clear') {
            Array.from(terminalLog.children).forEach(row => {
                if (row !== activeInputRow) row.remove();
            });
            userInput.value = '';
            return;
        }
            
        isProcessing = true;

        try{
            const historyRow = document.createElement('div');
            historyRow.className = 'inputline';
            historyRow.innerHTML = `<span class="prefix"> PS C:\\Ask\\Something\\About\\Me&gt; </span><span class="past";">${question}</span>`;
            terminalLog.insertBefore(historyRow, activeInputRow);

            userInput.value = '';
            activeInputRow.style.display = 'none';
            userInput.disabled = true;

            const loadingRow = document.createElement('div');
            loadingRow.className = 'inputline';
            loadingRow.style.color = '#F33737';
            loadingRow.style.paddingLeft = '20px';
            loadingRow.style.fontSize = '16px';
            loadingRow.style.marginTop = '4px';
            loadingRow.innerText = 'Reckoning...';
            terminalLog.insertBefore(loadingRow, activeInputRow);
            terminalLog.scrollTop = terminalLog.scrollHeight;

            const textToType = localCommands.hasOwnProperty(lower)
                ? localCommands[lower]
                : await (async () => {
                    try {
                        return (await fetchAIResponse(question)) || 'No Response Received';
                    } catch (err) {
                        console.error('AI fetch failed:', err);
                        return 'Something broke trying to Reach the AI. Try Again later.';
                    }
                })();

            loadingRow.remove();

            const answerRow = document.createElement('div');
            answerRow.className = 'inputline';
            answerRow.style.color = '#38ff70';
            answerRow.style.paddingLeft = '20px';
            answerRow.style.marginBottom = '15px';
            answerRow.style.marginTop = '10px';
            answerRow.style.fontSize = '16px';

            answerRow.textContent = '';
            terminalLog.insertBefore(answerRow, activeInputRow);

            await new Promise((resolve) => {
                let index = 0;
                function type() {
                    if (index < textToType.length) {
                        answerRow.innerHTML += textToType.charAt(index);
                        index++;
                        terminalLog.scrollTop = terminalLog.scrollHeight;
                        setTimeout(type, 30);
                    }   else {
                        resolve();
                    }
                }dawd
                type();
            }); 
        } catch (error) {
            console.error("Processing error:", error);
        }   finally {
            activeInputRow.style.display = 'flex';
            userInput.disabled = false;
            userInput.focus();
            terminalLog.scrollTop = terminalLog.scrollHeight;
            isProcessing = false;
        }
    }

userInput.addEventListener('keydown', async (e) => {           //--Terminal stuff Enter key
    if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        runCommand(userInput.value.trim());
    }
});
    
    document.querySelectorAll('.help').forEach(btn => {
        btn.addEventListener('click', () => {
            runCommand(btn.textContent.trim().toLowerCase());
        });
    });


window.addEventListener("DOMContentLoaded", () => {     //the spotify music button
    const song = document.getElementById("song"); 
    const imgButton = document.getElementById("songbutton");

    song.volume = 0.9;

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
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll');
    elementsToAnimate.forEach(element => {
        scrollObserver.observe(element);
    });

});

document.querySelectorAll('.pincard').forEach((pin) =>{
    let rafId = null;
    let pendingEvent = null;

    pin.addEventListener('mouseenter', () => {
        pin.style.transition = 'transform 0s linear';
    });

    function applyTilt(){
        const e = pendingEvent;
        rafId = null;
        if (!e) return;

        const rect = pin.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const maxTilt = 16;

        const tiltY = ((centerY - y) / centerY) * maxTilt;
        const tiltX = ((x - centerX) / centerX) * maxTilt;

        pin.style.setProperty('--tilt-y', `${tiltY}deg`);
        pin.style.setProperty('--tilt-x', `${tiltX}deg`);
    }
    
    function handleMove(e) {
        pendingEvent = e;
        if (rafId === null) {
            rafId = requestAnimationFrame(applyTilt);
        }
    }
    
    function resetPin() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        pin.style.transition = 'transform 0.3s ease-out';
        pin.style.setProperty('--tilt-x', '0deg');
        pin.style.setProperty('--tilt-y', '0deg');
    }

    pin.addEventListener('mousemove', handleMove);
    pin.addEventListener('mouseleave', resetPin);
});

document.querySelectorAll('.navlink').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const target = document.getElementById(targetId);
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'start'});
    });
});