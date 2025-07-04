import type React from "react"
import { Mail, CalendarDays, FileText, CheckSquare } from "lucide-react"

// --- TYPE DEFINITIONS ---

interface BaseItem {
  id: number
  timestamp: Date
}

export interface EmailItem extends BaseItem {
  type: "Email"
  from: { name: string; email: string; avatar: string }
  to: { name: string; email: string }[]
  subject: string
  body: string
}

export interface MeetingItem extends BaseItem {
  type: "Meeting"
  title: string
  attendees: { name: string; email: string; avatar: string }[]
  location: string
  description: string
}

export interface NoteItem extends BaseItem {
  type: "Note"
  title: string
  content: string
  tags: string[]
}

export interface TaskItem extends BaseItem {
  type: "Task"
  title: string
  description: string
  dueDate: Date
  completed: boolean
}

export type TimelineItem = EmailItem | MeetingItem | NoteItem | TaskItem

// --- CONSTANTS & HELPERS ---

export const today = new Date("2025-07-04T12:00:00")

export const ICONS: Record<TimelineItem["type"], React.ElementType> = {
  Email: Mail,
  Meeting: CalendarDays,
  Note: FileText,
  Task: CheckSquare,
}

// --- DATA GENERATION LOGIC ---

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

const people = [
  { name: "Sarah Lee", email: "sarah.lee@example.com", avatar: "https://i.pravatar.cc/32?u=sarah.lee@example.com" },
  { name: "John Doe", email: "john.doe@company.com", avatar: "https://i.pravatar.cc/32?u=john.doe@company.com" },
  { name: "Alex Chen", email: "alex.chen@example.com", avatar: "https://i.pravatar.cc/32?u=alex@example.com" },
  { name: "Maria Garcia", email: "maria.garcia@client.com", avatar: "https://i.pravatar.cc/32?u=maria@client.com" },
  { name: "Jason", email: "jason@me.com", avatar: "https://i.pravatar.cc/32?u=jason@me.com" },
]

const jason = people[4]

const emailTemplates = [
  {
    subject: "Re: Project Update",
    body: "<p>Thanks for the update. The progress on the new dashboard looks fantastic. Let's sync up tomorrow to discuss the final design tweaks.</p><p>Best,<br>Sarah</p>",
  },
  {
    subject: "Project Phoenix - Staging Build Ready",
    body: "<p>Hi Team,</p><p>The latest build is deployed to staging and ready for review. The team has addressed all the feedback from the last round.</p><p>Please test and provide feedback by EOD.</p><p>Cheers,<br>John</p>",
  },
  {
    subject: "[acme-corp/website] PR #231 ready for review",
    body: "<p>Pull request <strong>'feat: Add dark mode toggle'</strong> is ready for your review.</p><p>Changes include updates to the main layout and a new theme provider. Please review and approve.</p>",
    from: { name: "GitHub", email: "notifications@github.com", avatar: "https://i.pravatar.cc/32?u=github" },
  },
  {
    subject: "Your Vercel deployment is ready",
    body: "<p>Congratulations! Your deployment for `acme-website-preview` is complete.</p><p><a href='#'>Visit Deployment</a></p>",
    from: { name: "Vercel", email: "notifications@vercel.com", avatar: "https://i.pravatar.cc/32?u=vercel" },
  },
  {
    subject: "Weekly Tech Digest",
    body: "<h2>Top Stories This Week</h2><ul><li>The Rise of Serverless GPUs</li><li>A Deep Dive into WebAssembly</li><li>Why You Should Learn Rust in 2025</li></ul>",
    from: { name: "Tech Weekly", email: "newsletter@techweekly.com", avatar: "https://i.pravatar.cc/32?u=techweekly" },
  },
]

const meetingTemplates = [
  {
    title: "Daily Standup",
    location: "Zoom (recurring)",
    description: "Quick daily check-in on progress and blockers.",
    attendees: [jason, people[0], people[1]],
  },
  {
    title: "Design Sync",
    location: "Conf Room B",
    description: "Review new mockups for the mobile app.",
    attendees: [jason, people[2]],
  },
  {
    title: "1-on-1",
    location: "Virtual",
    description: "Weekly catch-up.",
    attendees: [jason, people[0]],
  },
  {
    title: "Client Call: Acme Corp",
    location: "Google Meet",
    description: "Present Q3 progress and discuss next steps.",
    attendees: [jason, people[3]],
  },
  {
    title: "Lunch with Alex",
    location: "The Corner Cafe",
    description: "Personal catch-up.",
    attendees: [jason, people[2]],
  },
]

const taskTemplates = [
  {
    title: "Prepare slides for Q3 planning",
    description: "Create a presentation covering the main goals and proposed roadmap for the next quarter.",
  },
  { title: "Review PR #231", description: "Review the dark mode implementation on the company website." },
  { title: "Book flights for conference", description: "Book flights and hotel for the WebDev Conf in Austin." },
  {
    title: "Finish building UI for Executive",
    description: "Implement the final components for the executive dashboard view.",
  },
  { title: "Call your mom", description: "Reminder to call Mom for the holiday." },
]

const noteTemplates = [
  {
    title: "Brainstorming: New API structure",
    content:
      "<h2>Ideas for v2 API</h2><ul><li>Use GraphQL instead of REST.</li><li>Implement JWT for authentication.</li><li>Standardize error responses.</li></ul>",
    tags: ["api", "engineering"],
  },
  {
    title: "Meeting Notes: Client Call",
    content:
      "<h3>Key Takeaways</h3><p>Client is happy with the progress. They want to see a prototype of the new feature by next Friday.</p>",
    tags: ["meeting", "client"],
  },
  {
    title: "Grocery List",
    content: "<ul><li>Milk</li><li>Bread</li><li>Eggs</li><li>Avocado</li><li>Coffee</li></ul>",
    tags: ["personal"],
  },
]

const generateItemsForDay = (date: Date, count: number): TimelineItem[] => {
  const items: TimelineItem[] = []
  const dayStart = new Date(date)
  dayStart.setHours(8, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(20, 0, 0, 0)

  for (let i = 0; i < count; i++) {
    const type = getRandomElement(["Email", "Meeting", "Task", "Note"])
    const timestamp = randomDate(dayStart, dayEnd)
    const id = Number.parseInt(`${date.getFullYear()}${date.getMonth()}${date.getDate()}${i}`, 10)

    switch (type) {
      case "Email":
        const emailTemplate = getRandomElement(emailTemplates)
        items.push({
          id,
          type: "Email",
          timestamp,
          from: emailTemplate.from || getRandomElement(people.filter((p) => p.email !== jason.email)),
          to: [jason],
          subject: emailTemplate.subject,
          body: emailTemplate.body,
        })
        break
      case "Meeting":
        const meetingTemplate = getRandomElement(meetingTemplates)
        items.push({
          id,
          type: "Meeting",
          timestamp,
          ...meetingTemplate,
        })
        break
      case "Task":
        const taskTemplate = getRandomElement(taskTemplates)
        const dueDate = new Date(timestamp)
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 5) + 1)
        items.push({
          id,
          type: "Task",
          timestamp,
          ...taskTemplate,
          dueDate,
          completed: Math.random() > 0.7,
        })
        break
      case "Note":
        const noteTemplate = getRandomElement(noteTemplates)
        items.push({
          id,
          type: "Note",
          timestamp,
          ...noteTemplate,
        })
        break
    }
  }
  return items
}

const createFullTimeline = (): TimelineItem[] => {
  let allItems: TimelineItem[] = []
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 7) // Start 7 days ago

  for (let i = 0; i < 14; i++) {
    // Generate for 14 days
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
    const itemCount = isWeekend ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 10) + 15
    allItems = [...allItems, ...generateItemsForDay(currentDate, itemCount)]
  }

  // Ensure unique IDs and sort
  const uniqueItems = Array.from(new Map(allItems.map((item) => [item.id, item])).values())
  return uniqueItems.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

export const timelineItems: TimelineItem[] = createFullTimeline()
