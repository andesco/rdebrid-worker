import type { AppSelection } from "@/types";
import type { Selection } from "@heroui/react";

const toId = (value: string | number) => String(value);

export const toAppSelection = (selection: Selection): AppSelection => {
  if (selection === "all") {
    return "all";
  }

  return new Set(Array.from(selection).map((value) => toId(value as string | number)));
};

export const isSelected = (selection: AppSelection, id: string) =>
  selection === "all" || selection.has(id);

export const toggleSelection = (selection: AppSelection, id: string): AppSelection => {
  if (selection === "all") {
    return new Set();
  }

  const next = new Set(selection);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  return next;
};

export const toSelectionIds = (selection: AppSelection, allIds: string[]) =>
  selection === "all" ? allIds : Array.from(selection);
