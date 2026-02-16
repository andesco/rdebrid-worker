import { AppButton } from "./app-button";

export interface AppErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function AppErrorState({ message, onRetry, className }: AppErrorStateProps) {
  return (
    <div className={className ?? "flex flex-col items-center justify-center gap-3 text-danger"} role="alert">
      <p>{message}</p>
      {onRetry ? (
        <AppButton size="sm" variant="flat" color="danger" onPress={onRetry}>
          Retry
        </AppButton>
      ) : null}
    </div>
  );
}
