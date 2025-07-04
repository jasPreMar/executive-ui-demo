import type { TimelineItem, MeetingItem } from "@/data/items"
import { isSameDay } from "@/lib/utils"

interface DaySummary {
  date: Date
  meetings: MeetingItem[]
  tasks: number
  emails: number
  notes: number
}

export interface TwoDayViewData {
  headerText: string
  subHeaderText: string
  day1: DaySummary
  day2: DaySummary
}

export function generateTwoDayViewData(items: TimelineItem[]): TwoDayViewData {
  const uniqueDays = [
    ...new Set(
      items.map((item) => {
        const d = new Date(item.timestamp)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      }),
    ),
  ]
    .map((time) => new Date(time))
    .sort((a, b) => a.getTime() - b.getTime())

  const [day1Date, day2Date] = uniqueDays

  const createSummary = (date: Date): DaySummary => {
    const dayItems = items.filter((item) => isSameDay(item.timestamp, date))
    return {
      date,
      meetings: dayItems.filter((item): item is MeetingItem => item.type === "Meeting"),
      tasks: dayItems.filter((item) => item.type === "Task").length,
      emails: dayItems.filter((item) => item.type === "Email").length,
      notes: dayItems.filter((item) => item.type === "Note").length,
    }
  }

  const day1Summary = createSummary(day1Date)
  const day2Summary = createSummary(day2Date)

  const headerText = `${day1Date.toLocaleDateString("en-US", {
    weekday: "long",
  })} & ${day2Date.toLocaleDateString("en-US", { weekday: "long" })}`
  const subHeaderText = `${day1Date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${day2Date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

  return {
    headerText,
    subHeaderText,
    day1: day1Summary,
    day2: day2Summary,
  }
}
