import dayjs from 'dayjs'

const DATE_FORMAT = 'YYYY-MM-DD'
const todayDate = dayjs().format(DATE_FORMAT)
const lastWeekDate = dayjs().subtract(1, 'week').format(DATE_FORMAT)
const lastMonthDate = dayjs().subtract(1, 'month').format(DATE_FORMAT)
const last90DaysDate = dayjs().subtract(90, 'day').format(DATE_FORMAT)
const lastQuarterDate = dayjs().subtract(3, 'month').format(DATE_FORMAT)
const lastSemesterDate = dayjs().subtract(6, 'month').format(DATE_FORMAT)
const lastYearDate = dayjs().subtract(1, 'year').format(DATE_FORMAT)

export const DateRange = {
  last_7_days: `${lastWeekDate}:${todayDate}`,
  last_30_days: `${lastMonthDate}:${todayDate}`,
  last_90_days: `${last90DaysDate}:${todayDate}`,
  last_4_months: `${lastQuarterDate}:${todayDate}`,
  last_6_months: `${lastSemesterDate}:${todayDate}`,
  last_year: `${lastYearDate}:${todayDate}`,
}
