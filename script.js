document.addEventListener("DOMContentLoaded", function () {

  const correctPassword = "jozefina";

  function showPasswordPrompt() {
    const prompt = document.getElementById("passwordPrompt");
    const input = document.getElementById("passwordInput");
    const error = document.getElementById("passwordError");
    
    prompt.classList.add("show");
    input.value = "";
    error.textContent = "";
    input.focus();
  }

  function closePasswordPrompt() {
    const prompt = document.getElementById("passwordPrompt");
    const input = document.getElementById("passwordInput");
    const error = document.getElementById("passwordError");
    
    prompt.classList.remove("show");
    input.value = "";
    error.textContent = "";
  }

  function checkPassword() {
    const input = document.getElementById("passwordInput");
    const error = document.getElementById("passwordError");
    const enteredPassword = input.value.trim().toLowerCase();
    
    if (enteredPassword === correctPassword.toLowerCase()) {
      // Correct password - show message
      closePasswordPrompt();
      const hiddenElement = document.getElementById("hidden");
      hiddenElement.classList.add("show");
      
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
      promptBox.classList.add("shake");
      setTimeout(() => {
        promptBox.classList.remove("shake");
      }, 500);
    }
  }

  // Make functions globally accessible
  window.showPasswordPrompt = showPasswordPrompt;
  window.closePasswordPrompt = closePasswordPrompt;
  window.checkPassword = checkPassword;

  // Allow Enter key to submit password
  const passwordInput = document.getElementById("passwordInput");
  if (passwordInput) {
    passwordInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        checkPassword();
      }
    });
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

});
