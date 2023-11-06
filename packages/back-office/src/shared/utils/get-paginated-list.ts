import dayjs from 'dayjs'
import { CollectionReference, OrderByDirection, Query } from 'firebase-admin/firestore'

import { Med } from '../../app/meds/entities/med.entity'
import { Symptom } from '../../app/symptoms/entities/symptom.entity'
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  PaginatedList,
  PaginatedListInput,
  PaginatedSnapshot,
} from '../types'

type SortParam = Record<string, OrderByDirection>
type Input<C> = PaginatedListInput & {
  collection: CollectionReference<C>
}
type InputIssues<C, M, S> = Input<C> & {
  medsCollection: CollectionReference<M>
  symptomsCollection: CollectionReference<S>
}

export const getPaginatedSnapshot = async <C>(input: Input<C>): Promise<PaginatedSnapshot<C>> => {
  const { limit = DEFAULT_PAGE_SIZE, sort, collection, range, offset = 0 } = input
  let query: Query<C> = collection.offset(0)

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
      throw new Error('Invalid date range values!')
    }

    query = query.where('date', '>=', fromDate)
    query = query.where('date', '<=', toDate)
  }

  if (sortParams.length > 0) {
    sortParams.forEach(param => {
      Object.entries(param).forEach(([key, value]) => {
        query = query.orderBy(key, value)
      })
    })
  }

  const docsSnapshot = await query.get()
  const limitDocsSnapshot = await docsSnapshot.query.offset(offset).limit(limit).get()

  const total = docsSnapshot.size
  const hasMore = offset + limit < total

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

export const getPaginatedIssuesList = async <T, C, M, S>(
  input: InputIssues<C, M, S>,
): Promise<PaginatedList<T>> => {
  const { snapshot, total, limit, offset, hasMore } = await getPaginatedSnapshot<C>(input)

  // TODO: improve this, right now it iterates a lot of times
  const meds = (
    await Promise.all(
      snapshot.docs.map(({ id }) => input.medsCollection.where('issueId', '==', id).get()),
    )
  ).map(({ docs }) =>
    docs.map(doc => {
      const { medId, desc, name }: any = doc.data()
      return { name, desc, id: medId } as Med
    }),
  )

  // TODO: improve this, right now it iterates a lot of times
  const symptoms = (
    await Promise.all(
      snapshot.docs.map(({ id }) => input.symptomsCollection.where('issueId', '==', id).get()),
    )
  ).map(({ docs }) =>
    docs.map(doc => {
      const { symptomId, desc, name }: any = doc.data()
      return { name, desc, id: symptomId } as Symptom
    }),
  )

  const data: T[] = snapshot.docs.map(
    (doc, index) =>
      ({ ...doc.data(), id: doc.id, symptoms: symptoms[index], meds: meds[index] } as T),
  )

  return {
    hasMore,
    total,
    limit,
    offset,
    data,
  }
}
