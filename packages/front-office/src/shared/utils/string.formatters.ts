export const formatNumberValue = (value: number): string => {
  return value > 1000 ? `${value / 10}K` : `${value}`
}
