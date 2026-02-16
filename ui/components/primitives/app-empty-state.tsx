export interface AppEmptyStateProps {
  message: string;
  className?: string;
}

export function AppEmptyState({ message, className }: AppEmptyStateProps) {
  return (
    <p
      className={
        className ??
        "text-center text-lg text-zinc-400 absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
      }
    >
      {message}
    </p>
  );
}
