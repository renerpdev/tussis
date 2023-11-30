import { Select, SelectItem, Spinner } from '@nextui-org/react'
import { ApexOptions } from 'apexcharts'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { HiArrowUp, HiChevronRight } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'

export const periods = [
  { label: 'Last Week', value: 'weekly' },
  { label: 'Last Month', value: 'monthly' },
  { label: 'Last Quarter', value: 'quarterly' },
  { label: 'Last Semester', value: 'semester' },
  { label: 'Last Year', value: 'yearly' },
]

export const LineChart = () => {
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
          left: 2,
          right: 2,
          top: -26,
        },
      },
      legend: {
        show: true,
        offsetY: 10,
      },

      xaxis: {
        categories: ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
        labels: {
          show: true,
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
    [],
  )

  const series = useMemo<ApexOptions['series']>(
    () => [
      {
        name: 'Current Period',
        data: [6500, 4523, 6456, 4896, 6356, 4523],
        // color: 'rgb(8, 145, 178)',
      },
      {
        name: 'Previous Period',
        data: [1000, 2540, 4000, 2354, 3250, 6456],
        // color: 'rgb(8, 100, 200)',
      },
    ],
    [],
  )

  return (
    <div className="w-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-4 md:p-6 border-1 dark:border-transparent flex flex-col justify-between gap-4">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            32.4k
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Issues compared to last week
          </p>
        </div>
        <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
          12%
          <HiArrowUp className="w-4 h-4 ml-1" />
        </div>
      </div>

      {(options && series && (
        <Chart
          options={options}
          series={series}
          type="line"
        />
      )) || (
        <Spinner
          size="lg"
          className="align-center flex-1"
        />
      )}
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-600 justify-between">
        <div className="flex justify-between items-center pt-5">
          <Select
            items={periods}
            placeholder="Select a period"
            isLoading={false}
            disallowEmptySelection
            defaultSelectedKeys={['weekly']}
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
