export const formatNumberValue = (value: number): string => {
  return value > 1000 ? `${(value / 1000).toFixed(1)}K` : `${value}`
}
