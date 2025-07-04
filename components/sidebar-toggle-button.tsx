"use client"

import { PanelLeft, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarToggleButtonProps {
  isTimelineOpen: boolean
  onClick: () => void
}

export default function SidebarToggleButton({ isTimelineOpen, onClick }: SidebarToggleButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("absolute top-4 z-10 transition-all", isTimelineOpen ? "left-[19rem]" : "left-4")}
    >
      {isTimelineOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      <span className="sr-only">Toggle Timeline</span>
    </Button>
  )
}
