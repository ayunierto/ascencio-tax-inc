import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useIPGeolocation from "@/core/hooks/useIPGeolocation";
import { useSignUpMutation } from "./useSignUpMutation";
import { SignUpRequest, signUpSchema } from "../schemas/sign-up.schema";

export const useSignUp = () => {
  const { location } = useIPGeolocation();
  const [callingCode, setCallingCode] = useState<string | undefined>();

  // Set the initial calling code based on the user's location
  useEffect(() => {
    if (location) {
      if ("error" in location) return;
      setCallingCode(`+${location.location.calling_code}`);
      setValue("countryCode", `+${location.location.calling_code}`);
    }
  }, [location]);

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
  } = useForm<SignUpRequest>({
    resolver: zodResolver(signUpSchema),
  });

  // Handle the sign-up
  const { mutate: signUpUser, isPending, isError, error } = useSignUpMutation();
  const handleSignUp = async (values: SignUpRequest): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = values;
    signUpUser(rest);
  };

  return {
    control,
    isPending,
    isError,
    error,
    formErrors,
    callingCode,

    handleSubmit,
    setValue,
    onSignUp: handleSignUp,
  };
};
