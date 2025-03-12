import { useInfiniteQuery } from '@tanstack/react-query';
import { getExpenses } from '../actions';

export const useExpenses = () => {
  const expensesQuery = useInfiniteQuery({
    queryKey: ['expenses', 'infinite'],
    queryFn: ({ pageParam }) => getExpenses(10, pageParam * 10),
    staleTime: 1000 * 60 * 60,

    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });

  return {
    expensesQuery,

    // Methods
    loadNextPage: expensesQuery.fetchNextPage,
  };
};
