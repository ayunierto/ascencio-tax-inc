import { useState, useEffect, useRef } from "react";

/**
 * useTimer Hook
 *
 * A custom React hook to manage a timer with start, pause, and reset functionality.
 *
 * @param {number} initialTime - The initial time in seconds for the timer.
 * @param {function} onTimerEnd - An optional function that executes when the timer reaches zero.
 * @returns {object} An object containing:
 * - timeRemaining: The current time remaining in seconds.
 * - isRunning: A boolean indicating whether the timer is currently running.
 * - startTimer: A function to start the timer.
 * - pauseTimer: A function to pause the timer.
 * - resetTimer: A function to reset the timer to its initial time.
 */
export const useTimer = (
  initialTime: number = 30, // Default initial time is 30 seconds
  onTimerEnd: () => void = () => {}
) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      onTimerEnd();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeRemaining, onTimerEnd]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeRemaining(initialTime);
  };

  return { timeRemaining, isRunning, startTimer, pauseTimer, resetTimer };
};
