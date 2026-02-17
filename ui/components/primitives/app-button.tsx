import { Button, type ButtonProps } from "@heroui/react";
import { cn } from "@/ui/utils/common";
import { forwardRef } from "react";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const AppButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  return <Button ref={ref} className={cn(focusClass, className)} {...props} />;
});

AppButton.displayName = "AppButton";
