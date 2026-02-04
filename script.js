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

  // Check if localStorage is available
  function isLocalStorageAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadNotes() {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return [];
    }
    try {
      const raw = localStorage.getItem(NOTES_STORAGE_KEY);
      if (!raw || raw === 'null' || raw === 'undefined') return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Ensure all notes have required fields
      return parsed.filter(n => n && n.id && n.text && n.createdAt);
    } catch (e) {
      console.error('Error loading notes:', e);
      return [];
    }
  }

  function saveNotes(notes) {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }
    try {
      // Ensure we're saving a valid array
      const validNotes = Array.isArray(notes) ? notes : [];
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(validNotes));
      return true;
    } catch (e) {
      console.error('Error saving notes:', e);
      // Handle quota exceeded error
      if (e.name === 'QuotaExceededError') {
        alert('Storage limit reached. Please delete some old messages.');
      }
      return false;
    }
  }

  function isExpired(note) {
    if (!note || !note.createdAt) return true;
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
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  function formatTimeRemaining(remainingMs) {
    if (remainingMs <= 0) return "Expired";
    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  function renderNotes() {
    if (!notesList) return;
    let notes = loadNotes();
    notes = cleanupExpired(notes);

    notesList.innerHTML = "";
    
    if (notes.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "note-empty";
      emptyMsg.textContent = "No messages yet. Be the first to leave one!";
      notesList.appendChild(emptyMsg);
      return;
    }

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
        expiry.textContent = `Expires in ${formatTimeRemaining(remainingMs)}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "note-delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
          const current = loadNotes();
          const filtered = current.filter(n => n.id !== note.id);
          if (saveNotes(filtered)) {
            renderNotes();
          }
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
    if (!text) {
      noteInput.focus();
      return;
    }

    const notes = cleanupExpired(loadNotes());
    const newNote = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
      text: text,
      createdAt: Date.now()
    };

    notes.push(newNote);
    if (saveNotes(notes)) {
      noteInput.value = "";
      renderNotes();
      // Scroll to the new note
      setTimeout(() => {
        if (notesList.firstChild) {
          notesList.firstChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  }

  if (submitNoteBtn && noteInput) {
    submitNoteBtn.addEventListener("click", addNote);
    noteInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        addNote();
      }
    });
  }

  // Initial render and periodic cleanup
  renderNotes();
  setInterval(() => {
    renderNotes();
  }, 60 * 1000); // refresh every minute

});
