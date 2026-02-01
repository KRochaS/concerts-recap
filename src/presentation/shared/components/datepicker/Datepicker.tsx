"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/presentation/shared/lib/utils"
import "react-day-picker/dist/style.css"
import { Calendar } from "lucide-react";

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
  label?: string
}

export function DatePicker({
  value,
  onChange,
  label = "Concert date",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative flex flex-col gap-2" ref={containerRef}>
      {label && (
        <label className="text-sm lg:text-base text-white ">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border px-3 text-sm text-content-body transition-all outline-none",
          "border-border-secondary bg-[#0f0f10] focus:ring-0 focus:ring-offset-0 focus:border-border-secondary active:border-border-secondary"
        )}
      >
        {value ? value.toLocaleDateString() : "Select date"}
       <Calendar className="w-4 h-4 opacity-60 text-white" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full md:w-auto">
          <CalendarContent
            value={value}
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function CalendarContent({
  value,
  onSelect,
}: {
  value?: Date
  onSelect: (date?: Date) => void
}) {
  return (
    <div className="rounded-xl border border-border bg-[#0f0f10] p-3 shadow-xl">
      <style>{`
        .rdp {
          --rdp-accent-color: #13102f;
          margin: 0;
        }
        .rdp-nav_button { color: white !important; }
      `}</style>
      <DayPicker
        mode="single"
        selected={value}
        onSelect={onSelect}
        showOutsideDays
        classNames={{
          today: `border-amber-500`,
          chevron: `fill-white`,
          selected: `!bg-[#13102f] !border-[#13102f] !text-white`,
          months: "flex flex-col", 
        }}
      />
    </div>
  )
}