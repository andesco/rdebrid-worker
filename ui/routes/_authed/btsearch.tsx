import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useRef, useState, useEffect, lazy, Suspense } from "react";
import {
  DropdownItem,
  DropdownTrigger,
  Input,
  type Selection,
} from "@heroui/react";
import { Icons } from "@/ui/utils/icons";
import type { AppSelection } from "@/types";
import { BtSearchList } from "@/ui/components/list/btsearch";
import { btSearchItemsQueryOptions } from "@/ui/utils/queryOptions";
import { valibotSearchValidator } from "@tanstack/router-valibot-adapter";
import { btdigParamsSchema } from "@/ui/utils/schema";
import { useIsFetching } from "@tanstack/react-query";
import {
  AppButton,
  AppDropdown,
  AppDropdownMenu,
  AppLoadingState,
} from "@/ui/components/primitives";
import { toAppSelection } from "@/ui/utils/selection";

const LazyRealDebridAccountInfo = lazy(() =>
  import("@/ui/components/real-debrid-account-info").then((module) => ({
    default: module.RealDebridAccountInfo,
  }))
);

export const Route = createFileRoute("/_authed/btsearch")({
  component: Component,
  validateSearch: valibotSearchValidator(btdigParamsSchema),
  loaderDeps: ({ search }) => search,
  meta: ({ match }) => [
    {
      title: match.search.q,
    },
  ],
  wrapInSuspense: true,
  loader: async ({ context: { queryClient }, deps }) => {
    await queryClient.ensureQueryData(btSearchItemsQueryOptions(deps));
  },
});

const SearchInput = () => {
  const { q } = Route.useSearch();

  const navigate = useNavigate();

  const [search, setSearch] = useState(q || "");

  useIsFetching({ queryKey: ["btsearch"] });

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSubmit = useCallback(
    (e: React.BaseSyntheticEvent) => {
      e.preventDefault();
      navigate({
        to: "/btsearch",
        search: (prev) => ({ ...prev, q: search, page: 1 }),
      });
      if (inputRef.current) inputRef.current.blur();
    },
    [navigate, search]
  );

  return (
    <form onSubmit={onSubmit} className="w-full">
      <Input
        ref={inputRef}
        label="Search"
        description="BT4GPRX.COM API"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};

const categoriesList = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movie" },
  { value: "audio", label: "Audio" },
  { value: "doc", label: "Document" },
  { value: "app", label: "Application" },
  { value: "other", label: "Other" },
] as const;

const sortOderList = [
  { value: "time", label: "CreatedAt" },
  { value: "size", label: "Size" },
  { value: "seeders", label: "Seeders" },
  { value: "relevance", label: "Relevance" },
] as const;

const getFirstSelectionValue = (
  selection: AppSelection,
  fallback: string
): string => {
  if (selection === "all") {
    return fallback;
  }

  return Array.from(selection)[0] ?? fallback;
};

const CategorySelect = () => {
  const { category } = Route.useSearch();

  const [selectedKeys, setSelectedKeys] = useState<AppSelection>(
    new Set([category || "all"])
  );

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedKeys(new Set([category || "all"]));
  }, [category]);

  const onSelectionChange = useCallback(
    (keys: Selection) => {
      const nextSelection = toAppSelection(keys);
      setSelectedKeys(nextSelection);
      const selectedValue = getFirstSelectionValue(nextSelection, "all") as (typeof categoriesList)[number]["value"];
      navigate({
        to: "/btsearch",
        search: (prev) => ({ ...prev, category: selectedValue }),
        replace: true,
      });
    },
    [navigate]
  );

  return (
    <AppDropdown placement="bottom-end">
      <DropdownTrigger>
        <AppButton
          title="Category"
          variant="flat"
          className="bg-white/5"
          isIconOnly
          aria-label="Choose category"
        >
          <Icons.Catergory />
        </AppButton>
      </DropdownTrigger>
      <AppDropdownMenu
        aria-label="Category"
        disallowEmptySelection
        selectionMode="single"
        items={categoriesList}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
      >
        {(item) => (
          <DropdownItem key={item.value} className="capitalize">
            {item.label}
          </DropdownItem>
        )}
      </AppDropdownMenu>
    </AppDropdown>
  );
};

const SortBySelect = () => {
  const { orderBy } = Route.useSearch();

  const [selectedKeys, setSelectedKeys] = useState<AppSelection>(
    new Set([orderBy || "relevance"])
  );

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedKeys(new Set([orderBy || "relevance"]));
  }, [orderBy]);

  const onSelectionChange = useCallback(
    (keys: Selection) => {
      const nextSelection = toAppSelection(keys);
      setSelectedKeys(nextSelection);
      const selectedValue = getFirstSelectionValue(nextSelection, "relevance") as (typeof sortOderList)[number]["value"];
      navigate({
        to: "/btsearch",
        search: (prev) => ({ ...prev, orderBy: selectedValue }),
        replace: true,
      });
    },
    [navigate]
  );

  return (
    <AppDropdown placement="bottom-end">
      <DropdownTrigger>
        <AppButton
          title="Order By"
          variant="flat"
          className="bg-white/5"
          isIconOnly
          aria-label="Choose sort order"
        >
          <Icons.Sort />
        </AppButton>
      </DropdownTrigger>
      <AppDropdownMenu
        aria-label="Order By"
        disallowEmptySelection
        selectionMode="single"
        items={sortOderList}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
      >
        {(item) => (
          <DropdownItem key={item.value} className="capitalize">
            {item.label}
          </DropdownItem>
        )}
      </AppDropdownMenu>
    </AppDropdown>
  );
};
function Component() {
  const { q } = Route.useSearch();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 px-2 w-full md:w-1/2 mx-auto">
        <SearchInput />
        <CategorySelect />
        <SortBySelect />
      </div>
      <BtSearchList />
      {!q && (
        <div className="flex justify-center px-4 pb-4 mt-auto">
          <Suspense fallback={<AppLoadingState label="Loading account info" />}>
            <LazyRealDebridAccountInfo />
          </Suspense>
        </div>
      )}
    </div>
  );
}
