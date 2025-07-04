import type { NoteItem } from "@/data/items"
import { Badge } from "@/components/ui/badge"

export default function NoteView({ item }: { item: NoteItem }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold">{item.title}</h1>
        <p className="text-gray-500 mt-1">
          Created on{" "}
          {item.timestamp.toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </p>
      </header>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
    </div>
  )
}
