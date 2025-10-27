import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateForDisplay(date: Date): string {
  return format(date, "dd/MM/yyyy")
}

export function formatDateForStorage(date: Date): string {
  return format(date, "yyyy-MM-dd")
}
