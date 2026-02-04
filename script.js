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
      // Update message before showing (in case it changed)
      if (typeof window.updateHiddenMessage === 'function') {
        window.updateHiddenMessage();
      }
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

  // ===== MESSAGE EDITOR - UPDATES "VIEW MESSAGE" WITH 24-HOUR AUTO-DELETE =====

  const MESSAGE_STORAGE_KEY = "jzf_message_v1";
  const MESSAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
  const DEFAULT_MESSAGE = "nothing to say";

  const noteInput = document.getElementById("noteInput");
  const submitNoteBtn = document.getElementById("submitNote");
  const hiddenMessageElement = document.getElementById("hidden");

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

  function loadMessage() {
    if (!isLocalStorageAvailable()) {
      return null;
    }
    try {
      const raw = localStorage.getItem(MESSAGE_STORAGE_KEY);
      if (!raw || raw === 'null' || raw === 'undefined') return null;
      const message = JSON.parse(raw);
      if (!message || !message.text || !message.createdAt) return null;
      return message;
    } catch (e) {
      console.error('Error loading message:', e);
      return null;
    }
  }

  function saveMessage(text) {
    if (!isLocalStorageAvailable()) {
      return false;
    }
    try {
      const message = {
        text: text,
        createdAt: Date.now()
      };
      localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(message));
      return true;
    } catch (e) {
      console.error('Error saving message:', e);
      if (e.name === 'QuotaExceededError') {
        alert('Storage limit reached.');
      }
      return false;
    }
  }

  function isMessageExpired(message) {
    if (!message || !message.createdAt) return true;
    return Date.now() - message.createdAt >= MESSAGE_TTL_MS;
  }

  function updateHiddenMessage() {
    if (!hiddenMessageElement) return;
    
    const message = loadMessage();
    
    if (!message || isMessageExpired(message)) {
      // Show default message if expired or no message
      hiddenMessageElement.textContent = DEFAULT_MESSAGE;
      // Clear expired message from storage
      if (message && isMessageExpired(message)) {
        localStorage.removeItem(MESSAGE_STORAGE_KEY);
      }
    } else {
      // Show the stored message
      hiddenMessageElement.textContent = message.text;
    }
  }

  // Make updateHiddenMessage globally accessible
  window.updateHiddenMessage = updateHiddenMessage;

  function addMessage() {
    if (!noteInput) return;
    const text = noteInput.value.trim();
    if (!text) {
      noteInput.focus();
      return;
    }

    if (saveMessage(text)) {
      noteInput.value = "";
      updateHiddenMessage();
      // Show success feedback
      const btn = submitNoteBtn;
      const originalText = btn.textContent;
      btn.textContent = "Posted!";
      btn.style.background = "linear-gradient(135deg, #4caf50, #45a049)";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
      }, 2000);
    }
  }

  if (submitNoteBtn && noteInput) {
    submitNoteBtn.addEventListener("click", addMessage);
    noteInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        addMessage();
      }
    });
  }

  // Initial update and periodic cleanup
  updateHiddenMessage();
  setInterval(() => {
    updateHiddenMessage();
  }, 60 * 1000); // check every minute

});
