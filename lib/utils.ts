import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes with the clsx utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
