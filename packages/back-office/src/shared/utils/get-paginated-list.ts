import {
  CollectionReference,
  OrderByDirection,
  Query,
} from 'firebase-admin/firestore';
import { DEFAULT_PAGE_SIZE, PaginatedList, PaginatedListInput } from '../types';

type SortParam = Record<string, OrderByDirection>;
type Input<T> = PaginatedListInput & {
  collection: CollectionReference<T>;
};

export const getPaginatedList = async <T>(
  input: Input<T>
): Promise<PaginatedList<T>> => {
  const { limit = DEFAULT_PAGE_SIZE, sort, offset = 0, collection } = input;
  let query: Query<T> = collection.limit(limit);

  const sortParams: SortParam[] = sort
    ? sort.split('&').map((param) => {
        const [field, order] = param.split(':');
        return { [field]: order } as SortParam;
      })
    : [];

  if (sortParams.length > 0) {
    sortParams.forEach((param) => {
      Object.entries(param).forEach(([key, value]) => {
        query = query.orderBy(key, value);
      });
    });
  }

  query = query.offset(offset);

  const [docsList, docsSnapshot] = await Promise.all([
    collection.listDocuments(),
    query.get(),
  ]);

  const total = docsList.length;

  const hasMore = offset + limit < total;

  const data: T[] = [];
  docsSnapshot.forEach((doc) => data.push({ ...doc.data(), id: doc.id }));

  return {
    data,
    hasMore,
    total,
    limit,
    offset, // TODO: we could replace `offset` with `startAfter` in order to save amount of DB requests
  };
};
