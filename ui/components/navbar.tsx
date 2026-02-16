import { Link } from "@tanstack/react-router";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { Icons } from "@/ui/utils/icons";
import { useEffect, useMemo, useState } from "react";
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

export const AppNavbar = () => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [usesSystemTheme, setUsesSystemTheme] = useState(false);

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

  return (
    <Navbar className="px-0 hidden md:flex w-full">
      <NavbarBrand className="justify-start pl-4 flex-grow-0">
        <Link to="/">
          <p className="font-bold text-inherit">rdebrid</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="flex-grow" />
      <NavbarContent className="flex-grow-0" justify="end">
        <ul className="flex items-center gap-2">
          <li>
            <AppButton
              as="a"
              href="https://github.com/andesco/rdebrid-worker"
              target="_blank"
              rel="noopener noreferrer"
              variant="light"
              isIconOnly
              aria-label="Open GitHub repository"
              className="text-default-600 hover:text-primary"
            >
              <Icons.Github />
            </AppButton>
          </li>
          <li>
            <AppButton
              onPress={toggleTheme}
              variant="light"
              isIconOnly
              aria-label={themeLabel}
              className="text-default-600 hover:text-primary"
            >
              {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
            </AppButton>
          </li>
        </ul>
      </NavbarContent>
    </Navbar>
  );
};
