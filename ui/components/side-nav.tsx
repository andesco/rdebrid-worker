import { useEffect } from "react";
import { useLocation, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { siteConfig, type AppNavItemId } from "@/ui/config/site";
import { Tabs, Tab } from "@heroui/react";
import clsx from "clsx";
import { getActiveNavItemId, normalizeViewType } from "@/ui/utils/navigation";

export const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const router = useRouter();
  const viewSearch = useSearch({ strict: false });

  const activeKey = getActiveNavItemId(
    siteConfig.navItems,
    location.pathname,
    normalizeViewType(viewSearch.type)
  );

  useEffect(() => {
    void router.preloadRoute({
      to: "/view",
      search: { type: "torrents", page: 1 },
    });
    void router.preloadRoute({
      to: "/view",
      search: { type: "downloads", page: 1 },
    });
  }, [router]);

  const handleSelectionChange = (key: React.Key) => {
    const selectedKey = String(key) as AppNavItemId;
    const item = siteConfig.navItems.find((candidate) => candidate.id === selectedKey);
    if (item) {
      navigate({
        to: item.path,
        search: item.search,
      });
    }
  };

  return (
    <div className={clsx(
      "fixed bottom-0 left-0 md:absolute md:top-20 z-50",
      "w-full h-16 md:w-64 md:h-auto"
    )}>
      <Tabs
        selectedKey={activeKey}
        onSelectionChange={handleSelectionChange}
        variant="light"
        size="lg"
        classNames={{
          base: clsx(
            "w-full md:w-64 bg-default-50/80 backdrop-blur-md",
            "md:bg-transparent md:backdrop-blur-none"
          ),
          tabList: clsx(
            "flex md:flex-col gap-0 w-full h-16 md:h-auto",
            "bg-default-50/80 backdrop-blur-md rounded-none md:rounded-medium",
            "md:bg-default-50/50 md:p-2",
            "mx-2 mb-2 md:mx-0 md:mb-0"
          ),
          tab: clsx(
            "flex-1 md:flex-none md:w-full h-16 md:h-14",
            "flex items-center justify-center md:justify-start",
            "px-2 md:px-4 md:py-3",
            "text-xs md:text-sm"
          ),
          tabContent: clsx(
            "flex flex-col md:flex-row items-center gap-1 md:gap-3",
            "group-data-[selected=true]:text-primary"
          )
        }}
      >
        {siteConfig.navItems.map((item) => (
          <Tab
            key={item.id}
            title={
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                <div className="md:w-6 md:h-6 flex items-center justify-center">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="font-medium">
                  {item.label}
                </span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
};
