const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

const sound = document.getElementById("clickSound");
const themeToggle = document.getElementById("themeToggle");

let current = "";

/* BUTTON CLICK */
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        playSound();
        handleInput(btn.innerText);
    });
});

/* HANDLE INPUT */
function handleInput(value) {
    if (value === "C") {
        current = "";
    } else if (value === "⌫") {
        current = current.slice(0, -1);
    } else if (value === "=") {
        try {
            current = eval(current.replace("×","*").replace("÷","/"));
        } catch {
            current = "Error";
        }
    } else {
        current += value;
    }
    display.innerText = current || "0";
}

/* KEYBOARD SUPPORT */
document.addEventListener("keydown", e => {
    const key = e.key;
    if ("0123456789+-*/.".includes(key)) {
        current += key;
    } else if (key === "Enter") {
        current = eval(current);
    } else if (key === "Backspace") {
        current = current.slice(0, -1);
    } else if (key === "Escape") {
        current = "";
    }
    display.innerText = current || "0";
});

/* THEME TOGGLE */
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
    themeToggle.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* SOUND */
function playSound() {
    sound.currentTime = 0;
    sound.play();
}

/* AUDIO CLICK USING WEB AUDIO API */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.1
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}
