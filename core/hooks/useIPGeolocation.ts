import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface IPIAPIResponse {
  ip: string;
  type: string;
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip: null;
  latitude: number;
  longitude: number;
  msa: null;
  dma: null;
  radius: null;
  ip_routing_type: string;
  connection_type: string;
  location: Location;
}

export interface Location {
  geoname_id: number;
  capital: string;
  languages: Language[];
  country_flag: string;
  country_flag_emoji: string;
  country_flag_emoji_unicode: string;
  calling_code: string;
  is_eu: boolean;
}

export interface Language {
  code: string;
  name: string;
  native: string;
}

const useIPGeolocation = () => {
  const [location, setLocation] = useState<IPIAPIResponse>();
  const [error, setError] = useState<Error>();

  const IP_API_KEY = process.env.EXPO_PUBLIC_IP_API_KEY;

  const getLocale = async () => {
    const response = await fetch(
      `https://api.ipapi.com/check?access_key=${IP_API_KEY}`
    );
    const data = await response.json();
    return data;
  };

  const query = useQuery({
    queryKey: ['location'],
    queryFn: getLocale,
    staleTime: 1000 * 60 * 60 * 60, // 30 days to execute the consultation again
  });

  useEffect(() => {
    if (query.isPending) {
      return;
    }

    if (query.isError) {
      setError(query.error);
      return;
    }

    if (query.isSuccess) {
      setLocation(query.data);
    }
  }, [query.isPending]);

  return {
    location,
    error,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
  };
};

export default useIPGeolocation;
