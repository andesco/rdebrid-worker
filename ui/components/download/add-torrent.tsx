import { Button, Input } from "@heroui/react";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useRef, useState } from "react";
import http from "@/ui/utils/http";
import { debridTorrentQueryOptions } from "@/ui/utils/queryOptions";
import { useSelectModalStore } from "@/ui/utils/store";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "feaxios";
import { Icons } from "@/ui/utils/icons";
import { decodeTorrentFile, toMagnetURI } from "@/ui/utils/parse-torrent";

const initialformState = {
  torrentPath: "",
  magnet: "",
  hash: "",
};

export const AddTorrent = () => {
  const { control, handleSubmit, setValue, setError } = useForm({
    defaultValues: initialformState,
  });

  const actions = useSelectModalStore((state) => state.actions);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const magnet = useWatch({
    control,
    name: "magnet",
  });

  const torrentPath = useWatch({
    control,
    name: "torrentPath",
  });

  const onSubmit = useCallback(async (data: typeof initialformState) => {
    try {
      let id = "";
      setIsSubmitting(true);
      if (data.magnet) {
        const res = (
          await http.postForm<{ id: string }>("/debrid/torrents/addMagnet", {
            magnet: data.magnet,
          })
        ).data;
        id = res.id;
      }
      const torrent = await queryClient.ensureQueryData(
        debridTorrentQueryOptions(id)
      );
      actions.setCurrentItem(torrent);
      actions.setOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        setError("magnet", { message: error.message });
      } else if (error instanceof AxiosError) {
        setError("magnet", { message: error.response?.data?.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [actions, queryClient, setError]);

  const onTorrentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue("torrentPath", file.name);
        file.arrayBuffer().then((buffer) => {
          decodeTorrentFile(new Uint8Array(buffer)).then((torrent) => {
            const magnetValue = toMagnetURI(
              torrent as unknown as Parameters<typeof toMagnetURI>[0]
            );
            setValue("magnet", magnetValue);
          });
        });
      }
    },
    [setValue]
  );

  return (
    <form
      className="size-full flex gap-6 flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".torrent"
        onChange={onTorrentChange}
      />
      <div className="flex flex-col gap-6">
        <Input
          label="Upload Torrent"
          value={torrentPath}
          readOnly
          onClick={() => inputRef.current?.click()}
          endContent={
            <Icons.Upload
              className="cursor-pointer text-xl"
              onClick={() => inputRef.current?.click()}
            />
          }
          classNames={{
            base: "cursor-pointer",
            input: "cursor-pointer",
            inputWrapper: "cursor-pointer"
          }}
        />
        <Input
          label="Magnet Link"
          value={magnet}
          onChange={(e) => setValue("magnet", e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          isLoading={isSubmitting}
          color="primary"
          variant="solid"
        >
          Add Torrent
        </Button>
        {/* TODO: Re-enable availability UI when Real-Debrid instantAvailability is usable again.
            Reference: debridAvailabilityOptions() in ui/utils/queryOptions.ts */}
      </div>
    </form>
  );
};
