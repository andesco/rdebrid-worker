import { useEffect, useMemo, useState } from "react";
import type { DebridFileNode, DebridTorrent, DebridTorrentFile } from "@/types";
import { size2round } from "@/ui/utils/common";
import {
  debridAvailabilityOptions,
  debridTorrentQueryOptions,
  useCreateDebrid,
} from "@/ui/utils/queryOptions";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useQueries } from "@tanstack/react-query";
import { useSelectModalStore } from "@/ui/utils/store";
import { Icons } from "@/ui/utils/icons";
import { getQueryClient } from "@/ui/utils/queryClient";
import { DebridFileTree } from "../file-tree";
import { useShallow } from "zustand/shallow";
import { AppButton, AppLoadingState } from "@/ui/components/primitives";

function pathsToTree(files: DebridTorrentFile[]) {
  const selectedPaths: string[] = [];

  const root: DebridFileNode = {
    name: "root",
    path: "/",
    children: [],
    selected: 0,
    isFolder: true,
  };

  function findOrCreateNode(
    parent: DebridFileNode[],
    name: string,
    fullPath: string,
    isFolder = true
  ) {
    let node = parent.find((n) => n.path === fullPath);
    if (!node) {
      node = {
        name,
        path: fullPath,
        children: [],
        selected: 0,
        isFolder,
      };
      parent.push(node);
    }
    return node;
  }

  files.forEach((file) => {
    const parts = file.path.split("/").filter(Boolean);
    let currentLevel = root.children;
    let currentPath = "";

    for (let i = 0; i < parts.length - 1; i++) {
      currentPath += `/${parts[i]}`;
      const node = findOrCreateNode(currentLevel, parts[i], currentPath, true);
      currentLevel = node.children;
    }

    const fileName = parts[parts.length - 1];
    currentPath += `/${fileName}`;
    const fileNode = findOrCreateNode(currentLevel, fileName, currentPath, false);
    fileNode.fileId = file.id;
    fileNode.selected = file.selected;
    fileNode.link = file.link;

    if (file.selected === 1) {
      selectedPaths.push(fileNode.path);
    }
  });

  function updateFolderStatus(node: DebridFileNode): {
    totalSelected: number;
    totalFiles: number;
  } {
    if (!node.isFolder) {
      return {
        totalSelected: node.selected,
        totalFiles: 1,
      };
    }

    let totalSelected = 0;
    let totalFiles = 0;

    for (const child of node.children) {
      const childStats = updateFolderStatus(child);
      totalSelected += childStats.totalSelected;
      totalFiles += childStats.totalFiles;
    }

    node.selected = totalFiles > 0 && totalSelected === totalFiles ? 1 : 0;

    if (node.selected === 1) {
      selectedPaths.push(node.path);
    }

    return {
      totalSelected,
      totalFiles,
    };
  }

  updateFolderStatus(root);

  return {
    root,
    paths: selectedPaths,
  };
}

export function FileSelectModal() {
  const [item, actions, selectedPaths, isOpen] = useSelectModalStore(
    useShallow((state) => [
      state.item,
      state.actions,
      state.selectedPaths,
      state.open,
    ])
  );
  const hasItem = Boolean(item);
  const currentItem = item ?? null;

  const [{ data, isLoading }, { data: avaliabilityData }] = useQueries({
    queries: [
      debridTorrentQueryOptions(currentItem?.id),
      debridAvailabilityOptions(
        currentItem?.hash || "",
        hasItem &&
          (currentItem?.status === "waiting_files_selection" ||
            currentItem?.status === "magnet_conversion")
      ),
    ],
  });

  const { root, paths } = useMemo(() => pathsToTree(data?.files || []), [data?.files]);

  useEffect(() => {
    actions.setSelectedPaths(new Set(paths));
  }, [actions, paths]);

  const [currentAvaliability, setCurrentAvaliability] = useState(0);

  useEffect(() => {
    if (!currentItem) {
      return;
    }

    if (data?.files && currentItem.status !== "waiting_files_selection") {
      actions.setSelectedPaths(new Set(data.files.filter((x) => x.selected === 1).map((x) => x.path)));
    } else if (
      data?.files &&
      (currentItem.status === "waiting_files_selection" || currentItem.status === "magnet_conversion") &&
      avaliabilityData?.avaliabilities &&
      avaliabilityData?.avaliabilities.length > 0
    ) {
      const currentAvaliabilityData = avaliabilityData.avaliabilities[currentAvaliability];
      actions.setSelectedPaths(
        new Set(data.files.filter((x) => currentAvaliabilityData.find((y) => y.id === x.id)).map((x) => x.path))
      );
    }
  }, [actions, currentItem, data?.files, avaliabilityData, currentAvaliability]);

  const ids = useMemo(
    () => data?.files?.filter((x) => selectedPaths.has(x.path)).map((x) => x.id) || [],
    [data?.files, selectedPaths]
  );

  const createTorrent = useCreateDebrid();

  return (
    <Modal
      backdrop="transparent"
      isOpen={isOpen}
      onOpenChange={actions.setOpen}
      classNames={{
        base: "max-w-[50rem] !bg-radial-1 bg-background",
        closeButton: "hover:bg-white/5 active:bg-white/5",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Torrent Files</ModalHeader>
            <ModalBody>
              {!currentItem ? null : (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex text-sm">
                      <h2>Name:&nbsp;</h2>
                      <h2 title={currentItem.filename} className="truncate font-bold">
                        {currentItem.filename}
                      </h2>
                    </div>
                    <div className="flex items-center justify-between h-10">
                      <span className="flex text-sm">
                        <h2>Size :&nbsp;</h2>
                        <h2 className="font-bold">{size2round(currentItem.bytes)}</h2>
                      </span>
                      {avaliabilityData?.avaliabilities && avaliabilityData.avaliabilities.length > 0 && (
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            Avaliability: {currentAvaliability + 1} of {avaliabilityData.avaliabilities.length}
                          </p>
                          <AppButton
                            isIconOnly
                            size="sm"
                            className="bg-white/5 rounded-full"
                            onPress={() => {
                              setCurrentAvaliability(
                                (prev) => (prev + 1) % avaliabilityData.avaliabilities.length
                              );
                            }}
                            aria-label="Next availability option"
                          >
                            <Icons.ChevronRight />
                          </AppButton>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative h-72 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-default/40">
                    {isLoading ? (
                      <AppLoadingState
                        label="Loading torrent files"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    ) : (
                      <DebridFileTree root={root} status={currentItem.status} />
                    )}
                  </div>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <AppButton
                className="bg-white/5 rounded-full"
                isLoading={createTorrent.isPending}
                isDisabled={!currentItem}
                onPress={() => {
                  if (!currentItem) {
                    return;
                  }
                  createTorrent
                    .mutateAsync({
                      fileId: currentItem.id,
                      ids,
                    })
                    .then(() => {
                      getQueryClient().invalidateQueries({ queryKey: ["debrid"] });
                      onClose();
                    });
                }}
              >
                Add
              </AppButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
