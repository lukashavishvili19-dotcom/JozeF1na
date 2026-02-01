function showMore() {
  document.getElementById("hidden").style.display = "block";
}

// 🔒 FIXED TARGET DATE: April 9, 2026
const targetDate = new Date(2026, 3, 9, 0, 0, 0); // April = 3

function updateCountdown() {
  const now = new Date();
  let diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("months").textContent = 0;
    document.getElementById("days").textContent = 0;
    document.getElementById("hours").textContent = 0;
    document.getElementById("minutes").textContent = 0;
    document.getElementById("seconds").textContent = 0;
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Approximate months (romantic display, not calendar math)
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  document.getElementById("months").textContent = months;
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = totalHours % 24;
  document.getElementById("minutes").textContent = totalMinutes % 60;
  document.getElementById("seconds").textContent = totalSeconds % 60;
}

updateCountdown();
setInterval(updateCountdown, 1000);
