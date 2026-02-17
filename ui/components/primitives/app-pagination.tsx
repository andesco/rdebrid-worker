import { Pagination, type PaginationProps } from "@heroui/react";

export function AppPagination(props: PaginationProps) {
  return <Pagination isCompact showControls {...props} />;
}
