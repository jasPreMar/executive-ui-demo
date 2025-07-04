import type { TimelineItem, MeetingItem, TaskItem } from "@/data/items"
import { today } from "@/data/items"

export interface WeekViewData {
  headerText: string
  subHeaderText: string
  standoutItems: string[]
  keyMeetings: MeetingItem[]
  tasksSummary: {
    pending: TaskItem[]
    completed: TaskItem[]
  }
  stats: {
    totalEmails: number
    totalNotes: number
  }
}

export function generateWeekViewData(items: TimelineItem[], weekStart: Date, weekEnd: Date): WeekViewData {
  const standoutItems: string[] = []
  const keyMeetings: MeetingItem[] = []
  const pendingTasks: TaskItem[] = []
  const completedTasks: TaskItem[] = []
  let totalEmails = 0
  let totalNotes = 0

  // Identify standout items and categorize
  items.forEach((item) => {
    switch (item.type) {
      case "Meeting":
        if (item.title.toLowerCase().includes("client") || item.attendees.length > 3) {
          keyMeetings.push(item)
          standoutItems.push(
            `Key meeting: ${item.title} on ${item.timestamp.toLocaleDateString("en-US", { weekday: "short" })}`,
          )
        }
        break
      case "Task":
        if (item.completed) {
          completedTasks.push(item)
        } else {
          pendingTasks.push(item)
          if (item.title.toLowerCase().includes("finalize") || item.title.toLowerCase().includes("prepare")) {
            standoutItems.push(`High-priority task: ${item.title}`)
          }
        }
        break
      case "Email":
        totalEmails++
        if (item.subject.toLowerCase().includes("urgent") || item.from.email.includes("client.com")) {
          standoutItems.push(`Important email from ${item.from.name}: "${item.subject}"`)
        }
        break
      case "Note":
        totalNotes++
        break
    }
  })

  // Sort meetings by date
  keyMeetings.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  const isThisWeek = today >= weekStart && today <= weekEnd

  const headerText = isThisWeek
    ? "This Week"
    : `Week of ${weekStart.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}`

  const subHeaderText = `${weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

  return {
    headerText,
    subHeaderText,
    standoutItems: standoutItems.slice(0, 4), // Limit to 4 standouts for the week
    keyMeetings,
    tasksSummary: {
      pending: pendingTasks,
      completed: completedTasks,
    },
    stats: {
      totalEmails,
      totalNotes,
    },
  }
}
