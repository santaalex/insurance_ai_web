"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                root: "p-3 relative",
                months: "flex flex-col lg:flex-row space-y-4 lg:space-x-4 lg:space-y-0",
                month: "space-y-4 relative w-full",
                month_caption: "flex justify-center pt-1 mb-2 items-center",
                caption_label: "text-sm font-bold text-slate-800",
                nav: "space-x-1 flex items-center absolute top-2 right-2 z-10",
                button_previous: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                button_next: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                month_grid: "w-full border-collapse space-y-1",
                weekdays: "flex w-full justify-between mb-2",
                weekday:
                    "text-slate-500 rounded-md w-9 font-normal text-[0.8rem] text-center",
                week: "flex w-full mt-2 justify-between",
                day: "h-9 w-9 text-center text-sm p-0 mx-auto relative [&:has([aria-selected].range_end)]:rounded-r-md [&:has([aria-selected].outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal hover:bg-slate-100 hover:text-slate-900 aria-selected:opacity-100 rounded-md transition-all"
                ),
                range_end: "range_end",
                selected:
                    "bg-emerald-600 !text-white hover:bg-emerald-700 focus:bg-emerald-700 rounded-md font-bold shadow-md",
                today: "bg-slate-100 text-emerald-600 font-bold rounded-md",
                outside:
                    "outside text-slate-500 aria-selected:bg-slate-100/50 aria-selected:text-slate-500",
                disabled: "text-slate-500 opacity-50",
                range_middle:
                    "aria-selected:bg-slate-100 aria-selected:text-slate-900",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Chevron: (props: any) => {
                    const Icon = props.orientation === "left" ? ChevronLeft : ChevronRight;
                    return <Icon className="h-4 w-4" />;
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
