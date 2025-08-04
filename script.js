const pianoKeys = document.querySelectorAll(".piano-keys .key"),
volumeSlider = document.querySelector(".volume-slider input"),
keysCheckbox = document.querySelector(".keys-checkbox input");

let allKeys = [],
audio = new Audio(`tunes/a.wav`); // by default, audio src is "a" tune

const playTune = (key) => {
    audio.src = `tunes/${key}.wav`; // passing audio src based on key pressed 
    audio.play(); // playing audio

    const clickedKey = document.querySelector(`[data-key="${key}"]`); // getting clicked key element
    clickedKey.classList.add("active"); // adding active class to the clicked key element
    setTimeout(() => { // removing active class after 150 ms from the clicked key element
        clickedKey.classList.remove("active");
    }, 150);
}

pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key); // adding data-key value to the allKeys array
    // calling playTune function with passing data-key value as an argument
    key.addEventListener("click", () => playTune(key.dataset.key));
});

const handleVolume = (e) => {
    audio.volume = e.target.value; // passing the range slider value as an audio volume
}

const showHideKeys = () => {
    // toggling hide class from each key on the checkbox click
    pianoKeys.forEach(key => key.classList.toggle("hide"));
}

const pressedKey = (e) => {
    // if the pressed key is in the allKeys array, only call the playTune function
    if(allKeys.includes(e.key)) playTune(e.key);
}

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);
// Add hover sound
const hoverSound = new Audio('tunes/hover.wav');
hoverSound.volume = 0.2;

pianoKeys.forEach(key => {
    key.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.play();
    });
});

// Theme Toggle
const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
});

// Auto Play - Classical Songs
const classicalSongs = {
    "Fur Elise": ["e", "d#", "e", "d#", "e", "b", "d", "c", "a"],
    "Twinkle Twinkle": ["c", "c", "g", "g", "a", "a", "g"]
};

const autoPlayBtn = document.getElementById("auto-play-btn");

autoPlayBtn.addEventListener("click", async () => {
    const song = classicalSongs["Fur Elise"]; // chọn bài
    for (let i = 0; i < song.length; i++) {
        playTune(song[i]);
        await new Promise(res => setTimeout(res, 400)); // delay
    }
});

// Record & Playback
let isRecording = false;
let recordedNotes = [];
let recordStartTime = 0;

const recordBtn = document.getElementById("record-btn");
const playbackBtn = document.getElementById("playback-btn");

// Ghi âm khi người chơi ấn phím
const playAndRecord = (key) => {
    playTune(key);
    if (isRecording) {
        recordedNotes.push({
            key,
            time: Date.now() - recordStartTime
        });
    }
}

// Ghi lại phím ấn chuột
pianoKeys.forEach(key => {
    key.addEventListener("click", () => playAndRecord(key.dataset.key));
});

// Ghi lại phím bàn phím
document.addEventListener("keydown", (e) => {
    if(allKeys.includes(e.key)) playAndRecord(e.key);
});

// Bắt đầu/kết thúc ghi âm
recordBtn.addEventListener("click", () => {
    if (!isRecording) {
        recordedNotes = [];
        recordStartTime = Date.now();
        isRecording = true;
        recordBtn.textContent = "Stop Recording";
    } else {
        isRecording = false;
        recordBtn.textContent = "Record";
    }
});

// Phát lại
playbackBtn.addEventListener("click", () => {
    if (recordedNotes.length === 0) return;
    for (let note of recordedNotes) {
        setTimeout(() => playTune(note.key), note.time);
    }
});
