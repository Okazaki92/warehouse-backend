export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const lastPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      lastPage,
    },
  };
}
