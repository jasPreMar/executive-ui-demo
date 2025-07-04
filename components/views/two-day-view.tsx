import type React from "react"
import type { TwoDayViewData } from "@/lib/two-day-view-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, CheckSquare, Mail, FileText } from "lucide-react"

const Stat = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) => {
  if (value === 0) return null
  return (
    <div className="flex items-center text-sm text-gray-600">
      <Icon className="h-4 w-4 mr-2" />
      <span>
        {value} {label}
        {value > 1 ? "s" : ""}
      </span>
    </div>
  )
}

const DayColumn = ({
  title,
  summary,
}: {
  title: string
  summary: TwoDayViewData["day1"] | TwoDayViewData["day2"]
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl">
        {title}: {summary.date.toLocaleDateString("en-US", { weekday: "long" })}
      </CardTitle>
      <p className="text-sm text-gray-500">
        {summary.date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
      </p>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Summary</h3>
        <div className="space-y-1">
          <Stat icon={CheckSquare} label="Task" value={summary.tasks} />
          <Stat icon={Mail} label="Email" value={summary.emails} />
          <Stat icon={FileText} label="Note" value={summary.notes} />
        </div>
      </div>
      {summary.meetings.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <CalendarDays className="h-4 w-4 mr-2" />
            Meetings
          </h3>
          <ul className="space-y-2">
            {summary.meetings.map((meeting) => (
              <li key={meeting.id} className="text-sm p-2 bg-gray-50 rounded-md">
                <p className="font-medium">{meeting.title}</p>
                <p className="text-gray-500">
                  {meeting.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardContent>
  </Card>
)

export default function TwoDayView({ data }: { data: TwoDayViewData }) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{data.headerText}</h1>
        <p className="text-gray-500 mt-1">{data.subHeaderText}</p>
      </header>
      <div className="grid md:grid-cols-2 gap-8">
        <DayColumn title="Look Back" summary={data.day1} />
        <DayColumn title="Look Ahead" summary={data.day2} />
      </div>
    </div>
  )
}
