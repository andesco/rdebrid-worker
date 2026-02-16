import { Icons } from "@/ui/utils/icons";
import type { DebridParams } from "@/ui/utils/schema";
import type { ComponentType } from "react";

export type NavViewType = DebridParams["type"];
export type AppNavItemId = "btsearch" | "add" | "torrents" | "downloads";

type NavItemSearch = {
  [key: string]: string | number | boolean | undefined;
};

export type AppNavItem = {
  id: AppNavItemId;
  label: string;
  path: string;
  search: NavItemSearch;
  icon: ComponentType<{ className?: string }>;
  matchPaths?: readonly string[];
  viewMatch?: {
    path: "/view";
    type: NavViewType;
  };
};

export const siteConfig = {
  name: "Debrid",
  description: "Debrid",
  navItems: [
    {
      id: "btsearch",
      label: "Search",
      path: "/btsearch",
      search: {},
      icon: Icons.Search,
    },
    {
      id: "add",
      label: "Add",
      path: "/downloader/torrents",
      search: {},
      icon: Icons.Link,
      matchPaths: ["/downloader/torrents", "/downloader/links"],
    },
    {
      id: "torrents",
      label: "Torrents",
      path: "/torrents",
      search: {},
      icon: Icons.TorrentOutline,
      matchPaths: ["/torrents"],
      viewMatch: { path: "/view", type: "torrents" },
    },
    {
      id: "downloads",
      label: "Downloads",
      path: "/downloads",
      search: {},
      icon: Icons.Download,
      matchPaths: ["/downloads"],
      viewMatch: { path: "/view", type: "downloads" },
    },
  ],
} satisfies { name: string; description: string; navItems: readonly AppNavItem[] };
