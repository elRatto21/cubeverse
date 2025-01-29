"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface TimerState {
  time: number;
  isRunning: boolean;
  isPressed: boolean;
  pressStartTime: number;
  pressDuration: number;
}

const TimerPage = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    time: 0,
    isRunning: false,
    isPressed: false,
    pressStartTime: 0,
    pressDuration: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code !== "Space") return;

    e.preventDefault();

    setTimerState((prev) => {
      if (prev.isRunning) {
        const finalTime = performance.now() - startTimeRef.current;
        solveFinished(finalTime);
        return {
          ...prev,
          isRunning: false,
          time: finalTime,
        };
      }

      if (!prev.isPressed) {
        return {
          ...prev,
          isPressed: true,
          pressStartTime: performance.now(),
        };
      }

      return prev;
    });
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code !== "Space") return;

    e.preventDefault();

    setTimerState((prev) => {
      if (!prev.isRunning && prev.isPressed) {
        const currentPressDuration = performance.now() - prev.pressStartTime;

        if (currentPressDuration >= 500) {
          return {
            ...prev,
            isPressed: false,
            isRunning: true,
            pressDuration: 0,
            pressStartTime: 0,
            time: 0,
          };
        }

        return {
          ...prev,
          isPressed: false,
          pressDuration: currentPressDuration,
          pressStartTime: 0,
        };
      }
      return prev;
    });
  }, []);

  // Handle timer updates
  useEffect(() => {
    if (timerState.isRunning) {
      startTimeRef.current = performance.now();

      intervalRef.current = setInterval(() => {
        setTimerState((prev) => ({
          ...prev,
          time: performance.now() - startTimeRef.current,
        }));
      }, 10);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [timerState.isRunning]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor(((time % 3600000) % 60000) / 1000);
    const milliseconds = Math.floor(((time % 3600000) % 60000) % 1000);

    if (hours === 0 && minutes === 0) {
      return `${seconds}.${milliseconds.toString().padStart(3, "0")}`;
    }
    if (hours === 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
        .toString()
        .padStart(3, "0")}`;
    }
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  const solveFinished = (finalTime: number) => {
    console.log("Solve finished:", Math.floor(finalTime));
  };

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let animationFrame: number;

    if (timerState.isPressed) {
      const checkReady = () => {
        const holdDuration = performance.now() - timerState.pressStartTime;
        setIsReady(holdDuration >= 500);
        animationFrame = requestAnimationFrame(checkReady);
      };

      animationFrame = requestAnimationFrame(checkReady);
    } else {
      setIsReady(false);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [timerState.isPressed, timerState.pressStartTime]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        className={`text-xl mb-4 ${
          isReady ? "text-green-500" : "text-red-500"
        }`}
      >
        {isReady ? "Ready!" : "Hold space to start"}
      </div>
      <div className="text-6xl font-mono">{formatTime(timerState.time)}</div>
    </div>
  );
};

export default TimerPage;
