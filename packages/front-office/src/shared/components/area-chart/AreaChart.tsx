import { Select, Selection, SelectItem, Spinner } from '@nextui-org/react'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { useCookies } from 'react-cookie'
import { HiChevronRight } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import { TussisApi } from '../../../api'
import { useStore } from '../../../app/useStore'
import { PERIOD_FILTERS, PERIOD_NAMES } from '../../constants'
import { ReportQueryParams } from '../../types'
import { AUTH_COOKIE_NAME, DateRange, formatNumberValue } from '../../utils'

const INITIAL_FILTER = 'last_7_days'

export const AreaChart = () => {
  const { symptomsUpdatedAt, medsUpdatedAt, issuesUpdatedAt } = useStore()
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const currentUser = useMemo(() => cookies.auth.user, [cookies])
  const isAdminOrEditor = useMemo(
    () => cookies.auth?.user.role === 'admin' || cookies.auth?.user.role === 'editor',
    [cookies.auth?.user.role],
  )
  const [selectedFilter, setSelectedFilter] = useState<Selection>(new Set([INITIAL_FILTER]))

  const range = useMemo(
    () => DateRange[selectedFilter.currentKey || INITIAL_FILTER],
    [selectedFilter],
  )

  const { isFetching, data: response } = useQuery(
    [
      'issues/report',
      'yearly',
      range,
      currentUser?.uid,
      issuesUpdatedAt,
      medsUpdatedAt,
      symptomsUpdatedAt,
    ],
    () =>
      TussisApi.get<unknown, ReportQueryParams>('issues/report', {
        frequency: 'daily',
        range,
      }),
  )

  const responseData = useMemo(() => {
    const symptomsMap: Record<string, Map<string, number>> = {}
    const symptomsNames = new Map<string, boolean>()

    Object.keys(response?.data || {}).forEach(key => {
      const date = dayjs(key).format('DD MMM YYYY')
      if (!symptomsMap[date]) symptomsMap[date] = new Map<string, number>()

      const symptoms = response?.data[key].symptoms
      Object.entries(symptoms)?.forEach(([name, total]) => {
        symptomsNames.set(name, true)
        symptomsMap[date].set(name, (symptomsMap[date].get(name) || 0) + Number(total))
      })
    })

    const symptomsNamesArray = Array.from(symptomsNames.keys())
    const datesArray = Object.keys(symptomsMap)

    const symptomsMatrix = symptomsNamesArray.map(name => {
      const data = datesArray.map(date => {
        const total = symptomsMap[date].get(name)
        if (!total) return 0
        return total
      })

      return { name, data }
    })

    return [datesArray, symptomsMatrix, symptomsNamesArray]
  }, [response?.data])

  const options = useMemo<any>(
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
          speed: 500,
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
        type: 'area',
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
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: '#1C64F2',
          gradientToColors: ['#1C64F2'],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 4,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0,
        },
      },
      xaxis: {
        categories: responseData[0], // here in pos 0 we stored the dates array
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      legend: {
        show: true,
        offsetY: 10,
      },
      yaxis: {
        show: false,
      },
    }),
    [responseData],
  )
  const series = useMemo<any>(() => {
    return responseData[1] // here in pos 1 we stored the symptoms matrix
      .map((symptom, index) => ({
        name: symptom.name,
        data: symptom.data,
        //     color: 'rgb(8, 145, 178)',
      }))
  }, [responseData])

  return (
    <div className="w-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-4 md:p-6 border-1 dark:border-transparent flex flex-col justify-between gap-4">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            {formatNumberValue(response?.total || 0)}
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Total Issues from {PERIOD_NAMES[selectedFilter.currentKey || INITIAL_FILTER]}
          </p>
        </div>
      </div>
      {(!isFetching && options && series && (
        <Chart
          options={options}
          series={series}
          type="area"
        />
      )) || (
        <Spinner
          size="lg"
          className="align-center flex-1"
        />
      )}
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-600 justify-between mt-auto">
        <div className="flex justify-between items-center pt-5">
          <Select
            items={PERIOD_FILTERS}
            placeholder="Select a period"
            isLoading={false}
            disallowEmptySelection
            selectedKeys={selectedFilter}
            onSelectionChange={setSelectedFilter}
            classNames={{
              base: 'max-w-[200px]',
              trigger:
                'bg-transparent max-h-[40px] shadow-none text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:bg-gray-600 text-center inline-flex items-center dark:hover:text-white py-0',
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
              Issues Report
              <HiChevronRight className="w-5 h-5 ml-1" />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  )
}
