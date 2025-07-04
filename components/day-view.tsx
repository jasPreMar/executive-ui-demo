import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DayViewProps as DayViewData } from "@/lib/day-view-generator"

interface DayViewProps {
  data: DayViewData
}

export default function DayView({ data }: DayViewProps) {
  const { headerText, subHeaderText, standoutItems, calendarEvents, stats } = data

  return (
    <div className="w-full max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{headerText}</h1>
        <p className="text-gray-500 mt-1">{subHeaderText}</p>
      </header>

      {standoutItems.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Here's what stands out</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            {standoutItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </section>
      )}

      {calendarEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">From your calendar</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Attendees</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calendarEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      {event.timestamp.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.attendees.map((a) => a.name).join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Other stuff</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {stats.emailsReceived > 0 && <li>{stats.emailsReceived} emails received.</li>}
          {stats.notesCreated > 0 && <li>{stats.notesCreated} new notes created.</li>}
          {stats.tasksCompleted > 0 && <li>You completed {stats.tasksCompleted} tasks.</li>}
          {stats.emailsReceived === 0 && stats.notesCreated === 0 && stats.tasksCompleted === 0 && (
            <li>A quiet day.</li>
          )}
        </ul>
      </section>
    </div>
  )
}
