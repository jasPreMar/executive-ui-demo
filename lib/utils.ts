import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TimelineItem } from "@/data/items"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const getDayBoundaries = (date: Date, items: TimelineItem[]): { firstId?: number; lastId?: number } => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const itemsOnDay = items.filter((item) => {
    const itemDate = item.timestamp
    return itemDate >= startOfDay && itemDate <= endOfDay
  })

  if (itemsOnDay.length === 0) {
    return { firstId: undefined, lastId: undefined }
  }

  // The items are already sorted by timestamp, so the first is the first and last is the last.
  const firstId = itemsOnDay[0].id
  const lastId = itemsOnDay[itemsOnDay.length - 1].id

  return { firstId, lastId }
}

export function getWeekBoundaries(date: Date): { startOfWeek: Date; endOfWeek: Date } {
  const d = new Date(date)
  const day = d.getDay() // Sunday - 0, Monday - 1, ..., Saturday - 6
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday

  const startOfWeek = new Date(d.setDate(diffToMonday))
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return { startOfWeek, endOfWeek }
}

export function isYesterday(date: Date, todayDate: Date): boolean {
  const yesterday = new Date(todayDate)
  yesterday.setDate(todayDate.getDate() - 1)
  return isSameDay(date, yesterday)
}

export function isTomorrow(date: Date, todayDate: Date): boolean {
  const tomorrow = new Date(todayDate)
  tomorrow.setDate(todayDate.getDate() + 1)
  return isSameDay(date, tomorrow)
}
