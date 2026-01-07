// ===== DOM ELEMENTS =====
let play = document.getElementById('play');
let progressBar = document.getElementById('progressBar');
let volumeBar = document.getElementById('volumeBar');
let shuffle = document.getElementById('shuffle');
let repeat = document.getElementById('repeat');
let forward = document.getElementById('forward');
let backward = document.getElementById('backward');
let nowBar = document.querySelector('.now-bar');

let playMusic = Array.from(document.getElementsByClassName('playMusic'));
let allMusic = Array.from(document.getElementsByClassName('music-card'));

// ===== AUDIO =====
let audio = new Audio('Audio/1.mp3');
audio.volume = 0.7;

let currentSong = 1;
let songOnRepeat = false;
let songOnShuffle = false;

// ===== SONG DATA =====
const songs = [
  ...Array.from({ length: 18 }, (_, i) => ({
    songName: `Song ${i + 1}`,
    artist: 'Arijit Singh',
    songDes: `This is the description for song ${i + 1}`,
    songImage: `Images/${i + 1}.jpg`,
    songPath: `Audio/${i + 1}.mp3`
  }))
];

let order = [...songs];

// ===== UI HELPERS =====
function setPlayState(isPlaying) {
  play.classList.toggle('fa-circle-play', !isPlaying);
  play.classList.toggle('fa-circle-pause', isPlaying);
}

function makeAllPlay() {
  playMusic.forEach(icon => {
    icon.classList.remove('fa-circle-pause');
    icon.classList.add('fa-circle-play');
  });
}

function updateNowBar() {
  nowBar.querySelector('img').src = order[currentSong - 1].songImage;
  nowBar.querySelector('.img-title-info').innerText = order[currentSong - 1].songName;
  document.getElementById('currentTime').innerText = '0:00';
document.getElementById('totalDuration').innerText = '0:00';

}

// ===== LOAD MUSIC CARDS =====
allMusic.forEach((card, i) => {
  card.querySelector('img').src = songs[i].songImage;
  card.querySelector('.img-title').innerText = songs[i].songName;
  card.querySelector('.img-description').innerText = songs[i].artist;

});

// ===== PLAY / PAUSE =====
play.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  syncIcons();
});


// ===== CARD CLICK =====
playMusic.forEach(icon => {
  icon.addEventListener('click', e => {
    const clickedSong = Number(e.target.id);

    // SAME SONG → TOGGLE PLAY / PAUSE
    if (clickedSong === currentSong) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
    // DIFFERENT SONG → PLAY NEW
    else {
      currentSong = clickedSong;
      audio.src = order[currentSong - 1].songPath;
      audio.currentTime = 0;
      audio.play();
      updateNowBar();
    }

    syncIcons();
  });
});


// ===== PROGRESS BAR =====
audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;

  document.getElementById('currentTime').innerText =
    formatTime(audio.currentTime);

  progressBar.style.background =
    `linear-gradient(to right, #00d4ff ${progress}%, #333 ${progress}%)`;
});

// ===== VOLUME =====
volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
});

// ===== NEXT / PREV =====
function playNextSong() {
  currentSong = songOnRepeat
    ? currentSong
    : currentSong % songs.length + 1;

  audio.src = order[currentSong - 1].songPath;
  audio.currentTime = 0;
  audio.play();

  makeAllPlay();
  document.getElementById(String(currentSong))
    ?.classList.replace('fa-circle-play', 'fa-circle-pause');

  setPlayState(true);
  updateNowBar();
  syncIcons();
}



function playPrevSong() {
  currentSong = currentSong === 1 ? songs.length : currentSong - 1;

  audio.src = order[currentSong - 1].songPath;
  audio.currentTime = 0;
  audio.play();

  makeAllPlay();
  document.getElementById(String(currentSong))
    ?.classList.replace('fa-circle-play', 'fa-circle-pause');

  setPlayState(true);
  updateNowBar();
  syncIcons();
}


// ===== SHUFFLE / REPEAT =====
shuffle.addEventListener('click', () => {
  songOnShuffle = !songOnShuffle;
  shuffle.classList.toggle('active', songOnShuffle);
  repeat.classList.remove('active');

  order = songOnShuffle
    ? [...songs].sort(() => Math.random() - 0.5)
    : [...songs];
});

repeat.addEventListener('click', () => {
  songOnRepeat = !songOnRepeat;
  repeat.classList.toggle('active', songOnRepeat);
  shuffle.classList.remove('active');
});

// ===== AUTOPLAY =====
audio.addEventListener('ended', playNextSong);
forward.addEventListener('click', playNextSong);
backward.addEventListener('click', playPrevSong);


function syncIcons() {
  // reset all card icons
  makeAllPlay();

  // update active card
  const activeIcon = document.getElementById(String(currentSong));
  if (activeIcon && !audio.paused) {
    activeIcon.classList.replace('fa-circle-play', 'fa-circle-pause');
  }

  // update main play button
  setPlayState(!audio.paused);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('loadedmetadata', () => {
  document.getElementById('totalDuration').innerText =
    formatTime(audio.duration);
});
