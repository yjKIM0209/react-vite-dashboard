// src/components/ui/button-group.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement>

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-fit items-center -space-x-px rounded-md shadow-sm",
        className
      )}
      {...props}
    />
  )
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }