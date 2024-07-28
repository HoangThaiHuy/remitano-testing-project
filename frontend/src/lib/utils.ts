import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function arrayURLFetcher(...urlArr: any[]) {
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  return Promise.all(urlArr.map(fetcher));
}
