import { useEffect, useState } from "react";

export function useCountdownTimer(selectedDate, selectedHour, selectedMinute, selectedPeriod) {
  const [timeUnits, setTimeUnits] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false
  });

  useEffect(() => {
    if (!selectedDate) return;

    const targetDate = new Date(selectedDate);
    let hours = parseInt(selectedHour);

    if (selectedPeriod === "AM" && hours === 12) {
      hours = 0;
    } else if (selectedPeriod === "PM" && hours !== 12) {
      hours += 12;
    }

    targetDate.setHours(hours, parseInt(selectedMinute), 0, 0);

    const updateDisplay = () => {
      const currentTime = new Date();
      const timeDifference = targetDate - currentTime;

      if (timeDifference <= 0) {
        setTimeUnits(prev => ({ ...prev, isExpired: true }));
        return false; // Return false to indicate we should stop the interval
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      setTimeUnits({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        isExpired: false
      });

      return true; // Return true to continue the interval
    };

    // Initial update
    const shouldContinue = updateDisplay();
    if (!shouldContinue) return;

    // Set up interval
    const intervalId = setInterval(() => {
      const shouldContinue = updateDisplay();
      if (!shouldContinue) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [selectedDate, selectedHour, selectedMinute, selectedPeriod]);

  return timeUnits;
}
