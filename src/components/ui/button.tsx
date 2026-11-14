import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        terminal:
          "rounded-lg border border-code-green/60 bg-code-green/10 font-mono text-code-green shadow-glow-green hover:bg-code-green hover:text-terminal",
        terminalGhost:
          "rounded-lg border border-terminal-line bg-terminal-raised font-mono text-terminal-foreground hover:border-terminal-muted",
        romance:
          "rounded-full bg-rose-gradient font-semibold text-primary-foreground shadow-glow-rose hover:brightness-105 active:scale-[0.98] transition-all",
        gold: "rounded-full bg-gold-gradient font-semibold text-ink shadow-glow-gold hover:brightness-105 active:scale-[0.98] transition-all",
        meeting:
          "rounded-lg bg-meeting font-semibold text-meeting-foreground hover:brightness-110 active:scale-[0.98] transition-all",
        softOutline:
          "rounded-full border border-rose/40 bg-card/70 text-ink backdrop-blur hover:bg-card",
        night:
          "rounded-full border border-starlight/40 bg-night-foreground/10 text-night-foreground backdrop-blur hover:bg-night-foreground/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        xl: "h-12 px-7 text-base [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
