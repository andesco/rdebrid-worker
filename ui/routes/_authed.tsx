import { AppNavbar } from "@/ui/components/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSelectModalStore } from "@/ui/utils/store";
import { lazy, Suspense, useEffect } from "react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authed")({
  component: AuthenticatedLayout,
});

const LazyFileSelectModal = lazy(() =>
  import("@/ui/components/list/file-select-modal").then((module) => ({
    default: module.FileSelectModal,
  }))
);

const shouldShowToast = (key: string, ttlHours: number) => {
  const now = Date.now();
  const previous = Number(localStorage.getItem(key) ?? 0);
  const ttlMs = ttlHours * 60 * 60 * 1000;

  if (now - previous < ttlMs) {
    return false;
  }

  localStorage.setItem(key, String(now));
  return true;
};

function AuthenticatedLayout() {
  const open = useSelectModalStore((state) => state.open);

  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const response = await fetch("/api/debrid/user");

        if (response.status === 500 && shouldShowToast("toast:missing-token", 12)) {
          toast.error("Worker is missing DEBRID_TOKEN. Add the secret and redeploy.", {
            duration: 7000,
            id: "missing-debrid-token",
          });
        }
      } catch {
        if (shouldShowToast("toast:api-unreachable", 6)) {
          toast.error("Unable to reach worker API. Check deployment and network.", {
            duration: 5000,
            id: "api-unreachable",
          });
        }
      }

      const isProdHost = !["localhost", "127.0.0.1"].includes(window.location.hostname);
      const hasCfAccessJWT = document.cookie.includes("CF_Authorization");
      const secureProtocol = window.location.protocol === "https:";

      if (
        isProdHost &&
        secureProtocol &&
        !hasCfAccessJWT &&
        shouldShowToast("toast:security-reminder", 24)
      ) {
        toast("Enable Cloudflare Access or HTTP Basic Auth for public deployments.", {
          duration: 6000,
          id: "security-reminder",
        });
      }
    };

    void checkCredentials();
  }, []);

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <main className="mx-auto max-w-screen-xl p-4">
        <Outlet />
      </main>
      {open ? (
        <Suspense fallback={null}>
          <LazyFileSelectModal />
        </Suspense>
      ) : null}
    </div>
  );
}
