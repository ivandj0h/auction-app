import React from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

type LoadingButtonProps = {
  loading: boolean;
  btnColor?: string;
  textColor?: string;
  children: React.ReactNode;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  textColor = "text-white",
  btnColor = "bg-red-500",
  children,
  loading = false,
}) => {
  return (
    <button
      type="submit"
      className={twMerge(
        `group relative w-full flex justify-center mt-20 p-4 border border-transparent text-sm font-medium rounded-3xl text-white bg-red-500 hover:bg-red-600 focus:outline-none`,
        `${btnColor} ${loading && "bg-[#fff]"}`
      )}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-white inline-block">Loading...</span>
        </div>
      ) : (
        <span className={`${textColor}`}>{children}</span>
      )}
    </button>
  );
};
