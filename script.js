// ---- Playlist data ----
// Replace these src URLs with your own audio files (mp3/wav) for real songs.
const songs = [
  {
    title: "Track One",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Track Two",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Track Three",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Track Four",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

let currentIndex = 0;

// ---- DOM references ----
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeBar = document.getElementById("volumeBar");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const playlistEl = document.getElementById("playlist");
const autoplayToggle = document.getElementById("autoplayToggle");

// ---- Build playlist UI ----
function renderPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title + " — " + song.artist;
    if (index === currentIndex) li.classList.add("active");
    li.addEventListener("click", () => loadSong(index, true));
    playlistEl.appendChild(li);
  });
}

// ---- Load a song by index ----
function loadSong(index, autoplay) {
  currentIndex = index;
  const song = songs[currentIndex];
  audio.src = song.src;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  renderPlaylist();

  if (autoplay) {
    playSong();
  } else {
    playBtn.textContent = "▶";
  }
}

// ---- Helper: play and only update icon once playback actually starts ----
function playSong() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        playBtn.textContent = "⏸";
      })
      .catch((error) => {
        console.error("Playback failed:", error);
        playBtn.textContent = "▶";
      });
  }
}

// ---- Format seconds as m:ss ----
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// ---- Play / Pause ----
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
});

// ---- Next / Previous ----
nextBtn.addEventListener("click", () => {
  let nextIndex = (currentIndex + 1) % songs.length;
  loadSong(nextIndex, true);
});

prevBtn.addEventListener("click", () => {
  let prevIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex, true);
});

// ---- Update progress bar & time as song plays ----
audio.addEventListener("loadedmetadata", () => {
  progressBar.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progressBar.value = audio.currentTime;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// ---- Seek when user drags progress bar ----
progressBar.addEventListener("input", () => {
  audio.currentTime = progressBar.value;
});

// ---- Volume control ----
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
});

// ---- Keep play/pause icon in sync with actual audio state ----
audio.addEventListener("play", () => {
  playBtn.textContent = "⏸";
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
});

// ---- Auto-play next song when current ends (bonus feature) ----
audio.addEventListener("ended", () => {
  if (autoplayToggle.checked) {
    let nextIndex = (currentIndex + 1) % songs.length;
    loadSong(nextIndex, true);
  } else {
    playBtn.textContent = "▶";
  }
});

// ---- Initialize player ----
loadSong(currentIndex, false);