import { useEffect, useState } from 'react';

export const useCanResendCode = () => {
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  return {
    timer,
    canResend,
    isLoadingResend,

    setIsLoadingResend,
    setTimer,
    setCanResend,
  };
};
