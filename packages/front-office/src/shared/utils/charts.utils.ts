import dayjs from 'dayjs'
import { TimeFrequency } from '../types'
import { DateRange, getDatesFromFilter } from './date.utils'

export const getChartData = (
  responseData: any,
  frequency: TimeFrequency,
  selectedFilter: keyof typeof DateRange,
) => {
  const eventsMap: Record<string, Map<string, number>> = {}
  const issuesMap = new Map<string, number>()
  const eventNames = new Map<string, boolean>()
  const longFormat = 'DD MMM YYYY'
  const shortFormat = 'MMM YYYY'

  Object.keys(responseData || {}).forEach(key => {
    const date = dayjs(key).format(frequency === 'daily' ? longFormat : shortFormat)
    if (!eventsMap[date]) eventsMap[date] = new Map<string, number>()

    issuesMap.set(date, (issuesMap.get(date) || 0) + Number(responseData[key].total))

    const symptoms = responseData[key].symptoms
    Object.entries(symptoms)?.forEach(([name, total]) => {
      eventNames.set(name, true)
      eventsMap[date].set(name, (eventsMap[date].get(name) || 0) + Number(total))
    })

    const meds = responseData[key].meds
    Object.entries(meds)?.forEach(([name, total]) => {
      eventNames.set(name, true)
      eventsMap[date].set(name, (eventsMap[date].get(name) || 0) + Number(total))
    })
  })

  const eventNamesArray = Array.from(eventNames.keys())
  const datesArray: string[] = getDatesFromFilter(selectedFilter, longFormat, shortFormat)

  const issuesArray = datesArray.map(date => {
    return issuesMap.get(date) || 0
  })

  const eventMatrix = eventNamesArray.map(name => {
    const data = datesArray.map(date => {
      if (!eventsMap[date]) return 0

      const total = eventsMap[date].get(name)
      if (!total) return 0
      return total
    })

    return { name, data }
  })

  return { datesArray, eventMatrix, eventNamesArray, issuesArray }
}

export const getTendencyPercentage = (currentTotal: number, prevTotal: number) => {
  if (prevTotal === currentTotal) return 0
  let percentage = Math.floor(((currentTotal - prevTotal) / prevTotal) * 100)
  if (percentage === Infinity) percentage = 100

  return `${percentage.toFixed(0)}%`
}
