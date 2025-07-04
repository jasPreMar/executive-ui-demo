import * as React from "react"
import { cn } from "@/lib/utils"

const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          "pointer-events-none ml-auto h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 inline-flex group-hover:bg-accent group-hover:text-accent-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </kbd>
    )
  },
)
Kbd.displayName = "Kbd"

export { Kbd }
