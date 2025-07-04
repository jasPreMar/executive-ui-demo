"use client"

import type React from "react"
import { useRef, useEffect, useMemo } from "react"
import { cn, isSameDay, isYesterday, isTomorrow } from "@/lib/utils"
import { today, ICONS } from "@/data/items"
import type { TimelineItem } from "@/data/items"

interface TimelineProps {
  items: TimelineItem[]
  selectedIds: number[]
  onItemClick: (item: TimelineItem, isShiftPressed: boolean) => void
}

const TimelineMarker = ({
  children,
  size = "sm",
  isToday,
}: {
  children: React.ReactNode
  size?: "sm" | "lg"
  isToday?: boolean
}) => (
  <div
    className={cn(
      "flex items-center gap-2 text-gray-400 my-2",
      size === "sm" && "text-xs",
      size === "lg" && "text-sm font-medium text-gray-500 my-4",
      isToday && "text-blue-600",
    )}
  >
    <hr className="flex-1 border-t border-gray-200" />
    <span className="flex-shrink-0">{children}</span>
    <hr className="flex-1 border-t border-gray-200" />
  </div>
)

export default function Timeline({ items, selectedIds, onItemClick }: TimelineProps) {
  const itemRefs = useRef(new Map<number, HTMLElement>())
  const containerRef = useRef<HTMLDivElement>(null)

  const processedItems = useMemo(() => {
    const now = new Date()
    const nowObject = { timestamp: now, isNowMarker: true }

    const sortedEvents = [...items, nowObject].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    const result: (
      | TimelineItem
      | { type: "marker"; content: string; size: "sm" | "lg"; date: Date }
      | { type: "now-marker" }
    )[] = []
    let lastDay: string | null = null

    sortedEvents.forEach((event) => {
      const eventDay = event.timestamp.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
      if (eventDay !== lastDay) {
        result.push({ type: "marker", content: eventDay, size: "lg", date: event.timestamp })
        lastDay = eventDay
      }

      if ("isNowMarker" in event) {
        result.push({ type: "now-marker" })
      } else {
        result.push(event as TimelineItem)
      }
    })
    return result
  }, [items])

  // Scroll to "now" on initial mount
  useEffect(() => {
    const nowMarkerIndex = processedItems.findIndex((item) => item.type === "now-marker")
    if (nowMarkerIndex !== -1) {
      const node = itemRefs.current.get(nowMarkerIndex)
      if (node) {
        node.scrollIntoView({
          behavior: "auto",
          block: "center",
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll to selected items when selection changes
  useEffect(() => {
    if (selectedIds.length > 0) {
      const firstVisibleSelectedItem = items.find((item) => selectedIds.includes(item.id))

      if (firstVisibleSelectedItem) {
        const node = itemRefs.current.get(firstVisibleSelectedItem.id)
        if (node) {
          node.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }
      }
    }
  }, [selectedIds, items])

  return (
    <aside ref={containerRef} className="w-72 h-full border-r border-gray-200 p-4 overflow-y-auto">
      <div className="space-y-2">
        {processedItems.map((item, index) => {
          if (item.type === "now-marker") {
            return (
              <div
                key="now-marker"
                ref={(node) => {
                  if (node) itemRefs.current.set(index, node)
                  else itemRefs.current.delete(index)
                }}
                className="relative my-2"
              >
                <hr className="border-t-2 border-blue-500" />
                <span className="absolute -top-2.5 left-2 text-xs font-semibold text-blue-600 bg-white px-1">Now</span>
              </div>
            )
          }

          if ("content" in item && item.type === "marker") {
            const getMarkerLabel = (date: Date) => {
              if (isSameDay(date, today)) return "Today"
              if (isYesterday(date, today)) return "Yesterday"
              if (isTomorrow(date, today)) return "Tomorrow"
              return item.content
            }

            return (
              <div
                key={`marker-${index}`}
                ref={(node) => {
                  if (node) itemRefs.current.set(index, node)
                  else itemRefs.current.delete(index)
                }}
              >
                <TimelineMarker size={item.size} isToday={isSameDay(item.date, today)}>
                  {getMarkerLabel(item.date)}
                </TimelineMarker>
              </div>
            )
          }

          const timelineItem = item as TimelineItem
          const Icon = ICONS[timelineItem.type]
          const detailText =
            timelineItem.type === "Email"
              ? timelineItem.from.name
              : timelineItem.type === "Meeting"
                ? timelineItem.location
                : timelineItem.title

          return (
            <button
              key={timelineItem.id}
              ref={(node) => {
                if (node) itemRefs.current.set(timelineItem.id, node)
                else itemRefs.current.delete(timelineItem.id)
              }}
              onClick={(e) => onItemClick(timelineItem, e.shiftKey)}
              className={cn(
                "w-full text-left p-2 rounded-md border flex items-start space-x-3 transition-colors",
                selectedIds.includes(timelineItem.id)
                  ? "bg-gray-100 border-gray-900 ring-1 ring-gray-900"
                  : "border-gray-300 hover:bg-gray-50",
              )}
            >
              <Icon className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{timelineItem.title}</p>
                <p className="text-sm text-gray-600 truncate">{detailText}</p>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
