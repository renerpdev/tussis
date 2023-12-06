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
  const datesMap = new Map<string, string>()
  const eventNames = new Map<string, boolean>()
  const dayFormat = 'DD MMM'
  const monthFormat = 'MMM YYYY'

  Object.keys(responseData || {}).forEach(key => {
    const date = dayjs(key).format(frequency === 'daily' ? dayFormat : monthFormat)
    if (!eventsMap[date]) eventsMap[date] = new Map<string, number>()

    issuesMap.set(date, (issuesMap.get(date) || 0) + Number(responseData[key].total))
    datesMap.set(date, key)

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
  const _datesArray: string[] = getDatesFromFilter(selectedFilter)

  const issuesArray = _datesArray.map(date => {
    const fdate = dayjs(date).format(frequency === 'daily' ? dayFormat : monthFormat)

    if (dayjs(datesMap.get(fdate) || date).isAfter(dayjs())) return null

    return issuesMap.get(fdate) || 0
  })

  const eventMatrix = eventNamesArray.map(name => {
    const data = _datesArray.map(key => {
      const date = dayjs(key).format(frequency === 'daily' ? dayFormat : monthFormat)

      if (!eventsMap[date]) return 0

      const total = eventsMap[date].get(name)
      if (!total) return 0
      return total
    })

    return { name, data }
  })

  const datesArray = _datesArray.map(date =>
    dayjs(date).format(frequency === 'daily' ? dayFormat : monthFormat),
  )

  return { datesArray, eventMatrix, eventNamesArray, issuesArray }
}

export const getTendencyPercentage = (currentTotal: number, prevTotal: number) => {
  if (prevTotal === currentTotal) return 0
  let percentage = Math.floor(((currentTotal - prevTotal) / prevTotal) * 100)
  if (percentage === Infinity) percentage = 100

  return `${percentage.toFixed(0)}%`
}
