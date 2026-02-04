// Password functions - available globally
const correctPassword = "jozefina";

function showPasswordPrompt() {
  const prompt = document.getElementById("passwordPrompt");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");
  
  if (!prompt || !input || !error) return;
  
  prompt.classList.add("show");
  input.value = "";
  error.textContent = "";
  setTimeout(() => input.focus(), 100);
}

function closePasswordPrompt() {
  const prompt = document.getElementById("passwordPrompt");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");
  
  if (!prompt || !input || !error) return;
  
  prompt.classList.remove("show");
  input.value = "";
  error.textContent = "";
}

function checkPassword() {
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");
  
  if (!input || !error) return;
  
  const enteredPassword = input.value.trim().toLowerCase();
  
  if (enteredPassword === correctPassword.toLowerCase()) {
    // Correct password - show message
    closePasswordPrompt();
    const hiddenElement = document.getElementById("hidden");
    if (hiddenElement) {
      hiddenElement.classList.add("show");
    }
    
    // Hide button after revealing message
    const button = document.querySelector(".reveal-btn");
    if (button) {
      button.style.display = "none";
    }
  } else {
    // Wrong password - show error
    error.textContent = "Incorrect password. Please try again.";
    input.value = "";
    input.focus();
    
    // Shake animation
    const promptBox = document.querySelector(".password-box");
    if (promptBox) {
      promptBox.classList.add("shake");
      setTimeout(() => {
        promptBox.classList.remove("shake");
      }, 500);
    }
  }
}

// Make functions globally accessible
window.showPasswordPrompt = showPasswordPrompt;
window.closePasswordPrompt = closePasswordPrompt;
window.checkPassword = checkPassword;

document.addEventListener("DOMContentLoaded", function () {
  // Allow Enter key to submit password
  const passwordInput = document.getElementById("passwordInput");
  if (passwordInput) {
    passwordInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        checkPassword();
      }
    });
  }
  
  // Close password prompt when clicking outside
  const passwordPrompt = document.getElementById("passwordPrompt");
  if (passwordPrompt) {
    passwordPrompt.addEventListener("click", function(e) {
      if (e.target === passwordPrompt) {
        closePasswordPrompt();
      }
    });
  }
  
  // Ensure password prompt is hidden on load
  if (passwordPrompt) {
    passwordPrompt.classList.remove("show");
  }

  // Target: April 9, 2026 (month 3 = April, since months are 0-indexed)
  const targetDate = new Date(2026, 3, 9, 0, 0, 0);

  function updateCountdown() {
    const now = new Date();
    let diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      setAllZero();
      return;
    }

    // Calculate total time units
    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Calculate actual months and remaining days accurately
    let months = 0;
    let days = 0;
    
    // Start from current date
    let tempDate = new Date(now);
    
    // Calculate months by adding months one at a time
    while (tempDate < targetDate) {
      const nextMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, tempDate.getDate());
      if (nextMonth <= targetDate) {
        months++;
        tempDate = nextMonth;
      } else {
        break;
      }
    }
    
    // Calculate remaining days
    days = Math.floor((targetDate.getTime() - tempDate.getTime()) / (1000 * 60 * 60 * 24));

    // Update display with zero-padding for better visual
    document.getElementById("months").textContent = months;
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = String(totalHours % 24).padStart(2, '0');
    document.getElementById("minutes").textContent = String(totalMinutes % 60).padStart(2, '0');
    document.getElementById("seconds").textContent = String(totalSeconds % 60).padStart(2, '0');
  }

  function setAllZero() {
    ["months","days","hours","minutes","seconds"].forEach(id => {
      document.getElementById(id).textContent = 0;
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== NOTE EDITOR WITH 24-HOUR AUTO-DELETE =====

  const NOTES_STORAGE_KEY = "jzf_temp_notes_v1";
  const NOTE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  const noteInput = document.getElementById("noteInput");
  const submitNoteBtn = document.getElementById("submitNote");
  const notesList = document.getElementById("notesList");

  function loadNotes() {
    try {
      const raw = localStorage.getItem(NOTES_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      return [];
    }
  }

  function saveNotes(notes) {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }

  function isExpired(note) {
    return Date.now() - note.createdAt >= NOTE_TTL_MS;
  }

  function cleanupExpired(notes) {
    const fresh = notes.filter(n => !isExpired(n));
    if (fresh.length !== notes.length) {
      saveNotes(fresh);
    }
    return fresh;
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleString();
  }

  function renderNotes() {
    if (!notesList) return;
    let notes = loadNotes();
    notes = cleanupExpired(notes);

    notesList.innerHTML = "";
    if (notes.length === 0) return;

    notes
      .sort((a, b) => b.createdAt - a.createdAt)
      .forEach(note => {
        const wrapper = document.createElement("div");
        wrapper.className = "note-item";

        const text = document.createElement("div");
        text.className = "note-text";
        text.textContent = note.text;

        const meta = document.createElement("div");
        meta.className = "note-meta";

        const time = document.createElement("span");
        time.textContent = `Posted: ${formatTime(note.createdAt)}`;

        const expiry = document.createElement("span");
        expiry.className = "note-expiry";
        const remainingMs = NOTE_TTL_MS - (Date.now() - note.createdAt);
        if (remainingMs > 0) {
          const remainingHrs = Math.floor(remainingMs / (60 * 60 * 1000));
          const remainingMin = Math.floor(
            (remainingMs % (60 * 60 * 1000)) / (60 * 1000)
          );
          expiry.textContent = `Expires in ~${remainingHrs}h ${remainingMin}m`;
        } else {
          expiry.textContent = "Expired";
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "note-delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
          const current = loadNotes();
          const filtered = current.filter(n => n.id !== note.id);
          saveNotes(filtered);
          renderNotes();
        });

        meta.appendChild(time);
        meta.appendChild(expiry);
        meta.appendChild(deleteBtn);

        wrapper.appendChild(text);
        wrapper.appendChild(meta);

        notesList.appendChild(wrapper);
      });
  }

  function addNote() {
    if (!noteInput) return;
    const text = noteInput.value.trim();
    if (!text) return;

    const notes = cleanupExpired(loadNotes());
    const newNote = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text,
      createdAt: Date.now()
    };

    notes.push(newNote);
    saveNotes(notes);
    noteInput.value = "";
    renderNotes();
  }

  if (submitNoteBtn && noteInput) {
    submitNoteBtn.addEventListener("click", addNote);
    noteInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        addNote();
      }
    });
  }

  // initial render and periodic cleanup
  renderNotes();
  setInterval(renderNotes, 60 * 1000); // refresh every minute

});
