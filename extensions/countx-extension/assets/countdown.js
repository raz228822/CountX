document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const textEl = document.querySelector(".countdown-text");
  const displayEl = document.querySelector(".countdown-display");

  loader.style.display = "block";

  const shop = Shopify.shop;
  const response = await fetch(`/apps/countdown?shop=${shop}`);
  const data = await response.json();

  loader.style.display = "none";

  if (data.error) {
    textEl.textContent = "Countdown unavailable.";
    return;
  }

  const countdown = data.countdown;
  textEl.textContent = countdown?.text || "No available countdown..";
  
  // Apply color to text
  if (countdown?.color) {
    textEl.style.color = countdown.color;
  }

  // Inject time unit containers into displayEl
  displayEl.innerHTML = `
    <div class="time-unit">
      <div class="number" id="days">00</div>
      <div class="label">days</div>
    </div>
    <span class="colon">:</span>
    <div class="time-unit">
      <div class="number" id="hours">00</div>
      <div class="label">hours</div>
    </div>
    <span class="colon">:</span>
    <div class="time-unit">
      <div class="number" id="minutes">00</div>
      <div class="label">minutes</div>
    </div>
    <span class="colon">:</span>
    <div class="time-unit">
      <div class="number" id="seconds">00</div>
      <div class="label">seconds</div>
    </div>
  `;

  // Apply colors to numbers and labels
  if (countdown?.color) {
    const numbers = document.querySelectorAll('.number');
    const labels = document.querySelectorAll('.label');
    const colons = document.querySelectorAll('.colon');
    
    numbers.forEach(num => num.style.color = countdown.color);
    labels.forEach(label => label.style.color = countdown.color + '99'); // 60% opacity
    colons.forEach(colon => colon.style.color = countdown.color);
  }

  if (countdown?.date && countdown?.time) {
    const dateStr = new Date(countdown.date).toISOString().split("T")[0];
    const dateTimeStr = `${dateStr} ${countdown.time}`;
    const countdownDate = new Date(dateTimeStr);

    if (isNaN(countdownDate.getTime())) {
      displayEl.textContent = "Invalid date/time format";
      return;
    }

    updateCountdownDisplay(countdownDate);
    setInterval(() => updateCountdownDisplay(countdownDate), 1000);
  } else {
    displayEl.textContent = "No deadline set.";
  }
});

function updateCountdownDisplay(deadline) {
  const now = new Date().getTime();
  const distance = deadline - now;

  if (distance < 0) {
    document.querySelector(".countdown-display").textContent = "Expired!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
