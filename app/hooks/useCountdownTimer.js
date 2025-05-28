import { useEffect, useState } from "react";

export function useCountdownTimer(selectedDate, selectedHour, selectedMinute, selectedPeriod) {
  const [remainingTime, setRemainingTime] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    const targetDate = new Date(selectedDate);
    let hours = parseInt(selectedHour);

    if (selectedPeriod === "AM" && hours === 12) {
      hours = 0;
    } else if (selectedPeriod === "PM" && hours !== 12) {
      hours += 12;
    }

    targetDate.setHours(hours, parseInt(selectedMinute), 0, 0);

    const newIntervalId = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = targetDate - currentTime;

      if (timeDifference <= 0) {
        clearInterval(newIntervalId);
        setRemainingTime("Choose a future time");
      } else {
        const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutesLeft = Math.floor((timeDifference / (1000 * 60)) % 60);
        const secondsLeft = Math.floor((timeDifference / 1000) % 60);

        setRemainingTime(
          `${daysLeft}d ${hoursLeft < 10 ? `0${hoursLeft}` : hoursLeft}h ${minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft}m ${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s`
        );
      }
    }, 1000);

    setIntervalId(newIntervalId);

    return () => clearInterval(newIntervalId);
  }, [selectedDate, selectedHour, selectedMinute, selectedPeriod]);

  return remainingTime;
}
