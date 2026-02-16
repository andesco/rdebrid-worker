import type React from "react";
import { type Key, useCallback } from "react";
import type { AppSelection, DebridTorrent, SetValue } from "@/types";
import { copyDataToClipboard, formattedLongDate, size, size2round } from "@/ui/utils/common";
import { useDeleteDebrid } from "@/ui/utils/queryOptions";
import { Checkbox, dataFocusVisibleClasses, DropdownItem, DropdownTrigger } from "@heroui/react";
import { useDebridStore, useSelectModalStore } from "@/ui/utils/store";
import { Icons } from "@/ui/utils/icons";
import { ListBoxItem } from "react-aria-components";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import {
  AppButton,
  AppDropdown,
  AppDropdownMenu,
  AppList,
} from "@/ui/components/primitives";
import { toAppSelection, toggleSelection } from "@/ui/utils/selection";

const items = [
  {
    key: "view",
    label: "View",
    icon: <Icons.Eye />,
  },
  {
    key: "unrestict",
    label: "Unrestict",
    icon: <Icons.DownloadDashed />,
  },
  {
    key: "copy",
    label: "Copy",
    icon: <Icons.Copy />,
  },
  {
    key: "delete",
    label: "Delete",
    icon: <Icons.Delete />,
  },
];

const TorrentDropdown = () => {
  const { open, cords, item, actions } = useDebridStore(
    useShallow((state) => ({
      open: state.dropdown.open,
      cords: state.dropdown.cords,
      item: state.currentDebridItem as DebridTorrent,
      actions: state.actions,
    })),
  );

  const modalActions = useSelectModalStore((state) => state.actions);

  const mutation = useDeleteDebrid("torrents", [item.id]);

  const navigate = useNavigate();

  const onAction = useCallback(
    async (key: Key) => {
      if (key === "delete") mutation.mutate();
      else if (key === "copy") {
        toast.promise(
          copyDataToClipboard(item.links.length > 0 ? item.links.join("\n") : ""),
          {
            loading: "",
            success: "Links copied",
            error: "Failed to copy",
          },
          {
            error: {
              duration: 2000,
            },
          },
        );
      } else if (key === "view") {
        modalActions.setCurrentItem(item);
        modalActions.setOpen(true);
      } else if (key === "unrestict") {
        navigate({
          to: "/downloader/$tabId",
          search: { fileId: item.id },
          params: { tabId: "links" },
        });
      }
    },
    [item, modalActions, mutation, navigate],
  );

  return (
    <AppDropdown isOpen={open} onOpenChange={actions.closeDropdown}>
      <DropdownTrigger>
        <button
          type="button"
          className="fixed"
          style={{ top: cords.y, left: cords.x }}
          tabIndex={-1}
          aria-hidden="true"
        />
      </DropdownTrigger>
      <AppDropdownMenu aria-label="Options" onAction={onAction} items={items}>
        {(menuItem) => (
          <DropdownItem key={menuItem.key} startContent={menuItem.icon}>
            {menuItem.label}
          </DropdownItem>
        )}
      </AppDropdownMenu>
    </AppDropdown>
  );
};

interface TorrentListProps {
  items: DebridTorrent[];
  selectedIds: AppSelection;
  setSelectedIds: SetValue<AppSelection>;
  selectMode: boolean;
}
export function TorrentList({ items, selectedIds, setSelectedIds, selectMode }: TorrentListProps) {
  const { open, actions } = useDebridStore(
    useShallow((state) => ({
      open: state.dropdown.open,
      actions: state.actions,
    })),
  );

  const onDropDownOpen = useCallback((e: React.MouseEvent, item: DebridTorrent) => {
    actions.setCurrentDebridItem(item);
    actions.openDropdown();
    actions.setDropdownCords({ x: e.clientX, y: e.clientY });
  }, [actions]);

  return (
    <>
      {open && <TorrentDropdown />}
      <AppList
        items={items}
        emptyMessage="No torrents found"
        selectionMode={selectMode ? "multiple" : "single"}
        selectionBehavior="toggle"
        dependencies={[selectMode]}
        selectedKeys={selectedIds}
        onSelectionChange={(keys) => setSelectedIds(toAppSelection(keys))}
      >
        {(item) => (
          <ListBoxItem
            className={clsx(
              "rounded-3xl data-[selected=true]:bg-white/5 data-[hovered=true]:bg-white/5 p-2",
              dataFocusVisibleClasses,
            )}
            key={item.id}
            textValue={item.filename}
          >
            {({ isSelected }) => (
              <div className="grid gap-x-4 gap-y-1 md:gap-y-0 cursor-pointer grid-cols-6 rounded-3xl p-2">
                <div className="col-start-1 col-span-6 sm:col-span-4">
                  <p title={item.filename} className="text-base truncate">
                    {item.filename}
                  </p>
                </div>

                <div className="flex ml-auto col-start-4 sm:col-start-5 col-span-full order-2 sm:order-none gap-2">
                  <div className="flex gap-2 items-center">
                    {item.status === "downloading" && <Icons.AnimatedDownload />}

                    {item.status === "uploading" && <Icons.AnimatedUpload />}
                    {item.status === "downloaded" && <Icons.CheckCircle className="text-success" />}
                    {item.status === "error" && <Icons.Exclamation className="text-danger" />}
                    {item.status === "waiting_files_selection" && <Icons.SelectWait />}
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-bold text-sm truncate capitalize">
                        {item.progress}
                        {"%"}
                      </p>
                      {item.status === "downloading" && (
                        <p className="text-bold text-sm truncate">{size(item.speed || 0)}/s</p>
                      )}
                    </div>
                  </div>
                  <Checkbox
                    isSelected={isSelected}
                    size="lg"
                    classNames={{
                      base: "m-0",
                      wrapper: "before:rounded-full after:rounded-full mr-0",
                    }}
                    icon={<Icons.CheckCircle />}
                    aria-label={`Select ${item.filename}`}
                    onChange={() => setSelectedIds((prev) => toggleSelection(prev, item.id))}
                  />
                  <AppButton
                    disableRipple
                    variant="light"
                    title="Options"
                    isIconOnly
                    aria-label={`Open actions for ${item.filename}`}
                    onClick={(e) => onDropDownOpen(e, item)}
                    className="data-[hover=true]:bg-transparent"
                  >
                    <Icons.Dots />
                  </AppButton>
                </div>

                <div className="items-center flex col-start-1 col-span-3 sm:col-span-4">
                  <p className="text-sm text-zinc-400 min-w-20">{size2round(item.bytes)}</p>
                  <p className="text-sm text-zinc-400">{formattedLongDate(item.added)}</p>
                </div>
              </div>
            )}
          </ListBoxItem>
        )}
      </AppList>
    </>
  );
}
