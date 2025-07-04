import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export default function ChatBar() {
  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <Input placeholder="Ask or reply..." className="h-12 pr-12 rounded-full bg-gray-100" />
      <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-9 h-9">
        <ArrowUp className="w-4 h-4" />
      </Button>
    </div>
  )
}
