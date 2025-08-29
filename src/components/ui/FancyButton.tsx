// components/FancyButton.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const FancyButton: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      
      className={`
        font-fredoka
        w-full
        relative overflow-visible 
        px-8 py-3 rounded border border-shibutis-primary 
        before:absolute before:inset-0 before:bg-shibutis-orange
        before:rounded before:transition-all before:duration-200
        before:clip-path-[polygon(0_0,100%_0,82%_100%,0%_100%)]
        text-white transition-all duration-200
        translate-x-1 -translate-y-1 shadow-[-4px_4px_#00b72e]
        hover:translate-x-0 hover:translate-y-0 hover:shadow-none
        hover:before:bg-shibutis-primary hover:text-white
        active:shadow-none active:translate-x-0 active:translate-y-0
        ${className}
      `}
    >
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );
};
