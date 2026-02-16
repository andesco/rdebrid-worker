import type { AppNavItem, AppNavItemId, NavViewType } from "@/ui/config/site";

export const normalizeViewType = (value: unknown): NavViewType | undefined => {
  if (value === "torrents" || value === "downloads") {
    return value;
  }

  return undefined;
};

export const getActiveNavItemId = (
  navItems: readonly AppNavItem[],
  pathname: string,
  viewType?: NavViewType
): AppNavItemId => {
  for (const item of navItems) {
    const matchPaths = item.matchPaths ?? [item.path];
    const isMatched = matchPaths.some((path) => pathname.startsWith(path));

    if (item.viewMatch && pathname === item.viewMatch.path && viewType === item.viewMatch.type) {
      return item.id;
    }

    if (isMatched) {
      return item.id;
    }
  }

  return navItems[0]?.id ?? "add";
};
