"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Greeting from "@/components/greeting"
import DayView from "@/components/day-view"
import Timeline from "@/components/timeline"
import SingleItemView from "@/components/single-item-view"
import TwoDayView from "@/components/views/two-day-view"
import WeekView from "@/components/views/week-view"
import SidebarToggleButton from "@/components/sidebar-toggle-button"
import ChatBar from "@/components/chat-bar"
import { timelineItems, today } from "@/data/items"
import type { TimelineItem } from "@/data/items"
import { isSameDay, cn, getDayBoundaries, getWeekBoundaries } from "@/lib/utils"
import { generateDayViewData } from "@/lib/day-view-generator"
import { generateTwoDayViewData } from "@/lib/two-day-view-generator"
import { generateWeekViewData } from "@/lib/week-view-generator"

type SelectionType = "single" | "day" | "week" | "all" | "custom"

export default function Page() {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)

  const [anchorId, setAnchorId] = useState<number | null>(null)
  const [focusId, setFocusId] = useState<number | null>(null)

  const sortedTimelineItems = useMemo(() => {
    return [...timelineItems].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }, [])

  const selectedIds = useMemo(() => {
    if (!anchorId || !focusId) return []
    const anchorIndex = sortedTimelineItems.findIndex((item) => item.id === anchorId)
    const focusIndex = sortedTimelineItems.findIndex((item) => item.id === focusId)
    if (anchorIndex === -1 || focusIndex === -1) return []

    const start = Math.min(anchorIndex, focusIndex)
    const end = Math.max(anchorIndex, focusIndex)

    return sortedTimelineItems.slice(start, end + 1).map((item) => item.id)
  }, [anchorId, focusId, sortedTimelineItems])

  const getSelectionType = useCallback(
    (currentSelectedIds: number[]): SelectionType => {
      if (currentSelectedIds.length === 0) return "custom"
      if (currentSelectedIds.length === 1) return "single"

      const selectedItems = sortedTimelineItems.filter((item) => currentSelectedIds.includes(item.id))
      if (selectedItems.length === 0) return "custom"

      const firstSelectedItem = selectedItems[0]
      const selectedIdsSet = new Set(currentSelectedIds)

      if (currentSelectedIds.length === sortedTimelineItems.length) {
        return "all"
      }

      const { startOfWeek, endOfWeek } = getWeekBoundaries(firstSelectedItem.timestamp)
      const weekItems = sortedTimelineItems.filter(
        (item) => item.timestamp >= startOfWeek && item.timestamp <= endOfWeek,
      )
      if (weekItems.length === currentSelectedIds.length) {
        const weekItemIds = new Set(weekItems.map((i) => i.id))
        const areSetsEqual =
          selectedIdsSet.size === weekItemIds.size && [...selectedIdsSet].every((id) => weekItemIds.has(id))
        if (areSetsEqual) return "week"
      }

      const dayItems = sortedTimelineItems.filter((item) => isSameDay(item.timestamp, firstSelectedItem.timestamp))
      if (dayItems.length === currentSelectedIds.length) {
        const dayItemIds = new Set(dayItems.map((i) => i.id))
        const areSetsEqual =
          selectedIdsSet.size === dayItemIds.size && [...selectedIdsSet].every((id) => dayItemIds.has(id))
        if (areSetsEqual) return "day"
      }

      return "custom"
    },
    [sortedTimelineItems],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, metaKey, ctrlKey } = event
      const isMod = metaKey || ctrlKey

      if (isMod && key === "b") {
        event.preventDefault()
        setIsTimelineOpen((prev) => !prev)
        return
      }

      if (key === "ArrowUp" || key === "ArrowDown") {
        event.preventDefault()
        const direction = key === "ArrowDown" ? 1 : -1

        if (!focusId || !anchorId) {
          const firstTodayItem = sortedTimelineItems.find((item) => isSameDay(item.timestamp, today))
          if (firstTodayItem) {
            setAnchorId(firstTodayItem.id)
            setFocusId(firstTodayItem.id)
          }
          return
        }

        const selectionType = getSelectionType(selectedIds)
        const focusItem = sortedTimelineItems.find((item) => item.id === focusId)
        if (!focusItem) return

        switch (selectionType) {
          case "single": {
            const focusIndex = sortedTimelineItems.findIndex((item) => item.id === focusId)
            const nextIndex = focusIndex + direction
            if (nextIndex >= 0 && nextIndex < sortedTimelineItems.length) {
              const nextId = sortedTimelineItems[nextIndex].id
              setAnchorId(nextId)
              setFocusId(nextId)
            }
            break
          }
          case "day": {
            const nextDayDate = new Date(focusItem.timestamp)
            nextDayDate.setDate(nextDayDate.getDate() + direction)
            while (
              nextDayDate >= sortedTimelineItems[0].timestamp &&
              nextDayDate <= sortedTimelineItems[sortedTimelineItems.length - 1].timestamp
            ) {
              const { firstId, lastId } = getDayBoundaries(nextDayDate, sortedTimelineItems)
              if (firstId !== undefined && lastId !== undefined) {
                setAnchorId(firstId)
                setFocusId(lastId)
                return
              }
              nextDayDate.setDate(nextDayDate.getDate() + direction)
            }
            break
          }
          case "week": {
            const { startOfWeek } = getWeekBoundaries(focusItem.timestamp)
            const nextWeekDate = new Date(startOfWeek)
            nextWeekDate.setDate(startOfWeek.getDate() + 7 * direction)
            while (
              nextWeekDate >= sortedTimelineItems[0].timestamp &&
              nextWeekDate <= sortedTimelineItems[sortedTimelineItems.length - 1].timestamp
            ) {
              const { startOfWeek: newStart, endOfWeek: newEnd } = getWeekBoundaries(nextWeekDate)
              const weekItems = sortedTimelineItems.filter(
                (item) => item.timestamp >= newStart && item.timestamp <= newEnd,
              )
              if (weekItems.length > 0) {
                setAnchorId(weekItems[0].id)
                setFocusId(weekItems[weekItems.length - 1].id)
                return
              }
              nextWeekDate.setDate(nextWeekDate.getDate() + 7 * direction)
            }
            break
          }
          default: {
            // custom or all
            const anchorIndex = sortedTimelineItems.findIndex((item) => item.id === anchorId)
            const focusIndex = sortedTimelineItems.findIndex((item) => item.id === focusId)
            const targetIndex = direction === 1 ? Math.max(anchorIndex, focusIndex) : Math.min(anchorIndex, focusIndex)
            const nextItemIndex = targetIndex + direction
            if (nextItemIndex >= 0 && nextItemIndex < sortedTimelineItems.length) {
              const nextId = sortedTimelineItems[nextItemIndex].id
              setAnchorId(nextId)
              setFocusId(nextId)
            }
            break
          }
        }
        return
      }

      if (key === "-" || key === "=") {
        event.preventDefault()
        if (!focusId) return

        const isZoomIn = key === "="
        const selectionType = getSelectionType(selectedIds)
        const focusItem = sortedTimelineItems.find((item) => item.id === focusId)
        if (!focusItem) return

        if (isZoomIn) {
          switch (selectionType) {
            case "day": {
              const { firstId } = getDayBoundaries(focusItem.timestamp, sortedTimelineItems)
              if (firstId !== undefined) {
                setAnchorId(firstId)
                setFocusId(firstId)
              }
              break
            }
            case "week": {
              const { startOfWeek } = getWeekBoundaries(focusItem.timestamp)
              const { firstId, lastId } = getDayBoundaries(startOfWeek, sortedTimelineItems)
              if (firstId !== undefined && lastId !== undefined) {
                setAnchorId(firstId)
                setFocusId(lastId)
              }
              break
            }
            case "all": {
              const firstItem = sortedTimelineItems[0]
              const { startOfWeek, endOfWeek } = getWeekBoundaries(firstItem.timestamp)
              const weekItems = sortedTimelineItems.filter(
                (item) => item.timestamp >= startOfWeek && item.timestamp <= endOfWeek,
              )
              if (weekItems.length > 0) {
                setAnchorId(weekItems[0].id)
                setFocusId(weekItems[weekItems.length - 1].id)
              }
              break
            }
          }
        } else {
          // Zoom Out
          switch (selectionType) {
            case "single":
            case "custom": {
              const { firstId, lastId } = getDayBoundaries(focusItem.timestamp, sortedTimelineItems)
              if (firstId !== undefined && lastId !== undefined) {
                setAnchorId(firstId)
                setFocusId(lastId)
              }
              break
            }
            case "day": {
              const { startOfWeek, endOfWeek } = getWeekBoundaries(focusItem.timestamp)
              const weekItems = sortedTimelineItems.filter(
                (item) => item.timestamp >= startOfWeek && item.timestamp <= endOfWeek,
              )
              if (weekItems.length > 0) {
                setAnchorId(weekItems[0].id)
                setFocusId(weekItems[weekItems.length - 1].id)
              }
              break
            }
            case "week": {
              setAnchorId(sortedTimelineItems[0].id)
              setFocusId(sortedTimelineItems[sortedTimelineItems.length - 1].id)
              break
            }
          }
        }
      }
    },
    [anchorId, focusId, selectedIds, sortedTimelineItems, getSelectionType],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const handleItemClick = (item: TimelineItem, isShiftPressed: boolean) => {
    if (isShiftPressed && anchorId) {
      setFocusId(item.id)
    } else {
      setAnchorId(item.id)
      setFocusId(item.id)
    }
  }

  const selectedItems = useMemo(
    () => sortedTimelineItems.filter((item) => selectedIds.includes(item.id)),
    [selectedIds, sortedTimelineItems],
  )

  const viewState = useMemo(() => {
    const selectionType = getSelectionType(selectedIds)

    switch (selectionType) {
      case "single":
        return { type: "single-item", item: selectedItems[0] }
      case "day":
        return { type: "day-view", date: selectedItems[0].timestamp }
      case "week":
        const { startOfWeek, endOfWeek } = getWeekBoundaries(selectedItems[0].timestamp)
        return { type: "week-view", startOfWeek, endOfWeek }
      case "custom": {
        const uniqueDays = [
          ...new Set(
            selectedItems.map((item) => {
              const d = new Date(item.timestamp)
              d.setHours(0, 0, 0, 0)
              return d.getTime()
            }),
          ),
        ].sort()

        if (uniqueDays.length === 2) {
          const day1 = new Date(uniqueDays[0])
          const day2 = new Date(uniqueDays[1])
          const nextDay = new Date(day1)
          nextDay.setDate(nextDay.getDate() + 1)
          if (isSameDay(nextDay, day2)) {
            return { type: "two-day-view" }
          }
        }
        return { type: "greeting" }
      }
      default:
        return { type: "greeting" }
    }
  }, [selectedIds, selectedItems, getSelectionType])

  const renderMainContent = () => {
    switch (viewState.type) {
      case "single-item":
        return <SingleItemView item={viewState.item} />
      case "day-view":
        const dayViewData = generateDayViewData(viewState.date, selectedItems)
        return <DayView data={dayViewData} />
      case "two-day-view":
        const twoDayData = generateTwoDayViewData(selectedItems)
        return <TwoDayView data={twoDayData} />
      case "week-view":
        const weekViewData = generateWeekViewData(selectedItems, viewState.startOfWeek, viewState.endOfWeek)
        return <WeekView data={weekViewData} />
      case "greeting":
      default:
        return <Greeting />
    }
  }

  return (
    <div className="flex h-screen bg-white text-gray-900 relative overflow-hidden">
      <SidebarToggleButton isTimelineOpen={isTimelineOpen} onClick={() => setIsTimelineOpen((prev) => !prev)} />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden",
          isTimelineOpen ? "w-72" : "w-0",
        )}
      >
        <Timeline items={sortedTimelineItems} onItemClick={handleItemClick} selectedIds={selectedIds} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main
          className={cn(
            "flex-1 overflow-y-auto p-8",
            viewState.type === "greeting" ? "flex items-center justify-center" : "pt-24",
          )}
        >
          {renderMainContent()}
        </main>
        <div className="p-4 border-t border-gray-200 bg-white">
          <ChatBar />
        </div>
      </div>
    </div>
  )
}
