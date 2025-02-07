import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  const dateObj = new Date(date);

  console.log(dateObj)

  const formattedDate = `${dateObj.getUTCDate()}.${dateObj.getUTCMonth().toString().padStart(2, '0')}.${dateObj.getFullYear()}`

  return formattedDate;
}

export function formatSolveTime (time: number | undefined | null): string {
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
