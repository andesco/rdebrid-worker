import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { AppSelection, DebridTorrent, DebridUnlock } from "@/types";
import {
  debridItemsQueryOptions,
  useDeleteDebrid,
} from "@/ui/utils/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Icons } from "@/ui/utils/icons";
import { DowloadList } from "./download";
import { TorrentList } from "./torrent";
import { AppButton, AppPagination } from "@/ui/components/primitives";
import { toSelectionIds } from "@/ui/utils/selection";

export default function DebridList() {
  const params = useSearch({ from: "/_authed/view" });

  const {
    data: { items, totalPages },
  } = useSuspenseQuery(debridItemsQueryOptions(params));

  const navigate = useNavigate();

  const handlePageChange = useCallback(
    (page: number, replace = false) =>
      navigate({
        to: "/view",
        search: { page, type: params.type },
        replace,
        resetScroll: true,
      }),
    [navigate, params.type]
  );

  const selectMode = true;
  const [selectedIds, setSelectedIds] = useState<AppSelection>(new Set());

  const itemIds = useMemo(() => items.map((item) => item.id), [items]);
  const ids = useMemo(() => toSelectionIds(selectedIds, itemIds), [selectedIds, itemIds]);

  const postLastPageDelete = useCallback(async () => {
    if (
      totalPages > 1 &&
      params.page === totalPages &&
      items.length > 0 &&
      ids.length === items.length
    ) {
      await handlePageChange(params.page - 1, true);
    }
  }, [handlePageChange, ids.length, items.length, params.page, totalPages]);

  useEffect(() => {
    setSelectedIds(new Set<string>());
  }, [params.type, params.page]);

  const deleteMutation = useDeleteDebrid(params.type, ids, postLastPageDelete);

  const onBulkDelete = useCallback(() => {
    deleteMutation.mutateAsync().finally(() => setSelectedIds(new Set<string>()));
  }, [deleteMutation]);

  const topContent = React.useMemo(
    () => (
      <div className="flex flex-wrap gap-3 px-2">
        {totalPages > 1 && (
          <AppPagination page={params.page} total={totalPages} onChange={handlePageChange} />
        )}

        <AppButton
          title="Select All"
          variant="flat"
          onPress={() =>
            setSelectedIds((prev) => {
              if (prev === "all") return new Set<string>();
              return "all";
            })
          }
          className="flex items-center gap-2"
        >
          <Icons.SelectAll />
          <span className="hidden md:inline">Select All</span>
        </AppButton>
        <AppButton
          isLoading={deleteMutation.isPending}
          title="Delete"
          variant="flat"
          onPress={onBulkDelete}
          className="flex items-center gap-2"
        >
          <Icons.Delete />
          <span className="hidden md:inline">Delete</span>
        </AppButton>
      </div>
    ),
    [deleteMutation.isPending, handlePageChange, onBulkDelete, params.page, totalPages]
  );

  const isDownloads = params.type === "downloads";
  const hasPagination = totalPages > 1;
  return (
    <div className="flex flex-col gap-2">
      {topContent}
      {isDownloads ? (
        <DowloadList
          selectMode={selectMode}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          items={items as DebridUnlock[]}
        />
      ) : (
        <TorrentList
          selectMode={selectMode}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          items={items as DebridTorrent[]}
        />
      )}
      {hasPagination && (
        <div className="flex px-2 pt-2">
          <AppPagination page={params.page} total={totalPages} onChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
