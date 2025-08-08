import { httpClient } from '../adapters/http';
// import { useAuthStore } from '../auth/store/useAuthStore';

export const useHttp = () => {
  //   const { status, user, access_token } = useAuthStore();

  // TODO: Implement refresh token logic here

  const get = async <T>(url: string) => {
    return await httpClient.get<T>(url);
  };

  return {
    get,
  };
};
