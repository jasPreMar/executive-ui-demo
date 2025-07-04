import type { EmailItem } from "@/data/items"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EmailView({ item }: { item: EmailItem }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{item.subject}</h1>
        <div className="flex items-center gap-3 mt-4 text-gray-600">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.from.avatar || "/placeholder.svg"} alt={item.from.name} />
            <AvatarFallback>{item.from.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-800">{item.from.name}</p>
            <p className="text-sm">to {item.to.map((t) => t.name).join(", ")}</p>
          </div>
          <p className="text-sm ml-auto">
            {item.timestamp.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </header>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: item.body }} />
    </div>
  )
}
