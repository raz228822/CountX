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
        setRemainingTime("Time's up!");
      } else {
        const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setRemainingTime(
          `${hoursLeft}:${minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft}:${
            secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft
          }`
        );
      }
    }, 1000);

    setIntervalId(newIntervalId);

    return () => clearInterval(newIntervalId);
  }, [selectedDate, selectedHour, selectedMinute, selectedPeriod]);

  return remainingTime;
}
