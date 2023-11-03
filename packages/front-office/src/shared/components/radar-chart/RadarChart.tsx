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
import { HiChevronDown, HiChevronRight } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'
import { capitalize } from '../crud-screen/utils'

const INITIAL_VISIBLE_FILTERS = ['2023', '2022', '2021', '2020', '2019']

const filters: any[] = [
  { name: '2018', uid: '2018' },
  { name: '2019', uid: '2019' },
  { name: '2020', uid: '2020' },
  { name: '2021', uid: '2021' },
  { name: '2022', uid: '2022' },
  { name: '2023', uid: '2023' },
]

export const RadarChart = () => {
  const [visibleFilters, setVisibleFilters] = useState<Selection>(new Set(INITIAL_VISIBLE_FILTERS))

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
        categories: [...visibleFilters].sort((a, b) => Number(a) - Number(b)),
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

  const series = useMemo<any>(
    () => [
      {
        color: '#06B6D4',
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20].slice(0, Array.from(visibleFilters).length),
      },
    ],
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

      {(options && series && (
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