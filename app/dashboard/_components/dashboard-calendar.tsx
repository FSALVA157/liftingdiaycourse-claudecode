"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format-date"
import { Dumbbell } from "lucide-react"
import type { Workout } from "@/data/workouts"

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function DashboardCalendar({ workouts }: { workouts: Workout[] }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const workoutsForSelectedDate = workouts.filter((w) =>
    isSameDay(w.date, selectedDate)
  )

  const datesWithWorkouts = workouts.map((w) => w.date)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
      <Card>
        <CardContent className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            modifiers={{ hasWorkout: datesWithWorkouts }}
            modifiersClassNames={{
              hasWorkout:
                "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary relative",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {formatDate(selectedDate)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workoutsForSelectedDate.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Sin entrenamientos registrados para este día.
            </p>
          ) : (
            <ul className="space-y-3">
              {workoutsForSelectedDate.map((workout) => (
                <li key={workout.id}>
                  <Card>
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                        <Dumbbell className="text-muted-foreground h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">
                            {workout.name ?? "Entrenamiento sin nombre"}
                          </p>
                          <Badge variant="secondary" className="shrink-0">
                            {workout.exerciseCount}{" "}
                            {workout.exerciseCount === 1
                              ? "ejercicio"
                              : "ejercicios"}
                          </Badge>
                        </div>
                        {workout.notes && (
                          <p className="text-muted-foreground mt-1 truncate text-xs">
                            {workout.notes}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
