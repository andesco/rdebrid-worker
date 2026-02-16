import http from "@/ui/utils/http";
import { debridTorrentQueryOptions } from "@/ui/utils/queryOptions";
import { useDebridStore } from "@/ui/utils/store";
import { Button, Input, Textarea } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { DebridUnlock } from "@/types";
import { isAxiosError } from "feaxios";
import { defaultUnlockLinkAvatar } from "@/ui/utils/common";

const initialformState = {
  links: "",
  password: "",
};

export const UnRestrictLink = () => {
  const { fileId, restrictedId } = useSearch({ from: "/_authed/downloader/$tabId" });

  const { data } = useQuery(debridTorrentQueryOptions(fileId));

  const { control, setValue, handleSubmit } = useForm({
    defaultValues: initialformState,
  });

  const status = useDebridStore((state) => state.unRestrictState);

  const actions = useDebridStore((state) => state.actions);

  const onSubmit = async (data: typeof initialformState) => {
    const links = data.links
      .split("\n")
      .map((link) => link.trim())
      .filter(Boolean);

    actions.setUnRestrictState("running");
    try {
      for (const link of links) {
        try {
          const res = await http.postForm<DebridUnlock>("/debrid/unrestrict/link", {
            link,
            password: data.password.trim(),
          });
          actions.addUnrestrictedFile(res.data);
        } catch (err) {
          if (isAxiosError<DebridUnlock>(err)) {
            actions.addUnrestrictedFile({
              id: `error-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              filename: link,
              filesize: 0,
              link,
              host: "",
              error: err.response?.data.error || err.message,
              host_icon: defaultUnlockLinkAvatar,
              chunks: 0,
              crc: 0,
              download: "",
              streamable: 0,
              type: "error",
              mimeType: "",
              generated: new Date().toISOString(),
            });
          }
        }
      }
    } finally {
      actions.setUnRestrictState("idle");
    }
  };

  useEffect(() => {
    if (data) {
      setValue("links", data.links.join("\n"));
    }
    if (restrictedId) {
      setValue("links", `https://real-debrid.com/d/${restrictedId}`);
    }
  }, [data, restrictedId, setValue]);

  useEffect(() => {
    return () => {
      actions.clearUnrestrictedFiles();
    };
  }, [actions]);

  return (
    <form className="flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="links"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Host Links"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            label="Password"
            description="optional password"
            type="password"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Button 
        type="submit" 
        isLoading={status === "running"} 
        color="primary"
        variant="solid"
        className="w-fit"
      >
        Unrestrict Links
      </Button>
    </form>
  );
};
