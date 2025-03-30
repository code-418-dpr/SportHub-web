"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
    dateRange,
    setDateRange,
    className,
}: {
    dateRange: DateRange | undefined;
    setDateRange: (dateRange: DateRange | undefined) => void;
    className?: string;
}) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-56 items-center justify-start gap-2 px-4 text-left font-normal",
                            !dateRange && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "dd.MM.yyyy")} - {format(dateRange.to, "dd.MM.yyyy")}
                                    </>
                                ) : (
                                    format(dateRange.from, "dd.MM.yyyy")
                                )
                            ) : (
                                "Выберите даты"
                            )}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
