import dayjs from 'dayjs'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const SHORT_DATE_FORMAT = 'YYYY-MM'

const todayDate = dayjs().format(DATE_FORMAT)
const last7DaysDates = dayjs().subtract(7, 'day').format(DATE_FORMAT)
const last30DaysDates = dayjs().subtract(30, 'day').format(DATE_FORMAT)
const last90DaysDates = dayjs().subtract(90, 'day').format(DATE_FORMAT)
const last3MonthsDates = dayjs().subtract(3, 'month').format(DATE_FORMAT)
const last6MonthsDates = dayjs().subtract(6, 'month').format(DATE_FORMAT)
const last12MonthsDates = dayjs().subtract(12, 'month').format(DATE_FORMAT)

const thisWeekDates = dayjs().startOf('week')
const thisMonthDates = dayjs().startOf('month')
const thisQuarterDates = dayjs().subtract(3, 'month').startOf('month')
const thisSemesterDates = dayjs().subtract(6, 'month').startOf('month')
const thisYearDates = dayjs().subtract(12, 'month').startOf('month')

const prevWeekDates = dayjs().subtract(1, 'week').startOf('week')
const prevMonthDates = dayjs().subtract(1, 'month').startOf('month')
const prevQuarterDates = dayjs().subtract(6, 'month').startOf('month')
const prevSemesterDates = dayjs().subtract(12, 'month').startOf('month')
const prevYearDates = dayjs().subtract(24, 'month').startOf('month')

export const DateRange = {
  last_7_days: `${last7DaysDates}:${todayDate}`,
  last_30_days: `${last30DaysDates}:${todayDate}`,
  last_90_days: `${last90DaysDates}:${todayDate}`,
  last_3_months: `${last3MonthsDates}:${todayDate}`,
  last_6_months: `${last6MonthsDates}:${todayDate}`,
  last_12_months: `${last12MonthsDates}:${todayDate}`,

  this_week: `${thisWeekDates.format(DATE_FORMAT)}:${todayDate}`,
  this_month: `${thisMonthDates.format(DATE_FORMAT)}:${todayDate}`,
  this_quarter: `${thisQuarterDates.format(DATE_FORMAT)}:${todayDate}`,
  this_semester: `${thisSemesterDates.format(DATE_FORMAT)}:${todayDate}`,
  this_year: `${thisYearDates.format(DATE_FORMAT)}:${todayDate}`,

  prev_week: `${prevWeekDates.format(DATE_FORMAT)}:${prevWeekDates
    .endOf('week')
    .format(DATE_FORMAT)}`,
  prev_month: `${prevMonthDates.format(DATE_FORMAT)}:${prevMonthDates
    .endOf('month')
    .format(DATE_FORMAT)}`,
  prev_quarter: `${prevQuarterDates.format(DATE_FORMAT)}:${prevQuarterDates
    .endOf('month')
    .format(DATE_FORMAT)}`,
  prev_semester: `${prevSemesterDates.format(DATE_FORMAT)}:${prevSemesterDates
    .endOf('month')
    .format(DATE_FORMAT)}`,
  prev_year: `${prevYearDates.format(DATE_FORMAT)}:${prevYearDates
    .endOf('month')
    .format(DATE_FORMAT)}`,
}

export const DatesInAWeek = (format?: string) =>
  [...Array(7).keys()].map(i =>
    dayjs()
      .subtract(7 - i - 1, 'day')
      .format(format ?? DATE_FORMAT),
  )

export const DatesThisWeek = (format?: string, diff = 0) => {
  const startOfWeek = dayjs().subtract(diff, 'week').startOf('week')

  return [...Array(7).keys()].map(i =>
    dayjs(startOfWeek)
      .add(i, 'day')
      .format(format ?? DATE_FORMAT),
  )
}

export const DatesInAMonth = (format?: string) =>
  [...Array(30).keys()].map(i =>
    dayjs()
      .subtract(30 - i - 1, 'day')
      .format(format ?? DATE_FORMAT),
  )

export const DatesThisMonth = (format?: string, diff = 0) => {
  const startOfMonth = dayjs().startOf('month')
  const daysInMonth = startOfMonth.daysInMonth()

  return [...Array(daysInMonth).keys()].map(i =>
    dayjs(startOfMonth)
      .add(i, 'day')
      .format(format ?? DATE_FORMAT),
  )
}

export const DatesIn90Days = (format?: string) =>
  [...Array(90).keys()].map(i =>
    dayjs()
      .subtract(90 - i - 1, 'day')
      .format(format ?? DATE_FORMAT),
  )

export const DatesIn6Months = (format?: string) =>
  [...Array(6).keys()].map(i =>
    dayjs()
      .subtract(6 - i - 1, 'month')
      .format(format ?? SHORT_DATE_FORMAT),
  )

export const DatesIn3Months = (format?: string) =>
  [...Array(3).keys()].map(i =>
    dayjs()
      .subtract(3 - i - 1, 'month')
      .format(format ?? SHORT_DATE_FORMAT),
  )

export const DatesInMonthRange = (months: number, format?: string, diff = 0) => {
  const startOfQuarter = dayjs()
    .subtract(Math.pow(months, 2 * diff), 'month')
    .startOf('month')

  return [...Array(months).keys()].map(i =>
    dayjs(startOfQuarter)
      .add(i, 'month')
      .format(format ?? DATE_FORMAT),
  )
}

export const DatesInAYear = (format?: string) =>
  [...Array(12).keys()].map(i =>
    dayjs()
      .subtract(12 - i - 1, 'month')
      .format(format ?? SHORT_DATE_FORMAT),
  )

export const getDatesFromFilter = (
  filter: keyof typeof DateRange,
  longFormat?: string,
  shortFormat?: string,
) => {
  const datesMap: Record<string, string[]> = {
    last_7_days: DatesInAWeek(longFormat),
    last_30_days: DatesInAMonth(longFormat),
    last_90_days: DatesIn90Days(longFormat),
    last_3_months: DatesIn3Months(shortFormat),
    last_6_months: DatesIn6Months(shortFormat),
    last_12_months: DatesInAYear(shortFormat),

    this_week: DatesThisWeek(longFormat),
    this_month: DatesThisMonth(longFormat),
    this_quarter: DatesInMonthRange(3, shortFormat),
    this_semester: DatesInMonthRange(6, shortFormat),
    this_year: DatesInMonthRange(12, shortFormat),

    prev_week: DatesThisWeek(longFormat, 1),
    prev_month: DatesThisMonth(longFormat, 1),
    prev_quarter: DatesInMonthRange(3, shortFormat, 1),
    prev_semester: DatesInMonthRange(6, shortFormat, 1),
    prev_year: DatesInMonthRange(12, shortFormat, 1),
  }

  return datesMap[filter]
}
