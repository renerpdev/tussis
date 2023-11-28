import dayjs from 'dayjs'
import { CollectionReference, OrderByDirection, Query } from 'firebase-admin/firestore'

import { IssuesReportList } from '../../app/issues/dto/get-issues-report.dto'
import { IssueReport } from '../../app/issues/entities/issue-report.entity'
import { Med } from '../../app/meds/entities/med.entity'
import { Symptom } from '../../app/symptoms/entities/symptom.entity'
import { UserError } from '../errors/user-error'
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  PaginatedList,
  PaginatedListInput,
  PaginatedSnapshot,
  PaginatedSnapshotList,
  TimeFrequency,
} from '../types'

type SortParam = Record<string, OrderByDirection>
type Input<C> = PaginatedListInput & {
  collection: CollectionReference<C>
  uid: string
}
type InputIssues<C, M, S> = Input<C> & {
  medsCollection: CollectionReference<M>
  symptomsCollection: CollectionReference<S>
}
type InputIssuesReport<C, M, S> = Input<C> & {
  medsCollection: CollectionReference<M>
  symptomsCollection: CollectionReference<S>
  frequency?: string
}

const getPaginatedSnapshot = async <C>(input: Input<C>): Promise<PaginatedSnapshot<C>> => {
  const { limit = DEFAULT_PAGE_SIZE, sort, collection, range, offset = 0, uid } = input
  let query: Query<C> = collection.where('uid', '==', uid)

  const sortParams: SortParam[] = sort
    ? sort.split('&').map(param => {
        const [field, order] = param.split(':')
        return { [field]: order } as SortParam
      })
    : []

  const [fromDate, toDate] = range
    ? range.split(':').map(value => dayjs(value).format(DEFAULT_DATE_FORMAT))
    : []

  if (fromDate && toDate) {
    if (dayjs(fromDate).isAfter(toDate)) {
      throw new UserError('Invalid date range values!')
    }

    query = query.where('date', '>=', fromDate).where('date', '<=', toDate)
  }

  if (sortParams.length > 0) {
    sortParams.forEach(param => {
      Object.entries(param).forEach(([key, value]) => {
        query = query.orderBy(key, value)
      })
    })
  }

  const docsSnapshot = await query.get()
  const limitDocsSnapshot = limit
    ? await docsSnapshot.query.offset(offset).limit(limit).get()
    : docsSnapshot

  const total = docsSnapshot.size
  const hasMore = offset + (limit ?? 0) < total

  return {
    hasMore,
    total,
    limit,
    offset, // TODO: we could replace `offset` with `startAfter` in order to save amount of DB requests
    snapshot: limitDocsSnapshot,
  }
}

export const getPaginatedList = async <T, C>(input: Input<C>): Promise<PaginatedList<T>> => {
  const { snapshot, total, limit, offset, hasMore } = await getPaginatedSnapshot<C>(input)

  const data: T[] = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T))

  return {
    hasMore,
    total,
    limit,
    offset,
    data,
  }
}

const getPaginatedSnapshotList = async <C, M, S>(
  input: InputIssues<C, M, S>,
): Promise<PaginatedSnapshotList<C, M, S>> => {
  const { snapshot, total, limit, offset, hasMore } = await getPaginatedSnapshot<C>(input)

  const snapshotList: PaginatedSnapshotList<C, M, S>['snapshotList'] = await Promise.all(
    snapshot.docs.map(doc =>
      Promise.all([
        doc,
        input.medsCollection.where('issueId', '==', doc.id).get(),
        input.symptomsCollection.where('issueId', '==', doc.id).get(),
      ]),
    ),
  )

  return {
    hasMore,
    total,
    limit,
    offset,
    snapshotList,
  }
}

export const getPaginatedIssuesList = async <T, C, M, S>(
  input: InputIssues<C, M, S>,
): Promise<PaginatedList<T>> => {
  const { snapshotList, total, limit, offset, hasMore } = await getPaginatedSnapshotList<C, M, S>(
    input,
  )

  const data = snapshotList.map(([doc, medsSnapshot, symptomsSnapshot]: any) => {
    const meds = medsSnapshot.docs.map(doc => {
      const { _medId: id, ...data }: any = doc.data()
      return { ...data, id } as Med
    })

    const symptoms = symptomsSnapshot.docs.map(doc => {
      const { _symptomId: id, ...data }: any = doc.data()
      return { ...data, id } as Symptom
    })

    return { ...doc.data(), id: doc.id, symptoms, meds } as T
  })

  return {
    hasMore,
    total,
    limit,
    offset,
    data,
  }
}

export const getIssuesReport = async <C, M, S>(
  input: InputIssuesReport<C, M, S>,
): Promise<IssuesReportList> => {
  const frequency = input.frequency ?? TimeFrequency.DAILY

  input.limit = null // here we avoid pagination
  input.offset = 0
  input.sort = 'date:asc'
  const { snapshotList, total } = await getPaginatedSnapshotList<C, M, S>(input)

  const data: IssueReport = snapshotList.reduce(
    (acc: any, [doc, medsSnapshot, symptomsSnapshot]: any) => {
      const { date: unformattedDate } = doc.data()
      const date = dayjs(unformattedDate).format(
        frequency === TimeFrequency.MONTHLY
          ? 'YYYY-MM'
          : frequency === TimeFrequency.YEARLY
          ? 'YYYY'
          : DEFAULT_DATE_FORMAT,
      )

      // here we create a new date entry if it doesn't exist
      if (!acc[date]) acc[date] = { symptoms: {}, meds: {}, total: 0 } as any

      // add 1 to the total issues count
      acc[date].total += 1

      medsSnapshot.docs.forEach(doc => {
        const { name } = doc.data()
        // here we create a new med entry if it doesn't exist
        if (!acc[date].meds[name]) acc[date].meds[name] = 0

        // then add 1 to the meds count
        acc[date].meds[name] += 1
      })

      symptomsSnapshot.docs.forEach(doc => {
        const { name } = doc.data()
        // here we create a new symptom entry if it doesn't exist
        if (!acc[date].symptoms[name]) acc[date].symptoms[name] = 0

        // then add 1 to the symptoms count
        acc[date].symptoms[name] += 1
      })

      return acc
    },
    {},
  )

  return {
    total,
    data,
  }
}
