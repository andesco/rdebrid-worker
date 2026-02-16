import { Icons } from "@/ui/utils/icons";
import { cn } from "@/ui/utils/common";

export interface AppLoadingStateProps {
  label?: string;
  className?: string;
}

export function AppLoadingState({ label = "Loading", className }: AppLoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-zinc-400", className)} role="status" aria-live="polite">
      <Icons.Loading className="size-5" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
