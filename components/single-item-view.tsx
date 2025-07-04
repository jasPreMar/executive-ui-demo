import type { TimelineItem } from "@/data/items"
import EmailView from "./views/email-view"
import MeetingView from "./views/meeting-view"
import NoteView from "./views/note-view"
import TaskView from "./views/task-view"

interface SingleItemViewProps {
  item: TimelineItem
}

export default function SingleItemView({ item }: SingleItemViewProps) {
  switch (item.type) {
    case "Email":
      return <EmailView item={item} />
    case "Meeting":
      return <MeetingView item={item} />
    case "Note":
      return <NoteView item={item} />
    case "Task":
      return <TaskView item={item} />
    default:
      return (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Unsupported Item Type</h1>
        </div>
      )
  }
}
