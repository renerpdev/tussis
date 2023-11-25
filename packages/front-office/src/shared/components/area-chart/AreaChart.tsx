import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  Selection,
  SelectItem,
  Spinner,
} from '@nextui-org/react'
import { useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { HiChevronDown, HiChevronRight } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'
import { capitalize } from '../crud-screen/utils'

export const periods = [
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
  { label: 'Last 90 days', value: 'last_90_days' },
  { label: 'Last 6 months', value: 'last_6_months' },
  { label: 'Last year', value: 'last_year' },
]

const INITIAL_VISIBLE_FILTERS = ['tos', 'fiebre', 'despertar nocturno']

const filters: any[] = [
  { name: 'Tos', uid: 'tos' },
  { name: 'Fiebre', uid: 'fiebre' },
  { name: 'Despertar Nocturno', uid: 'despertar nocturno' },
  { name: 'Prednisolin', uid: 'prednisolin' },
]

export const AreaChart = () => {
  const [visibleFilters, setVisibleFilters] = useState<Selection>(new Set(INITIAL_VISIBLE_FILTERS))

  const options = useMemo<any>(
    () => ({
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
        categories: [
          '01 February',
          '02 February',
          '03 February',
          '04 February',
          '05 February',
          '06 February',
          '07 February',
        ],
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
    [],
  )
  const series = useMemo<any>(() => {
    const seriess = [
      {
        name: 'Tos',
        data: [4500, 6418, 3000, 6526, 6356, 6456],
        color: 'rgb(8, 145, 178)',
      },
      {
        name: 'Fiebre',
        data: [643, 2500, 765, 412, 1423, 3500],
        color: '#7E3BF2',
      },
      {
        name: 'Despertar Nocturno',
        data: [643, 413, 200, 4000, 1423, 1731],
        color: '#123DD2',
      },
    ].filter(serie =>
      Array.from(visibleFilters).find(filter => filter === serie.name.toLowerCase()),
    )

    return seriess
  }, [visibleFilters])

  return (
    <div className="w-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-4 md:p-6 border-1 dark:border-transparent flex flex-col justify-between gap-4">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            32.4k
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">Issues this week</p>
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
                Valores
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
            items={periods}
            placeholder="Select a period"
            isLoading={false}
            disallowEmptySelection
            defaultSelectedKeys={['last_7_days']}
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
          <NavLink
            to="/issues"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-600  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
          >
            Issues Report
            <HiChevronRight className="w-5 h-5 ml-1" />
          </NavLink>
        </div>
      </div>
    </div>
  )
}
