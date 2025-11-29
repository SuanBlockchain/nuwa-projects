import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/app/lib/utils"

const primaryButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill px-6 py-3 font-display font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        solid:
          "bg-primary text-text-main hover:shadow-glow-primary-lg shadow-glow-primary",
        ghost:
          "rounded-pill border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:border-white/40",
      },
      size: {
        default: "px-6 py-3 text-base",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  }
)

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof primaryButtonVariants> {
  asChild?: boolean
  href?: string
  target?: string
  rel?: string
}

type AnchorHTMLProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof PrimaryButtonProps>;

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, variant, size, href, target, rel, children, ...props }, ref) => {
    if (href) {
      return (
        <a
          className={cn(primaryButtonVariants({ variant, size, className }))}
          href={href}
          target={target}
          rel={rel}
          {...(props as unknown as AnchorHTMLProps)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        className={cn(primaryButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton"

export { PrimaryButton, primaryButtonVariants }
