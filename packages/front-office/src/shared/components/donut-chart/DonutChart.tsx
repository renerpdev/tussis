import { Select, SelectItem, Spinner } from '@nextui-org/react'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { HiChevronRight } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'
import { periods } from '../constants'

export const DonutChart = () => {
  const options = useMemo<any>(
    () => ({
      colors: ['#794eef', '#16BDCA', '#FDBA8C', '#E74694'],
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
                label: 'Total Issues',
                fontFamily: 'Inter, sans-serif',
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                  return `${sum}k`
                },
              },
              value: {
                show: true,
                fontFamily: 'Inter, sans-serif',
                offsetY: -20,
                formatter: function (value) {
                  return value + 'k'
                },
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
      labels: ['Tos', 'Fiebre', 'Prednisolin', 'Despertar'],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + 'k'
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value + 'k'
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    }),
    [],
  )

  const series = useMemo<any>(() => {
    return [35.1, 23.5, 2.4, 5.4]
  }, [])

  return (
    <div className="w-full bg-white rounded-lg shadow-lg dark:bg-gray-700 p-4 md:p-6 border-1 dark:border-transparent flex flex-col justify-between gap-4">
      <div className="flex justify-between mb-3">
        <div className="flex justify-center items-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pr-1">
            Issues by category
          </h5>
        </div>
      </div>

      {(options && series && (
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
            items={periods}
            placeholder="Select a period"
            isLoading={false}
            defaultSelectedKeys={['last_7_days']}
            disallowEmptySelection
            classNames={{
              base: 'max-w-[200px]',
              trigger:
                'bg-transparent max-h-[40px] shadow-none text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:bg-gray-600 text-center inline-flex items-center dark:hover:text-white py-0',
              popover: 'dark:bg-gray-800',
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
