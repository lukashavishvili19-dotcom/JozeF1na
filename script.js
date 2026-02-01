document.addEventListener("DOMContentLoaded", function () {

  function showMore() {
    document.getElementById("hidden").style.display = "block";
  }
  window.showMore = showMore; // keep button working

  // Target: April 9, 2026
  const targetDate = new Date(2026, 3, 9, 0, 0, 0);

  function updateCountdown() {
    const now = new Date();
    let diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      setAllZero();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;

    document.getElementById("months").textContent = months;
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = totalHours % 24;
    document.getElementById("minutes").textContent = totalMinutes % 60;
    document.getElementById("seconds").textContent = totalSeconds % 60;
  }

  function setAllZero() {
    ["months","days","hours","minutes","seconds"].forEach(id => {
      document.getElementById(id).textContent = 0;
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

});
