import { ListBox, type ListBoxProps } from "react-aria-components";
import { cn } from "@/ui/utils/common";
import { AppEmptyState } from "./app-empty-state";

interface AppListProps<T extends object> extends ListBoxProps<T> {
  emptyMessage?: string;
  className?: string;
}

export function AppList<T extends object>({
  emptyMessage = "No items found",
  className,
  renderEmptyState,
  ...props
}: AppListProps<T>) {
  return (
    <ListBox
      className={cn("flex flex-col gap-4 p-2", className)}
      renderEmptyState={renderEmptyState ?? (() => <AppEmptyState message={emptyMessage} />)}
      {...props}
    />
  );
}
