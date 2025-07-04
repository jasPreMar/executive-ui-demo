import type { TimelineItem, MeetingItem } from "@/data/items"
import { isSameDay } from "@/lib/utils"

export interface DayViewProps {
  headerText: string
  subHeaderText: string
  standoutItems: string[]
  calendarEvents: MeetingItem[]
  stats: {
    emailsReceived: number
    notesCreated: number
    tasksCompleted: number
  }
}

export function generateDayViewData(date: Date, items: TimelineItem[]): DayViewProps {
  const today = new Date()
  const isToday = isSameDay(date, today)

  const headerText = isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" })
  const subHeaderText = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // --- Process items to generate insights ---
  const standoutItems: string[] = []
  const calendarEvents: MeetingItem[] = []
  let emailsReceived = 0
  let notesCreated = 0
  let tasksCompleted = 0

  items.forEach((item) => {
    switch (item.type) {
      case "Meeting":
        calendarEvents.push(item)
        if (item.attendees.length > 2) {
          standoutItems.push(`Group meeting: ${item.title}`)
        }
        break
      case "Task":
        if (item.completed) {
          tasksCompleted++
        } else if (isSameDay(item.dueDate, date)) {
          standoutItems.push(`Due today: ${item.title}`)
        }
        break
      case "Email":
        emailsReceived++
        if (item.subject.toLowerCase().includes("urgent") || item.from.email.includes("client.com")) {
          standoutItems.push(`Important email from ${item.from.name}: "${item.subject}"`)
        }
        break
      case "Note":
        notesCreated++
        break
    }
  })

  // Sort calendar events by time
  calendarEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  return {
    headerText,
    subHeaderText,
    standoutItems: standoutItems.slice(0, 3), // Limit to 3 standouts
    calendarEvents,
    stats: {
      emailsReceived,
      notesCreated,
      tasksCompleted,
    },
  }
}
