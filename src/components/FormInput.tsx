import React from "react";
import { useFormContext } from "react-hook-form";

type FormInputProps = { placeholder: string; name: string; type?: string; };

const FormInput: React.FC<FormInputProps> = ({placeholder, name, type = "text",}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="">
      <input
        type={type}
        placeholder={placeholder}
        className="appearance-none rounded-none relative block w-full py-4 px-1 border-b border-gray-300 placeholder-gray-300 text-gray-500 focus:outline-none focus:ring-amber-950 focus:border-amber-950 focus:z-10 sm:text-sm"
        {...register(name)}
      />
      {errors[name] && (
        <span className="text-red-500 text-xs pt-1 block">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
