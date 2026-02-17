import { siteConfig } from "@/ui/config/site";
import { Icons } from "@/ui/utils/icons";
import { getActiveNavItemId, normalizeViewType } from "@/ui/utils/navigation";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useLocation, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppButton } from "@/ui/components/primitives";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const getStoredTheme = (): Theme | null => {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
};

const getSystemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span className="relative inline-block h-5 w-5">
    <span
      className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
        isOpen ? "top-[9px] rotate-45" : "top-[3px] rotate-0"
      }`}
    />
    <span
      className={`absolute left-0 top-[9px] block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
        isOpen ? "opacity-0" : "opacity-100"
      }`}
    />
    <span
      className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
        isOpen ? "top-[9px] -rotate-45" : "top-[15px] rotate-0"
      }`}
    />
  </span>
);

export const AppNavbar = () => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [usesSystemTheme, setUsesSystemTheme] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    const storedTheme = getStoredTheme();
    const resolvedTheme = storedTheme ?? getSystemTheme();
    setUsesSystemTheme(!storedTheme);
    setTheme(resolvedTheme);
    applyTheme(resolvedTheme);

    if (storedTheme) {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = (event: MediaQueryListEvent) => {
      const nextTheme = event.matches ? "dark" : "light";
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };

    media.addEventListener("change", onMediaChange);
    return () => media.removeEventListener("change", onMediaChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setUsesSystemTheme(false);
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  const themeLabel = useMemo(() => {
    if (usesSystemTheme) {
      return `Toggle theme (currently ${theme}, system)`;
    }

    return `Toggle theme (currently ${theme})`;
  }, [theme, usesSystemTheme]);

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

  const handleNavigate = useCallback(
    (path: string, search: Record<string, string | number | boolean | undefined>) => {
      void navigate({ to: path, search });
      setIsMenuOpen(false);
    },
    [navigate]
  );

  return (
    <Navbar
      shouldHideOnScroll
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          icon={<MenuIcon isOpen={isMenuOpen} />}
        />
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-2" justify="start">
        {siteConfig.navItems.map((item) => (
          <NavbarItem key={item.id} isActive={activeKey === item.id}>
            <AppButton
              variant={activeKey === item.id ? "flat" : "light"}
              onPress={() => handleNavigate(item.path, item.search)}
              startContent={<item.icon />}
            >
              {item.label}
            </AppButton>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden md:flex">
          <AppButton
            as="a"
            href="https://github.com/andesco/rdebrid-worker"
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            isIconOnly
            aria-label="Open GitHub repository"
          >
            <Icons.Github />
          </AppButton>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <AppButton onPress={toggleTheme} variant="light" isIconOnly aria-label={themeLabel}>
            {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
          </AppButton>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {siteConfig.navItems.map((item) => (
          <NavbarMenuItem key={item.id}>
            <AppButton
              variant={activeKey === item.id ? "flat" : "light"}
              className="w-full justify-start"
              startContent={<item.icon />}
              onPress={() => handleNavigate(item.path, item.search)}
            >
              {item.label}
            </AppButton>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <AppButton
            as="a"
            href="https://github.com/andesco/rdebrid-worker"
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            className="w-full justify-start"
            startContent={<Icons.Github />}
          >
            GitHub
          </AppButton>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <AppButton
            variant="light"
            className="w-full justify-start"
            startContent={theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
            onPress={toggleTheme}
          >
            {theme === "dark" ? "Light Theme" : "Dark Theme"}
          </AppButton>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
