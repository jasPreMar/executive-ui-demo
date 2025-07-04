export interface TimelineItem {
  id: number
  type: "Meeting" | "Email" | "Note" | "Task"
  details: string
  title: string
  content: string
  timestamp: Date
}

export const today = new Date()
today.setHours(12, 0, 0, 0) // Normalize today to noon

const itemTemplates = {
  Meeting: {
    titles: ["Project Sync", "1-on-1", "Team Standup", "Client Call", "Design Review"],
    details: ["with John", "with Sarah", "with the team", "with Acme Corp"],
    contents: [
      "Discussing the Q3 roadmap and new feature proposals.",
      "Weekly check-in to discuss progress and challenges.",
      "Quick daily update on tasks.",
      "Presenting the new proposal to the client.",
    ],
  },
  Email: {
    titles: ["Re: Project Update", "Fwd: Important Announcement", "Quick Question", "Meeting Follow-up"],
    details: ["john@company.com", "sarah@client.com", "team@internal.com", "hr@company.com"],
    contents: [
      "Thanks for the update. The progress looks great.",
      "Please see the announcement below regarding the office move.",
      "Do you have a moment to discuss the latest designs?",
      "Here are the notes from our meeting earlier today.",
    ],
  },
  Note: {
    titles: ["Brainstorming Ideas", "Meeting Notes", "To-Do List", "Draft for Blog Post"],
    details: ["Personal", "Work", "Project X"],
    contents: [
      "Some ideas for the new marketing campaign.",
      "Key takeaways from the Q2 review meeting.",
      "1. Finish report. 2. Call Mom. 3. Buy groceries.",
      "An outline for the upcoming blog post on web design trends.",
    ],
  },
  Task: {
    titles: ["Finalize Q3 budget", "Prepare presentation", "Review PR #123", "Onboard new hire"],
    details: ["Finance", "Marketing", "Engineering", "HR"],
    contents: [
      "Review the department's spending and finalize the budget.",
      "Create slides for the upcoming client presentation.",
      "Review the code changes in the pull request and provide feedback.",
      "Prepare the onboarding materials for the new software engineer.",
    ],
  },
}

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const generateTimelineItems = (count: number): TimelineItem[] => {
  const items: TimelineItem[] = []
  const halfCount = Math.floor(count / 2)

  // Generate past items
  for (let i = 0; i < halfCount; i++) {
    const type = getRandomElement(Object.keys(itemTemplates) as Array<keyof typeof itemTemplates>)
    const template = itemTemplates[type]
    const timestamp = new Date(today.getTime() - (i + 1) * (Math.random() * 3 * 60 * 60 * 1000))

    items.push({
      id: i,
      type,
      title: getRandomElement(template.titles),
      details: getRandomElement(template.details),
      content: getRandomElement(template.contents),
      timestamp,
    })
  }

  // Generate future items (and today's items)
  for (let i = 0; i < count - halfCount; i++) {
    const type = getRandomElement(Object.keys(itemTemplates) as Array<keyof typeof itemTemplates>)
    const template = itemTemplates[type]
    const timestamp = new Date(today.getTime() + i * (Math.random() * 3 * 60 * 60 * 1000))

    items.push({
      id: i + halfCount,
      type,
      title: getRandomElement(template.titles),
      details: getRandomElement(template.details),
      content: getRandomElement(template.contents),
      timestamp,
    })
  }

  return items
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
