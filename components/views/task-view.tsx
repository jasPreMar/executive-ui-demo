import type { TaskItem } from "@/data/items"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function TaskView({ item }: { item: TaskItem }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <header className="mb-8">
        <div className="flex items-start gap-4">
          <Checkbox id={`task-${item.id}`} checked={item.completed} className="h-6 w-6 mt-2" />
          <div>
            <Label htmlFor={`task-${item.id}`} className="text-4xl font-bold leading-none">
              {item.title}
            </Label>
            <p className="text-gray-500 mt-2">
              Due by {item.dueDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </header>
      <div className="prose prose-lg max-w-none">
        <p>{item.description}</p>
      </div>
    </div>
  )
}
