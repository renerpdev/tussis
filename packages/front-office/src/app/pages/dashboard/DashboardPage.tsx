import { AreaChart, LineChart } from '../../../shared/components'

export const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <AreaChart />
        <LineChart />
      </div>
      <div></div>
    </div>
  )
}
