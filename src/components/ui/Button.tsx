import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "soft" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary: "bg-[var(--green-500)] text-white hover:bg-[var(--green-600)] active:bg-[var(--green-700)]",
  soft:    "bg-[var(--green-050)] text-[var(--green-600)] hover:bg-[var(--green-100)] border border-[var(--green-200)]",
  ghost:   "bg-transparent text-[var(--ink-2)] hover:bg-[var(--surface-2)]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-[12px] rounded-[var(--r-sm)]",
  md: "h-9 px-4 text-[13px] rounded-[var(--r-md)]",
  lg: "h-10 px-5 text-[14px] rounded-[var(--r-md)]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 font-semibold transition-colors cursor-pointer select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
