"use client";

import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { apiRegisterUser } from "@/lib/api-requests";
import FormInput from "@/components/FormInput";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";
import useStore from "@/store";
import { handleApiError } from "@/lib/helpers";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const store = useStore();
  const router = useRouter();

  const methods = useForm<RegisterUserInput>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  async function RegisterUserFunction(credentials: RegisterUserInput) {
    store.setRequestLoading(true);
    try {
      const user = await apiRegisterUser(JSON.stringify(credentials));
      store.setAuthUser(user);
      return router.push("/");
    } catch (error: any) {
      if (error instanceof Error) {
        handleApiError(error);
      } else {
        toast.error(error.message);
        console.log("Error message:", error.message);
      }
    } finally {
      store.setRequestLoading(false);
    }
  }

  const onSubmitHandler: SubmitHandler<RegisterUserInput> = (values) => {
    RegisterUserFunction(values);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-white rounded-2xl p-8 space-y-5"
      >
        <FormInput placeholder="Full Name" name="name" />
        <FormInput placeholder="Email" name="email" type="email" />
        <FormInput placeholder="Password" name="password" type="password" />
        <FormInput
            placeholder="Confirm Password"
          name="passwordConfirm"
          type="password"
        />
        <LoadingButton
          loading={store.requestLoading}
          textColor="text-white"
        >
          Register
        </LoadingButton>
        <span className="block text-center">
          Already have an account?{" "}
          <Link href="/" className="text-ct-blue-600">
            Login Here
          </Link>
        </span>
      </form>
    </FormProvider>
  );
}
