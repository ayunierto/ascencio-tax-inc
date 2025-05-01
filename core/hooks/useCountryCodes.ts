import { countries } from '@/countryData';
import { useEffect, useState } from 'react';

export const useCountryCodes = () => {
  const [countryCodes, setCountryCodes] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const transformCountries = (): void => {
      countries.map((country) => {
        setCountryCodes((prev) => [
          ...prev,
          {
            label: `${country.name} (${country.phone_code})`,
            value: country.phone_code,
          },
        ]);
      });
    };
    transformCountries();
  }, []);

  return { countryCodes };
};
