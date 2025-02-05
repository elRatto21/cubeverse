"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Toggle } from "@/components/ui/toggle";
import { RefreshCcwIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

interface TimerState {
  time: number;
  isRunning: boolean;
  isPressed: boolean;
  pressStartTime: number;
  pressDuration: number;
}

interface UserPreferences {
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

  const [solves, setSolves] = useState<
    { time: number; dnf: boolean; plusTwo: boolean }[]
  >([]);

  const [userPrefrences] = useState<UserPreferences>({
    pressDuration: 300,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const timerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timerRef.current) {
      timerRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code !== "Space") return;

    e.preventDefault();

    if (timerRef.current) {
      timerRef.current.focus();
    }

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

        if (currentPressDuration >= userPrefrences.pressDuration) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const formatTime = (time: number | undefined | null): string => {
    if (
      time == undefined ||
      time == Infinity ||
      time == null ||
      time == -Infinity
    ) {
      return " ";
    }

    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor(((time % 3600000) % 60000) / 1000);
    const milliseconds = Math.floor((((time % 3600000) % 60000) % 1000) / 10);

    if (hours === 0 && minutes === 0) {
      return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
    }
    if (hours === 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const solveFinished = (finalTime: number) => {
    console.log("Solve finished:", Math.floor(finalTime));
    nextScramble();

    const solve = {
      time: Math.floor(finalTime),
      dnf: false,
      plusTwo: false,
    };

    solves.unshift(solve);

    genQuickStats();
  };

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let animationFrame: number;

    if (timerState.isPressed) {
      const checkReady = () => {
        const holdDuration = performance.now() - timerState.pressStartTime;
        setIsReady(holdDuration >= userPrefrences.pressDuration);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerState.isPressed, timerState.pressStartTime]);

  const [scrambles, setScrambles] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cube/scramble?count=3`)
      .then((res) => res.json())
      .then((data) => {
        setScrambles(data.scrambles);
      });
  }, []);

  const nextScramble = async () => {
    if (scrambles.length <= 2) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cube/scramble?count=10`
        );
        const data = await res.json();

        setScrambles((prev) => {
          const remaining = prev.slice(1);
          return [...remaining, ...data.scrambles];
        });
      } catch (error) {
        console.error("Failed to fetch new scrambles:", error);
      }
    } else {
      setScrambles((prev) => prev.slice(1));
    }
  };

  interface QuickStats {
    currentAo5: number | null;
    bestAo5: number | null;
    currentAo12: number | null;
    bestAo12: number | null;
    currentAo100: number | null;
    bestAo100: number | null;
    bestTime: number;
    worstTime: number;
  }

  const [quickStats, setQuickStats] = useState<QuickStats | undefined>(
    undefined
  );

  useEffect(() => {
    genQuickStats();
  }, [solves]);

  const calculateAverage = (times: number[]): number => {
    if (times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  };

  const calculateRollingAverage = (solves: any[], n: number): number[] => {
    if (solves.length < n) return [];

    const averages = [];

    for (let i = 0; i <= solves.length - n; i++) {
      const window = solves.slice(i, i + n);
      if (window.some((solve) => solve.dnf)) continue;

      const times = window.map((solve) => solve.time);
      if (n >= 5) {
        const sorted = [...times].sort((a, b) => a - b);
        const trimmed = sorted.slice(1, -1);
        averages.push(calculateAverage(trimmed));
      } else {
        averages.push(calculateAverage(times));
      }
    }

    return averages;
  };

  const genQuickStats = () => {
    let data = solves;

    data = data.filter((solve) => solve.dnf == false);

    const times = data.map((solve) => solve.time);

    const bestTime = Math.min(...times);
    const worstTime = Math.max(...times);

    const ao5s = calculateRollingAverage(data, 5);
    const ao12s = calculateRollingAverage(data, 12);
    const ao100s = calculateRollingAverage(data, 100);

    setQuickStats({
      currentAo5: ao5s.length > 0 ? ao5s[0] : null,
      bestAo5: ao5s.length > 0 ? Math.min(...ao5s) : null,

      currentAo12: ao12s.length > 0 ? ao12s[0] : null,
      bestAo12: ao12s.length > 0 ? Math.min(...ao12s) : null,

      currentAo100: ao100s.length > 0 ? ao100s[0] : null,
      bestAo100: ao100s.length > 0 ? Math.min(...ao100s) : null,

      bestTime,
      worstTime,
    });
  };

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/solve?limit=1000&type=history`
    )
      .then((res) => res.json())
      .then((data) => {
        setSolves(data.solves);
      });
  }, []);

  return (
    <>
      <div className="flex flex-col items-center pt-[30vh] min-h-screen w-full gap-10">
        <div className="flex flex-col justify-center items-center">
          <div className="text-gray-700 text-center text-xl">
            {scrambles[0]}
          </div>
          <Button size="icon" variant="ghost" onClick={() => nextScramble()}>
            <RefreshCcwIcon size={16} />
          </Button>
        </div>
        <div
          ref={timerRef}
          className={`text-7xl font-semibold w-max mx-auto text-left ${
            isReady && "text-green-500"
          }`}
        >
          {formatTime(timerState.time)}
        </div>
      </div>
      <Sidebar side="right" className="shadow-sm">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg mt-5">
              Previous solves
            </SidebarGroupLabel>
            <SidebarGroupContent className="h-[35dvh] overflow-y-scroll">
              {solves.map((solve, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between mx-auto w-[90%]"
                >
                  <div className="text-xl">{formatTime(solve.time)}</div>
                  <div className="flex items-center justify-center">
                    <Toggle>+2</Toggle>
                    <Toggle>DNF</Toggle>
                    <Button variant="ghost" size="icon">
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-lg mt-2">Stats</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-3 text-lg ml-2 mt-1">
              <div>
                <span className="font-bold">Single</span>
                <div className="flex justify-between w-[50%]">
                  Best:
                  <span className="font-semibold">
                    {formatTime(quickStats?.bestTime)}
                  </span>
                </div>
                <div className="flex justify-between w-[50%]">
                  Worst:
                  <span className="font-semibold">
                    {formatTime(quickStats?.worstTime)}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold">Ao5</span>
                <div className="flex justify-between w-[50%]">
                  Current:
                  <span className="font-semibold">
                    {formatTime(quickStats?.currentAo5)}
                  </span>
                </div>
                <div className="flex justify-between w-[50%]">
                  Best:
                  <span className="font-semibold">
                    {formatTime(quickStats?.bestAo5)}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold">Ao12</span>
                <div className="flex justify-between w-[50%]">
                  Current:
                  <span className="font-semibold">
                    {formatTime(quickStats?.currentAo12)}
                  </span>
                </div>
                <div className="flex justify-between w-[50%]">
                  Best:
                  <span className="font-semibold">
                    {formatTime(quickStats?.bestAo12)}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold">Ao100</span>
                <div className="flex justify-between w-[50%]">
                  Current:
                  <span className="font-semibold">
                    {formatTime(quickStats?.currentAo100)}
                  </span>
                </div>
                <div className="flex justify-between w-[50%]">
                  Best:
                  <span className="font-semibold">
                    {formatTime(quickStats?.bestAo100)}
                  </span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default TimerPage;
