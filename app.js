document.addEventListener("DOMContentLoaded", () => {

  const audio = document.getElementById("radio");
  const button = document.getElementById("playBtn");
  const statusEl = document.getElementById("audioStatus");

  let playing = false;

  /* =========================
     Status helper
  ========================= */
  function setStatus(state) {
    statusEl.className = "audio-status " + state;

    if (state === "live") {
      statusEl.textContent = "🔴 LIVE";
    } else if (state === "paused") {
      statusEl.textContent = "⏸️ PAUSED";
    } else if (state === "error") {
      statusEl.textContent = "⚠️ ERROR";
    }
  }

  /* Initial state */
  setStatus("paused");

  /* =========================
     Button click handler
  ========================= */
  button.addEventListener("click", async () => {
    if (!playing) {
      try {
        await audio.play();
        playing = true;
        button.textContent = "Misa kancane ⏸️ Pause";
        setStatus("live");
        setMediaSession();
      } catch (err) {
        setStatus("error");
        alert("📢 Stream temporarily unavailable. Please select OK, then ▶️ PLAY again.");
      }
    } else {
      audio.pause();
      playing = false;
      button.textContent = "Dlala ▶️ Play";
      setStatus("paused");
    }
  });

  /* =========================
     Audio event listeners
  ========================= */
  audio.addEventListener("pause", () => {
    playing = false;
    button.textContent = "Dlala ▶️ Play";
    setStatus("paused");
  });

  audio.addEventListener("error", () => {
    playing = false;
    setStatus("error");
  });

  /* =========================
     Media Session API
  ========================= */
  function setMediaSession() {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Alfa Online Radio",
      artist: "Live Broadcast",
      artwork: [
        { src: "icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "icon-512.png", sizes: "512x512", type: "image/png" }
      ]
    });

    navigator.mediaSession.setActionHandler("play", async () => {
      try {
        await audio.play();
        playing = true;
        button.textContent = "Misa kancane ⏸️ Pause";
        setStatus("live");
      } catch {
        setStatus("error");
      }
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      audio.pause();
      playing = false;
      button.textContent = "Dlala ▶️ Play";
      setStatus("paused");
    });
  }

});
