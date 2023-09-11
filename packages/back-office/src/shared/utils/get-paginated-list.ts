import {
  CollectionReference,
  OrderByDirection,
  Query,
} from 'firebase-admin/firestore';
import dayjs from 'dayjs';

import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  PaginatedList,
  PaginatedListInput,
} from '../types';

type SortParam = Record<string, OrderByDirection>;
type Input<T> = PaginatedListInput & {
  collection: CollectionReference<T>;
};

export const getPaginatedList = async <T>(
  input: Input<T>
): Promise<PaginatedList<T>> => {
  const {
    limit = DEFAULT_PAGE_SIZE,
    sort,
    collection,
    range,
    offset = 0,
  } = input;
  let query: Query<T> = collection.offset(0);

  const sortParams: SortParam[] = sort
    ? sort.split('&').map((param) => {
        const [field, order] = param.split(':');
        return { [field]: order } as SortParam;
      })
    : [];

  const [fromDate, toDate] = range
    ? range.split(':').map((value) => dayjs(value).format(DEFAULT_DATE_FORMAT))
    : [];

  if (fromDate && toDate) {
    if (dayjs(fromDate).isAfter(toDate)) {
      throw new Error('Invalid date range values!');
    }

    query = query.where('date', '>=', fromDate);
    query = query.where('date', '<=', toDate);
  }

  if (sortParams.length > 0) {
    sortParams.forEach((param) => {
      Object.entries(param).forEach(([key, value]) => {
        query = query.orderBy(key, value);
      });
    });
  }

  const docsSnapshot = await query.get();
  const limitDocsSnapshot = await docsSnapshot.query
    .offset(offset)
    .limit(limit)
    .get();

  const total = docsSnapshot.size;
  const hasMore = offset + limit < total;

  const data: T[] = [];
  limitDocsSnapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));

  return {
    hasMore,
    total,
    limit,
    offset, // TODO: we could replace `offset` with `startAfter` in order to save amount of DB requests
    data,
  };
};
