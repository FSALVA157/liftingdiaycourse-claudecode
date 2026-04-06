import { DashboardCalendar } from "./_components/dashboard-calendar"

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Dashboard</h1>
      <DashboardCalendar />
    </main>
  )
}
