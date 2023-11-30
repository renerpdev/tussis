import { Select, Selection, SelectItem, Spinner } from '@nextui-org/react'
import { useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { HiChevronRight } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import { TussisApi } from '../../../api'
import { useStore } from '../../../app/useStore'
import { PERIOD_FILTERS } from '../../constants'
import { ReportQueryParams } from '../../types'
import { AUTH_COOKIE_NAME, DateRange, formatNumberValue } from '../../utils'

const INITIAL_FILTER = 'last_7_days'

export const DonutChart = () => {
  const { symptomsUpdatedAt, medsUpdatedAt, issuesUpdatedAt } = useStore()
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const currentUser = useMemo(() => cookies.auth.user, [cookies])
  const [selectedFilter, setSelectedFilter] = useState<Selection>(new Set([INITIAL_FILTER]))
  const isAdminOrEditor = useMemo(
    () => cookies.auth?.user.role === 'admin' || cookies.auth?.user.role === 'editor',
    [cookies.auth?.user.role],
  )
  const { t } = useTranslation('translation', {
    keyPrefix: 'components.donut-chart',
  })

  const range = useMemo(
    () => DateRange[selectedFilter.currentKey || INITIAL_FILTER],
    [selectedFilter],
  )

  const { isFetching, data: response } = useQuery(
    [
      'issues/report',
      'issues_per_category',
      'yearly',
      range,
      currentUser?.uid,
      issuesUpdatedAt,
      medsUpdatedAt,
      symptomsUpdatedAt,
    ],
    () =>
      TussisApi.get<unknown, ReportQueryParams>('issues/report', {
        frequency: 'yearly',
        range,
      }),
  )

  const events: { name: string; total: number }[] = useMemo(() => {
    const eventsMap = new Map<string, number>()

    Object.keys(response?.data || {}).forEach(key => {
      const symptoms = response?.data[key].symptoms
      Object.entries(symptoms)?.forEach(([name, total]) => {
        eventsMap.set(name, (eventsMap.get(name) || 0) + Number(total))
      })

      const meds = response?.data[key].meds
      Object.entries(meds)?.forEach(([name, total]) => {
        eventsMap.set(name, (eventsMap.get(name) || 0) + Number(total))
      })
    })

    return Array.from(eventsMap.entries()).map(([name, total]) => ({ name, total }))
  }, [response?.data])

  const series = useMemo<any>(() => {
    return events.map(({ name, total }) => total)
  }, [events])

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
        height: '100%',
        width: '100%',
        type: 'donut',
      },
      stroke: {
        colors: ['transparent'],
        lineCap: '',
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: 'Inter, sans-serif',
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: t('donut-label'),
                fontFamily: 'Inter, sans-serif',
                formatter: function () {
                  return formatNumberValue(response?.total || 0)
                },
              },
              value: {
                show: true,
                fontFamily: 'Inter, sans-serif',
                offsetY: -20,
                formatter: formatNumberValue,
              },
            },
            size: '80%',
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: events.map(({ name }) => name),
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
      },
      yaxis: {
        labels: {
          formatter: formatNumberValue,
        },
      },
      xaxis: {
        labels: {
          formatter: formatNumberValue,
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    }),
    [response?.total, events],
  )

  return (
    <div className="w-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-4 md:p-6 border-1 dark:border-transparent flex flex-col justify-between gap-4">
      <div className="flex justify-between mb-3">
        <div className="flex justify-center items-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pr-1">
            {t('title')}
          </h5>
        </div>
      </div>

      {(!isFetching && options && series && (
        <Chart
          options={options}
          series={series}
          type="donut"
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
            selectedKeys={selectedFilter}
            onSelectionChange={setSelectedFilter}
            disallowEmptySelection
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
              {t('cta-button')}
              <HiChevronRight className="w-5 h-5 ml-1" />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  )
}
