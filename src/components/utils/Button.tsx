import React from "react";

export interface IButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children?: React.ReactNode;
    variant?:
        | "primary"
        | "danger"
        | "success"
        | "warning"
        | "outline-danger"
        | "outline-warning"
        | "outline-success"
        | "outline-primary";
    square?: boolean;
    paddingLess?: boolean;
}
const Button = ({
                    className,
                    children,
                    variant,
                    square,
                    paddingLess,
                    type = "button",
                    ...props
                }: IButtonProps) => {
    const getVariant = () => {
        switch (variant) {
            case "primary":
                return "bg-blue-500 hover:bg-blue-600 text-white";
            case "danger":
                return "bg-red-500 hover:bg-red-700 text-white ";
            case "success":
                return "bg-green-500 hover:bg-green-700 text-white ";
            case "warning":
                return "bg-amber-500 hover:bg-amber-700 text-white ";
            case "outline-danger":
                return "bg-white text-red-500 border border-red-500 hover:text-white hover:bg-red-700  ";
            case "outline-danger":
                return "bg-white text-red-500 border border-red-500 hover:text-white hover:bg-red-700  ";
            case "outline-success":
                return "bg-white text-green-500 border border-green-500 hover:text-white hover:bg-green-700  ";
            case "outline-warning":
                return "bg-white text-amber-400 border border-amber-500 hover:text-white hover:bg-amber-500  ";
            case "outline-primary":
                return "bg-white text-violet-500 border border-violet-500 hover:text-white hover:bg-violet-700  ";

            default:
                return "group relative w-full flex justify-center border border-transparent text-md font-medium rounded-3xl text-white bg-blue-500 hover:bg-blue-600 focus:outline-none";
        }
    };
    return (
        <button
            {...props}
            type={type}
            className={`
 
        ${getVariant()}  transition duration-500  ${
                !paddingLess && "py-2 px-4"
            }  ${!square && "rounded-md"} active:scale-95 ${className} `}
        >
            {children}
        </button>
    );
};

export default Button;
