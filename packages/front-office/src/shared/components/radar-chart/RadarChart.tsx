import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  Spinner,
} from '@nextui-org/react'
import { useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { useCookies } from 'react-cookie'
import { HiChevronDown, HiChevronRight } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { NavLink } from 'react-router-dom'
import { TussisApi } from '../../../api'
import { useStore } from '../../../app/useStore'
import { ReportQueryParams } from '../../types'
import { AUTH_COOKIE_NAME } from '../../utils'
import { capitalize } from '../crud-screen/utils'

export const RadarChart = () => {
  const { symptomsUpdatedAt, medsUpdatedAt, issuesUpdatedAt } = useStore()
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const currentUser = useMemo(() => cookies.auth.user, [cookies])
  const [visibleFilters, setVisibleFilters] = useState<Selection>(
    new Set([new Date().getFullYear()]),
  )

  const { isFetching, data: response } = useQuery(
    [
      'issues/report',
      'issues_per_year',
      currentUser?.uid,
      issuesUpdatedAt,
      medsUpdatedAt,
      symptomsUpdatedAt,
    ],
    () =>
      TussisApi.get<unknown, ReportQueryParams>('issues/report', {
        frequency: 'yearly',
      }),
  )

  const filters: any[] = useMemo(() => {
    const years = Object.keys(response?.data || {})
      .map(year => ({ name: year, uid: year }))
      .sort((a, b) => Number(a.uid) - Number(b.uid))
    setVisibleFilters(new Set(years.map(year => year.uid)))
    return years
  }, [response?.data])

  const series = useMemo<any>(
    () => [
      {
        name: 'Issues',
        data: [...visibleFilters].map((year: any) => response?.data?.[year]?.total || 0),
      },
    ],
    [response?.data, visibleFilters],
  )

  const options = useMemo<any>(
    () => ({
      chart: {
        height: '100%',
        maxWidth: '100%',
        type: 'radar',
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1,
        },
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColor: '#6f929d',
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      stroke: {
        width: 2,
        colors: ['#06B6D4'],
        dashArray: 0,
      },
      fill: {
        opacity: 0.3,
        colors: ['#06B6D4'],
      },
      markers: {
        size: 4,
      },
      yaxis: {
        show: false,
      },
      xaxis: {
        categories: [...visibleFilters],
        labels: {
          style: {
            fontSize: '14px',
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          borderRadius: 2,
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            color: '#07698a',
            opacity: 0.45,
          },
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: '#07698a',
          opacity: 0.45,
        },
      },
    }),
    [visibleFilters],
  )

  return (
    <div className="w-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-4 md:p-6 border-1 dark:border-transparent flex flex-col justify-between gap-4">
      <div className="flex justify-between">
        <div>
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pr-1">
            Issues per year
          </h5>
        </div>
        <div>
          <Dropdown
            classNames={{
              base: 'dark:bg-gray-800 dark:text-white',
              trigger: 'bg-gray-200 dark:bg-gray-700',
            }}
          >
            <DropdownTrigger>
              <Button
                endContent={<HiChevronDown className="h-4 w-4" />}
                variant="flat"
                style={{ zIndex: 9 }}
                className="px-3 py-2 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100  focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                isLoading={false}
              >
                Años
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Chart Filters"
              closeOnSelect={false}
              selectedKeys={visibleFilters}
              selectionMode="multiple"
              onSelectionChange={setVisibleFilters}
            >
              {filters.map(column => (
                <DropdownItem
                  key={column.uid}
                  className="capitalize dark:hover:bg-cyan-600 dark:focus:bg-cyan-600"
                >
                  {capitalize(column.name || '-')}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {(!isFetching && options && series && (
        <Chart
          options={options}
          series={series}
          type="radar"
          height={500}
          className="mb-[-50px]"
        />
      )) || (
        <Spinner
          size="lg"
          className="align-center flex-1"
        />
      )}
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-600 justify-between">
        <div className="flex justify-between items-center pt-5">
          <NavLink
            to="/issues"
            className="ml-auto uppercase text-sm font-semibold inline-flex items-center rounded-lg text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-600  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
          >
            Issues Report
            <HiChevronRight className="w-5 h-5 ml-1" />
          </NavLink>
        </div>
      </div>
    </div>
  )
}
