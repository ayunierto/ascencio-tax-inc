import { useQuery } from '@tanstack/react-query';

export const useAccounts = () => {
  const accountQuery = useQuery({
    queryKey: ['accounts', 'infinite'],
  });

  return { accountQuery };
};
