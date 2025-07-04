import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { WeekViewData } from "@/lib/week-view-generator"

export default function WeekView({ data }: { data: WeekViewData }) {
  const { headerText, subHeaderText, standoutItems, keyMeetings, tasksSummary, stats } = data

  return (
    <div className="w-full max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{headerText}</h1>
        <p className="text-gray-500 mt-1">{subHeaderText}</p>
      </header>

      {standoutItems.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">What stands out this week</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            {standoutItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </section>
      )}

      {keyMeetings.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Key meetings on the calendar</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Event</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keyMeetings.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      {event.timestamp.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{event.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {tasksSummary.pending.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Pending Tasks ({tasksSummary.pending.length})</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {tasksSummary.pending.slice(0, 5).map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
            {tasksSummary.pending.length > 5 && <li>And {tasksSummary.pending.length - 5} more...</li>}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Weekly Summary</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>{tasksSummary.completed.length} tasks completed.</li>
          <li>{stats.totalEmails} emails received.</li>
          <li>{stats.totalNotes} notes created.</li>
        </ul>
      </section>
    </div>
  )
}
