import type { MeetingItem } from "@/data/items"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin } from "lucide-react"

export default function MeetingView({ item }: { item: MeetingItem }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{item.title}</h1>
        <div className="flex flex-col gap-2 mt-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {item.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} on{" "}
              {item.timestamp.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{item.location}</span>
          </div>
        </div>
      </header>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Attendees</h2>
        <div className="flex flex-wrap gap-4">
          {item.attendees.map((attendee) => (
            <div key={attendee.email} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{attendee.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Notes</h2>
        <div className="prose max-w-none">
          <p>{item.description}</p>
        </div>
      </div>
    </div>
  )
}
