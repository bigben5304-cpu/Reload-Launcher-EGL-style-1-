import { useEffect, useState } from "react";

export type Build = {
  id: string;
  name: string;
  path: string;
  season: number;
  version: string;
};

export type User = { name: string; email: string };

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export const seasonImage = (season: number) =>
  `/versions/Season${Math.min(Math.max(season || 1, 1), 42)}.jpg`;
