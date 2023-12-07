import { Checkbox, Select, SelectItem, Selection, Spinner } from '@nextui-org/react'
import { ApexOptions } from 'apexcharts'
import { useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { HiArrowDown, HiArrowUp, HiChevronRight, HiMinus } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import { TussisApi } from '../../../api'
import { useStore } from '../../../app/useStore'
import { PERIOD_COMPARATOR_FILTERS } from '../../constants'
import { ReportQueryParams, TimeFrequency } from '../../types'
import { AUTH_COOKIE_NAME, DateRange, formatNumberValue } from '../../utils'
import { getChartData, getTendencyPercentage } from '../../utils/charts.utils'

const INITIAL_FILTER = 'this_week'

const PERIOD_RANGE_MAP = {
  this_week: DateRange.prev_week,
  this_month: DateRange.prev_month,
  this_quarter: DateRange.prev_quarter,
  this_semester: DateRange.prev_semester,
  this_year: DateRange.prev_year,
}

const PERIODS_MAP = {
  this_week: 'prev_week',
  this_month: 'prev_month',
  this_quarter: 'prev_quarter',
  this_semester: 'prev_semester',
  this_year: 'prev_year',
}

export const LineChart = () => {
  const { symptomsUpdatedAt, medsUpdatedAt, issuesUpdatedAt } = useStore()
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const currentUser = useMemo(() => cookies.auth.user, [cookies])
  const isAdminOrEditor = useMemo(
    () => cookies.auth?.user.role === 'admin' || cookies.auth?.user.role === 'editor',
    [cookies.auth?.user.role],
  )
  const [selectedFilter, setSelectedFilter] = useState<Selection>(new Set([INITIAL_FILTER]))
  const { t } = useTranslation('translation', {
    keyPrefix: 'components.line-chart',
  })
  const [showXLabels, setShowXLabels] = useState(true)

  const currentRange = useMemo(
    () => DateRange[selectedFilter.currentKey || INITIAL_FILTER],
    [selectedFilter],
  )

  const previousRange = useMemo(
    () => PERIOD_RANGE_MAP[selectedFilter.currentKey || INITIAL_FILTER],
    [selectedFilter.currentKey],
  )

  const frequency: TimeFrequency = useMemo(
    () =>
      currentRange === DateRange.this_week || currentRange === DateRange.this_month
        ? 'daily'
        : 'monthly',
    [currentRange],
  )

  const { isFetching: isFetchingCurrentPeriod, data: responseCurrentPeriod } = useQuery(
    [
      'issues/report',
      frequency,
      currentRange,
      currentUser?.uid,
      issuesUpdatedAt,
      medsUpdatedAt,
      symptomsUpdatedAt,
    ],
    () =>
      TussisApi.get<unknown, ReportQueryParams>('issues/report', {
        frequency,
        range: currentRange || PERIOD_RANGE_MAP[INITIAL_FILTER],
      }),
  )

  const { isFetching: isFetchingPreviousPeriod, data: responsePreviousPeriod } = useQuery(
    [
      'issues/report',
      frequency,
      previousRange,
      currentUser?.uid,
      issuesUpdatedAt,
      medsUpdatedAt,
      symptomsUpdatedAt,
    ],
    () =>
      TussisApi.get<unknown, ReportQueryParams>('issues/report', {
        frequency,
        range: previousRange,
      }),
  )

  const responseData = useMemo(() => {
    const currentFilterKey = selectedFilter.currentKey || INITIAL_FILTER

    const { datesArray, issuesArray: currentPeriodKeys } = getChartData(
      responseCurrentPeriod?.data,
      frequency,
      currentFilterKey,
    )

    const currentTotal = currentPeriodKeys.reduce((acc, curr) => acc + curr, 0)

    const { issuesArray: prevPeriodKeys } = getChartData(
      responsePreviousPeriod?.data,
      frequency,
      PERIODS_MAP[currentFilterKey],
    )

    const prevTotal = prevPeriodKeys.reduce((acc, curr) => acc + curr, 0)

    const tendency = currentTotal > prevTotal ? 'up' : currentTotal < prevTotal ? 'down' : 'equal'

    const percentage = getTendencyPercentage(currentTotal, prevTotal)

    return {
      datesArray,
      currentPeriodKeys,
      prevPeriodKeys,
      currentTotal,
      prevTotal,
      tendency,
      percentage,
    }
  }, [
    frequency,
    responseCurrentPeriod?.data,
    responsePreviousPeriod?.data,
    selectedFilter.currentKey,
  ])

  const options = useMemo<ApexOptions>(
    () => ({
      colors: [
        '#794eef',
        '#16BDCA',
        '#FDBA8C',
        '#E74694',
        '#e746df',
        '#5b46e7',
        '#c4e746',
        '#e78446',
        '#4686e7',
        '#6a2393',
      ],
      chart: {
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 50,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 200,
          },
        },
        height: '100%',
        maxWidth: '100%',
        type: 'line',
        fontFamily: 'Inter, sans-serif',
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 4,
        dashArray: [0, 5],
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 0,
          right: 0,
          top: -15,
        },
      },
      legend: {
        show: true,
        offsetY: 10,
      },

      xaxis: {
        categories: responseData.datesArray,
        labels: {
          show: showXLabels,
          style: {
            fontFamily: 'Inter, sans-serif',
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-text-white',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    }),
    [responseData.datesArray, showXLabels],
  )

  const series = useMemo<ApexOptions['series']>(
    () => [
      {
        name: t('current-period'),
        data: responseData.currentPeriodKeys,
      },
      {
        name: t('previous-period'),
        data: responseData.prevPeriodKeys,
      },
    ],
    [t, responseData.currentPeriodKeys, responseData.prevPeriodKeys],
  )

  return (
    <div className="w-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-4 md:p-6 border-1 dark:border-transparent flex flex-col justify-between gap-4">
      <div className="flex justify-between">
        <div>
          <div className="flex gap-2">
            <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
              {formatNumberValue(responseData.currentTotal)}
            </h5>
            <p>
              (<b>{formatNumberValue(responseData.prevTotal)}</b> {t('previous-period')})
            </p>
          </div>
          <p
            className="text-base font-normal text-gray-500 dark:text-gray-400 mb-4"
            dangerouslySetInnerHTML={{
              __html: t('subtitle', {
                current: t(selectedFilter.currentKey || INITIAL_FILTER),
                previous: t(PERIODS_MAP[selectedFilter.currentKey || INITIAL_FILTER]),
              }),
            }}
          ></p>
        </div>
        <div
          className={`flex items-center px-2.5 py-0.5 text-base font-semibold text-center ${
            responseData.tendency === 'up'
              ? 'text-red-500 dark:text-red-500'
              : responseData.tendency === 'down'
              ? 'text-green-500 dark:text-green-500'
              : ''
          }`}
        >
          {responseData.tendency !== 'equal' && responseData.percentage}
          {responseData.tendency === 'up' && <HiArrowUp className="w-4 h-4 ml-1" />}
          {responseData.tendency === 'equal' && <HiMinus className="w-4 h-4 ml-1" />}
          {responseData.tendency === 'down' && <HiArrowDown className="w-4 h-4 ml-1" />}
        </div>
      </div>
      <div className="relative">
        <Chart
          options={options}
          series={series}
          type="line"
        />
        {(isFetchingCurrentPeriod || isFetchingPreviousPeriod) && (
          <div className="align-center absolute top-0 left-0 h-full w-full flex items-center justify-center z-1 bg-white/50">
            <Spinner size="lg" />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <Checkbox
          defaultSelected={showXLabels}
          checked={showXLabels}
          onValueChange={setShowXLabels}
        >
          {t('display-xaxis-labels')}
        </Checkbox>
      </div>
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-600 justify-between">
        <div className="flex justify-between items-center pt-5">
          <Select
            items={PERIOD_COMPARATOR_FILTERS}
            isLoading={false}
            disallowEmptySelection
            selectedKeys={selectedFilter}
            onSelectionChange={setSelectedFilter}
            classNames={{
              base: 'max-w-[200px]',
              trigger:
                'bg-transparent  max-h-[40px] shadow-none text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:bg-gray-600 text-center inline-flex items-center dark:hover:text-white py-0',
              popoverContent: 'dark:bg-gray-800',
            }}
          >
            {period => (
              <SelectItem
                key={period.value}
                className="capitalize dark:hover:bg-cyan-600 dark:focus:bg-cyan-600"
              >
                {period.label}
              </SelectItem>
            )}
          </Select>
          {isAdminOrEditor && (
            <NavLink
              to="/issues"
              className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-600  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
            >
              {t('cta-button')}
              <HiChevronRight className="w-5 h-5 ml-1" />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  )
}
