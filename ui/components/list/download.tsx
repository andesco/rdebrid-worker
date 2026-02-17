import type React from "react";
import { type Key, useCallback } from "react";
import type { AppSelection, DebridUnlock, SetValue } from "@/types";
import {
  copyDataToClipboard,
  formattedLongDate,
  navigateToExternalUrl,
  size2round,
} from "@/ui/utils/common";
import { useDeleteDebrid } from "@/ui/utils/queryOptions";
import { Checkbox, dataFocusVisibleClasses, DropdownItem, DropdownTrigger } from "@heroui/react";
import { useDebridStore } from "@/ui/utils/store";
import { Icons } from "@/ui/utils/icons";
import { ListBoxItem } from "react-aria-components";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import {
  AppButton,
  AppDropdown,
  AppDropdownMenu,
  AppList,
} from "@/ui/components/primitives";
import { toAppSelection, toggleSelection } from "@/ui/utils/selection";

const items = [
  {
    key: "original",
    label: "Open Link",
    icon: <Icons.ExternalLink />,
  },
  {
    key: "play",
    label: "Play",
    icon: <Icons.Play />,
  },
  {
    key: "infuse",
    label: "Open with Infuse",
    icon: <Icons.Infuse />,
  },
  {
    key: "vlc",
    label: "Open with VLC",
    icon: <Icons.Vlc />,
  },
  {
    key: "download",
    label: "Download",
    icon: <Icons.Download />,
  },
  {
    key: "copy",
    label: "Copy Link",
    icon: <Icons.Copy />,
  },
  {
    key: "delete",
    label: "Delete",
    icon: <Icons.Delete />,
  },
];

const DownloadDropdown = () => {
  const { open, cords } = useDebridStore((state) => state.dropdown);
  const actions = useDebridStore((state) => state.actions);

  const item = useDebridStore((state) => state.currentDebridItem) as DebridUnlock;

  const mutation = useDeleteDebrid("downloads", [item.id]);

  const navigate = useNavigate();

  const onAction = useCallback(
    (key: Key) => {
      if (key === "delete") mutation.mutate();
      else if (key === "original") navigateToExternalUrl(item.link);
      else if (key === "play")
        navigate({
          to: "/watch/$",
          params: { _splat: item.download.replace("https://", "") },
        });
      else if (key === "download") navigateToExternalUrl(item.download, false);
      else if (key === "copy") {
        toast.promise(
          copyDataToClipboard(item.download),
          {
            loading: "",
            success: "Link copied",
            error: "Failed to copy",
          },
          {
            error: {
              duration: 2000,
            },
          },
        );
      } else if (key === "vlc") {
        navigateToExternalUrl(`vlc://${item.download}`);
      } else if (key === "infuse") {
        navigateToExternalUrl(
          `infuse://x-callback-url/play?url=${encodeURIComponent(item.download)}`
        );
      }
    },
    [item, mutation, navigate],
  );

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        actions.closeDropdown();
      }
    },
    [actions]
  );

  return (
    <AppDropdown isOpen={open} onOpenChange={onOpenChange}>
      <DropdownTrigger>
        <button
          type="button"
          className="fixed"
          style={{ top: cords.y, left: cords.x }}
          tabIndex={-1}
          aria-hidden="true"
        />
      </DropdownTrigger>
      <AppDropdownMenu
        aria-label="Options"
        onAction={onAction}
        items={
          item.streamable
            ? items
            : items.filter((i) => i.key !== "play" && i.key !== "vlc" && i.key !== "infuse")
        }
      >
        {(menuItem) => (
          <DropdownItem key={menuItem.key} startContent={menuItem.icon}>
            {menuItem.label}
          </DropdownItem>
        )}
      </AppDropdownMenu>
    </AppDropdown>
  );
};

interface DownloadListProps {
  items: DebridUnlock[];
  selectedIds: AppSelection;
  setSelectedIds: SetValue<AppSelection>;
  selectMode: boolean;
}
export function DowloadList({ items, selectedIds, setSelectedIds, selectMode }: DownloadListProps) {
  const { open, actions } = useDebridStore(
    useShallow((state) => ({
      open: state.dropdown.open,
      actions: state.actions,
    })),
  );

  const onDropDownOpen = useCallback((e: React.MouseEvent, item: DebridUnlock) => {
    e.preventDefault();
    e.stopPropagation();
    actions.setCurrentDebridItem(item);
    actions.setDropdownCords({ x: e.clientX, y: e.clientY });
    actions.openDropdown();
  }, [actions]);

  return (
    <>
      {open && <DownloadDropdown />}
      <AppList
        items={items}
        emptyMessage="No downloads found"
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
                <div className="col-start-1 col-span-6 sm:col-span-5">
                  <p title={item.filename} className="text-base truncate">
                    {item.filename}
                  </p>
                </div>

                <div className="flex ml-auto col-start-6 col-end-6 order-2 sm:order-none">
                  <Checkbox
                    isSelected={isSelected}
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

                <div className="items-center flex col-start-1 col-span-5">
                  <p className="text-sm text-zinc-400 min-w-20">{size2round(item.filesize)}</p>
                  <p className="text-sm text-zinc-400">{formattedLongDate(item.generated)}</p>
                </div>
              </div>
            )}
          </ListBoxItem>
        )}
      </AppList>
    </>
  );
}
