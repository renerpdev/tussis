import i18next from '../i18n'

export const DEFAULT_ITEMS_PER_PAGE = 10

export const PERIOD_FILTERS = [
  { label: i18next.t('filters.Last 7 days'), value: 'last_7_days' },
  { label: i18next.t('filters.Last 30 days'), value: 'last_30_days' },
  { label: i18next.t('filters.Last 90 days'), value: 'last_90_days' },
  { label: i18next.t('filters.Last 3 months'), value: 'last_3_months' },
  { label: i18next.t('filters.Last 6 months'), value: 'last_6_months' },
  { label: i18next.t('filters.Last 12 months'), value: 'last_12_months' },
]

export const PERIOD_NAMES = {
  last_7_days: i18next.t('filters.Last 7 days'),
  last_30_days: i18next.t('filters.Last 30 days'),
  last_90_days: i18next.t('filters.Last 90 days'),
  last_3_months: i18next.t('filters.Last 3 months'),
  last_6_months: i18next.t('filters.Last 6 months'),
  last_12_months: i18next.t('filters.Last 12 months'),
}
