import dayjs from 'dayjs'

const DATE_FORMAT = 'YYYY-MM-DD'
const SHORT_DATE_FORMAT = 'YYYY-MM'

const todayDate = dayjs().format(DATE_FORMAT)
const lastWeekDate = dayjs().subtract(1, 'week').format(DATE_FORMAT)
const lastMonthDate = dayjs().subtract(1, 'month').format(DATE_FORMAT)
const last90DaysDate = dayjs().subtract(90, 'day').format(DATE_FORMAT)
const last3MonthsDate = dayjs().subtract(3, 'month').format(DATE_FORMAT)
const lastSemesterDate = dayjs().subtract(6, 'month').format(DATE_FORMAT)
const lastYearDate = dayjs().subtract(1, 'year').format(DATE_FORMAT)

export const DateRange = {
  last_7_days: `${lastWeekDate}:${todayDate}`,
  last_30_days: `${lastMonthDate}:${todayDate}`,
  last_90_days: `${last90DaysDate}:${todayDate}`,
  last_3_months: `${last3MonthsDate}:${todayDate}`,
  last_6_months: `${lastSemesterDate}:${todayDate}`,
  last_12_months: `${lastYearDate}:${todayDate}`,
}

export const DatesInAWeek = (format?: string) =>
  [...Array(7).keys()].map(i =>
    dayjs()
      .subtract(7 - i - 1, 'day')
      .format(format ?? DATE_FORMAT),
  )

export const DatesInAMonth = (format?: string) =>
  [...Array(30).keys()].map(i =>
    dayjs()
      .subtract(30 - i - 1, 'day')
      .format(format ?? DATE_FORMAT),
  )

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
  const datesMap = {
    last_7_days: DatesInAWeek(longFormat),
    last_30_days: DatesInAMonth(longFormat),
    last_90_days: DatesIn90Days(longFormat),
    last_3_months: DatesIn3Months(shortFormat),
    last_6_months: DatesIn6Months(shortFormat),
    last_12_months: DatesInAYear(shortFormat),
  }

  return datesMap[filter]
}
