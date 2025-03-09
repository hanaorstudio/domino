
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface GradientButtonProps extends ButtonProps {
  gradient?: "mint-rose" | "green-pink" | "pink-green";
  children: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  gradient = "mint-rose",
  className,
  children,
  ...props
}) => {
  const gradientClasses = {
    "mint-rose": "bg-gradient-mint-rose hover:opacity-90",
    "green-pink": "bg-gradient-green-pink hover:opacity-90",
    "pink-green": "bg-gradient-pink-green hover:opacity-90"
  };

  return (
    <Button
      className={cn(
        gradientClasses[gradient],
        "border-none text-foreground font-medium",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
