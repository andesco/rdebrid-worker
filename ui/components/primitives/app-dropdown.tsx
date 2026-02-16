import {
  Dropdown,
  DropdownMenu,
  type DropdownProps,
  type DropdownMenuProps,
  type MenuItemProps,
} from "@heroui/react";

export const appMenuItemClasses: NonNullable<MenuItemProps<object>["classNames"]> = {
  base: ["data-[hover=true]:bg-white/5", "data-[selectable=true]:focus:bg-white/5"],
};

export function AppDropdown({ classNames, ...props }: DropdownProps) {
  return (
    <Dropdown
      classNames={{
        content: "!bg-radial-1 bg-background",
        ...classNames,
      }}
      {...props}
    />
  );
}

export function AppDropdownMenu<T extends object>({ itemClasses, ...props }: DropdownMenuProps<T>) {
  const resolvedItemClasses =
    itemClasses ?? (appMenuItemClasses as NonNullable<DropdownMenuProps<T>["itemClasses"]>);
  return <DropdownMenu itemClasses={resolvedItemClasses} {...props} />;
}
