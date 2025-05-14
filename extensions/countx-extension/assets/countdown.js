// document.addEventListener("DOMContentLoaded", function() {
//     const countdownWidgets = document.querySelectorAll('.countdown-widget');
  
//     countdownWidgets.forEach(function(widget) {
//       const countdownText = widget.querySelector('.countdown-text');
//       const countdownDisplay = widget.querySelector('.countdown-display');
      
//       // Set up the countdown text and date
//       const countdownDate = new Date("2025-12-31T00:00:00").getTime();
  
//       // Function to calculate and display the countdown
//       function updateCountdown() {
//         const now = new Date().getTime();
//         const timeRemaining = countdownDate - now;
  
//         if (timeRemaining <= 0) {
//           countdownDisplay.textContent = 'Expired';
//           clearInterval(countdownInterval);
//           return;
//         }
  
//         const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
//         countdownDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
//       }
  
//       // Update the countdown every second
//       const countdownInterval = setInterval(updateCountdown, 1000);
//       updateCountdown(); // Initial update
//     });
//   });
  

document.addEventListener("DOMContentLoaded", async function () {
  const countdownText = document.querySelector(".countdown-text");
  const countdownDisplay = document.querySelector(".countdown-display");

  try {
    // ✅ Fetch from your API route
    const response = await fetch('http://localhost:60992/api/countdown', {
      // credentials: "include", // Ensures cookies are sent if needed
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.countdown) {
      const { text, dateObject, time } = data.countdown;

      countdownText.textContent = text || "Countdown Timer";

      // Convert dateObject to a proper countdown timer
      const targetDate = new Date(dateObject);
      targetDate.setHours(...time.split(":")); // Set the hours & minutes from stored time

      function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
          countdownDisplay.textContent = "Time's up!";
          clearInterval(interval);
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        countdownDisplay.textContent = `${hours}:${minutes}:${seconds}`;
      }

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
    } else {
      countdownText.textContent = "No countdown found.";
    }
  } catch (error) {
    console.error("❌ Error fetching countdown:", error);
    countdownText.textContent = "Error loading countdown.";
  }
});
