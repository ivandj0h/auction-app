import React from "react";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    error?: string;
    children?: React.ReactNode;
}

const TextBox = React.forwardRef<HTMLInputElement, IProps>(
    ({ className, children, placeholder, type = "text", error, ...props }, ref) => {
        return (
            <div className={className + " relative"}>
                <div className="flex items-stretch">
                    <input
                        id="txt"
                        autoComplete="off"
                        className={`appearance-none rounded-none relative block w-full py-6 px-1 border-b border-gray-300 placeholder-gray-300 text-gray-500 focus:outline-none focus:ring-amber-950 focus:border-amber-950 focus:z-10 sm:text-sm
              ${error && "border-red-500 border  animate-shake"} ${
                            children ? "rounded-r-md" : "rounded-md"
                        }`}
                        {...props}
                        placeholder={placeholder}
                        ref={ref}
                        type={type}
                    ></input>

                    <div className="flex">{children}</div>
                </div>
                {error && (
                    <p className="text-red-600 text-right animate-shake">{error}</p>
                )}
            </div>
        );
    },
);

TextBox.displayName = "TextBox";
export default TextBox;
