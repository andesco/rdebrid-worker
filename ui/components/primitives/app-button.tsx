import { Button, type ButtonProps } from "@heroui/react";
import { cn } from "@/ui/utils/common";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function AppButton({ className, ...props }: ButtonProps) {
  return <Button className={cn(focusClass, className)} {...props} />;
}
