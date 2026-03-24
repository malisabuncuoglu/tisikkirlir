import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "default" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default:
    "bg-surface border border-border text-text-primary hover:border-text-secondary",
  accent:
    "bg-accent text-bg font-semibold hover:bg-accent/90",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface",
  danger:
    "bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3.5 py-1.5 text-sm",
  lg: "px-5 py-2 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "md", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-1.5 rounded-md font-mono transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
