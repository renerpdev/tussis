import { AreaChart, DonutChart, LineChart, RadarChart } from '../../../shared/components'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        <AreaChart />
        <LineChart />
        <DonutChart />
        <RadarChart />
      </div>
      <div></div>
    </div>
  )
}
