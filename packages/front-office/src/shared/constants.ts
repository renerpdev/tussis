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

export const PERIOD_COMPARATOR_FILTERS = [
  { label: i18next.t('filters.This week'), value: 'this_week' },
  { label: i18next.t('filters.This month'), value: 'this_month' },
  { label: i18next.t('filters.This quarter'), value: 'this_quarter' },
  { label: i18next.t('filters.This semester'), value: 'this_semester' },
  { label: i18next.t('filters.This year'), value: 'this_year' },
]

export const PERIOD_NAMES = {
  last_7_days: i18next.t('filters.Last 7 days'),
  last_30_days: i18next.t('filters.Last 30 days'),
  last_90_days: i18next.t('filters.Last 90 days'),
  last_3_months: i18next.t('filters.Last 3 months'),
  last_6_months: i18next.t('filters.Last 6 months'),
  last_12_months: i18next.t('filters.Last 12 months'),
  this_week: i18next.t('filters.This week'),
  this_month: i18next.t('filters.This month'),
  this_quarter: i18next.t('filters.This quarter'),
  this_semester: i18next.t('filters.This semester'),
  this_year: i18next.t('filters.This year'),
}
