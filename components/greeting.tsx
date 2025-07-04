"use client"

const ShortcutDisplay = ({ keys }: { keys: string[] }) => (
  <div className="flex items-center gap-1.5 ml-auto">
    {keys.map((key, index) => (
      <kbd
        key={index}
        className="pointer-events-none h-7 min-w-[1.75rem] flex items-center justify-center select-none rounded-md border border-gray-200 bg-gray-100 px-1.5 text-sm font-mono text-gray-600 shadow-[0_2px_0_0_rgba(0,0,0,0.05)]"
      >
        {key}
      </kbd>
    ))}
  </div>
)

export default function Greeting() {
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold tracking-tight">Happy 4th, Jason!</h1>
      <p className="text-gray-500 mt-2">
        {formattedDate} &nbsp; {formattedTime}
      </p>
      <div className="mt-12 space-y-4 w-full max-w-sm mx-auto text-left">
        <div className="flex items-center justify-between text-lg">
          <span>Move</span>
          <ShortcutDisplay keys={["↑", "↓"]} />
        </div>
        <div className="flex items-center justify-between text-lg">
          <span>Zoom</span>
          <ShortcutDisplay keys={["-", "="]} />
        </div>
        <div className="flex items-center justify-between text-lg">
          <span>Open timeline</span>
          <ShortcutDisplay keys={["⌘", "B"]} />
        </div>
      </div>
    </div>
  )
}
