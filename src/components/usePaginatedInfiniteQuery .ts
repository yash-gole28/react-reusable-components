import { useInfiniteQuery } from "@tanstack/react-query";

type ApiResponse<T> = {
  data: T[];
  total: number;
};

type FetchParams = {
  skip: number;
  take: number;
};

type FetchFn<T> = (params: FetchParams) => Promise<ApiResponse<T>>;

export const usePaginatedInfiniteQuery = <T>({
  queryKey,
  fetchFn,
  take = 12,
}: {
  queryKey: string[];
  fetchFn: FetchFn<T>;
  take?: number;
}) => {
  return useInfiniteQuery({
    queryKey,
    initialPageParam: 0,

    queryFn: async ({ pageParam = 0 }) => {
      const skip = pageParam * take;

      const res = await fetchFn({ skip, take });

      const totalPages = Math.ceil(res.total / take);

      return {
        data: res.data,
        nextPage: pageParam + 1,
        hasMore: pageParam + 1 < totalPages,
        total: res.total,
      };
    },

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });
};