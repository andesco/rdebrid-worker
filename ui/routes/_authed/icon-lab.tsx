import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icons } from "@/ui/utils/icons";
import type { ComponentType } from "react";
import TablerHomeFilled from "~icons/tabler/home-filled";
import TablerHome from "~icons/tabler/home";
import TablerCircleArrowDown from "~icons/tabler/circle-arrow-down";
import TablerCircleArrowDownFilled from "~icons/tabler/circle-arrow-down-filled";
import TablerMagnet from "~icons/tabler/magnet";
import TablerMagnetFilled from "~icons/tabler/magnet-filled";
import TablerTrash from "~icons/tabler/trash";
import TablerCopy from "~icons/tabler/copy";
import TablerCopyCheckFilled from "~icons/tabler/copy-check-filled";
import TablerPlayerPlay from "~icons/tabler/player-play";
import TablerExternalLink from "~icons/tabler/external-link";
import TablerSelectAll from "~icons/tabler/select-all";
import TablerDeselect from "~icons/tabler/deselect";
import TablerSelect from "~icons/tabler/select";
import TablerCircleChevronRight from "~icons/tabler/circle-chevron-right";
import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";
import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
import LineMdDownloadingLoop from "~icons/line-md/downloading-loop";
import LineMdUploadingLoop from "~icons/line-md/uploading-loop";
import GrommetIconsSelect from "~icons/grommet-icons/select";
import TablerEye from "~icons/tabler/eye";
import TadpoleIcon from "~icons/svg-spinners/tadpole";
import SimpleIconsBittorrent from "~icons/simple-icons/bittorrent";
import TablerArrowDownDashed from "~icons/tabler/arrow-down-dashed";
import FolderIcon from "~icons/heroicons/folder-solid";
import TablerChevronRight from "~icons/tabler/chevron-right";
import TablerSquareRoundedArrowDownFilled from "~icons/tabler/square-rounded-arrow-down-filled";
import TablerSquareRoundedArrowDown from "~icons/tabler/square-rounded-arrow-down";
import TablerLink from "~icons/tabler/link";
import TablerUpload from "~icons/tabler/upload";
import FlatColorIconsVlc from "~icons/flat-color-icons/vlc";
import MingcuteSearchLine from "~icons/mingcute/search-line";
import MingcuteSearchFill from "~icons/mingcute/search-fill";
import TablerDotsVertical from "~icons/tabler/dots-vertical";
import TablerDots from "~icons/tabler/dots";
import TablerBrandGithub from "~icons/tabler/brand-github";
import TablerSun from "~icons/tabler/sun";
import TablerMoon from "~icons/tabler/moon";
import TablerCategory from "~icons/tabler/category";
import IcRoundSort from "~icons/ic/round-sort";
import IcRoundRefresh from "~icons/ic/round-refresh";
import TablerCirclePlusFilled from "~icons/tabler/circle-plus-filled";
import TablerCirclePlus from "~icons/tabler/circle-plus";
import TablerZoomCheck from "~icons/tabler/zoom-check";
import TablerAlertCircleFilled from "~icons/tabler/alert-circle-filled";
import LucideArrowDownCircle from "~icons/lucide/arrow-down-circle";
import LucideArrowDownFromLine from "~icons/lucide/arrow-down-from-line";
import LucideArrowUpDown from "~icons/lucide/arrow-up-down";
import LucideBadgeCheck from "~icons/lucide/badge-check";
import LucideChevronRight from "~icons/lucide/chevron-right";
import LucideCircleAlert from "~icons/lucide/circle-alert";
import LucideCircleCheckBig from "~icons/lucide/circle-check-big";
import LucideCircleChevronRight from "~icons/lucide/circle-chevron-right";
import LucideCirclePlus from "~icons/lucide/circle-plus";
import LucideCopy from "~icons/lucide/copy";
import LucideCopyCheck from "~icons/lucide/copy-check";
import LucideDownload from "~icons/lucide/download";
import LucideEllipsis from "~icons/lucide/ellipsis";
import LucideEllipsisVertical from "~icons/lucide/ellipsis-vertical";
import LucideExternalLink from "~icons/lucide/external-link";
import LucideEye from "~icons/lucide/eye";
import LucideFolder from "~icons/lucide/folder";
import LucideGithub from "~icons/lucide/github";
import LucideHouse from "~icons/lucide/house";
import LucideLayoutGrid from "~icons/lucide/layout-grid";
import LucideLink from "~icons/lucide/link";
import LucideListChecks from "~icons/lucide/list-checks";
import LucideListX from "~icons/lucide/list-x";
import LucideLoaderCircle from "~icons/lucide/loader-circle";
import LucideMagnet from "~icons/lucide/magnet";
import LucideMoon from "~icons/lucide/moon";
import LucideMousePointer2 from "~icons/lucide/mouse-pointer-2";
import LucidePlay from "~icons/lucide/play";
import LucidePlayCircle from "~icons/lucide/play-circle";
import LucideRefreshCw from "~icons/lucide/refresh-cw";
import LucideSearch from "~icons/lucide/search";
import LucideSun from "~icons/lucide/sun";
import LucideTrash2 from "~icons/lucide/trash-2";
import LucideUpload from "~icons/lucide/upload";

export const Route = createFileRoute("/_authed/icon-lab")({
  component: IconLabPage,
  meta: () => [{ title: "Icon Lab" }],
});

type IconComponent = ComponentType<{ className?: string }>;
type IconKey = keyof typeof Icons;

const LegacyIcons: Record<IconKey, IconComponent> = {
  HomeOutline: TablerHome,
  HomeFilled: TablerHomeFilled,
  DownloadOutlineCircle: TablerCircleArrowDown,
  DownloadFilledCircle: TablerCircleArrowDownFilled,
  Download: TablerSquareRoundedArrowDown,
  DownloadFilled: TablerSquareRoundedArrowDownFilled,
  TorrentFilled: TablerMagnetFilled,
  TorrentOutline: TablerMagnet,
  Delete: TablerTrash,
  Copy: TablerCopy,
  CopySuccess: TablerCopyCheckFilled,
  Play: TablerPlayerPlay,
  ExternalLink: TablerExternalLink,
  SelectAll: TablerSelectAll,
  DeSelect: TablerDeselect,
  SelectMode: TablerSelect,
  ChevronRightCircle: TablerCircleChevronRight,
  ChevronRight: TablerChevronRight,
  CheckCircle: TablerCircleCheckFilled,
  Exclamation: TablerExclamationCircleFilled,
  AnimatedUpload: LineMdUploadingLoop,
  AnimatedDownload: LineMdDownloadingLoop,
  SelectWait: GrommetIconsSelect,
  Eye: TablerEye,
  Loading: TadpoleIcon,
  BitTorrent: SimpleIconsBittorrent,
  DownloadDashed: TablerArrowDownDashed,
  Folder: FolderIcon,
  Link: TablerLink,
  Upload: TablerUpload,
  Vlc: FlatColorIconsVlc,
  Infuse: Icons.Infuse,
  Search: MingcuteSearchLine,
  SearchFilled: MingcuteSearchFill,
  DotsVertical: TablerDotsVertical,
  Dots: TablerDots,
  Github: TablerBrandGithub,
  Sun: TablerSun,
  Moon: TablerMoon,
  Catergory: TablerCategory,
  Sort: IcRoundSort,
  Refresh: IcRoundRefresh,
  CirclePlusFilled: TablerCirclePlusFilled,
  CirclePlus: TablerCirclePlus,
  CheckZoom: TablerZoomCheck,
  AlertCircleFilled: TablerAlertCircleFilled,
};

const LucideIcons: Record<IconKey, IconComponent> = {
  HomeOutline: LucideHouse,
  HomeFilled: LucideHouse,
  DownloadOutlineCircle: LucideArrowDownCircle,
  DownloadFilledCircle: LucideArrowDownCircle,
  Download: LucideDownload,
  DownloadFilled: LucideDownload,
  TorrentFilled: LucideMagnet,
  TorrentOutline: LucideMagnet,
  Delete: LucideTrash2,
  Copy: LucideCopy,
  CopySuccess: LucideCopyCheck,
  Play: LucidePlay,
  ExternalLink: LucideExternalLink,
  SelectAll: LucideListChecks,
  DeSelect: LucideListX,
  SelectMode: LucideMousePointer2,
  ChevronRightCircle: LucideCircleChevronRight,
  ChevronRight: LucideChevronRight,
  CheckCircle: LucideCircleCheckBig,
  Exclamation: LucideCircleAlert,
  AnimatedUpload: LucideUpload,
  AnimatedDownload: LucideDownload,
  SelectWait: LucideListChecks,
  Eye: LucideEye,
  Loading: LucideLoaderCircle,
  BitTorrent: LucideMagnet,
  DownloadDashed: LucideArrowDownFromLine,
  Folder: LucideFolder,
  Link: LucideLink,
  Upload: LucideUpload,
  Vlc: LucidePlayCircle,
  Infuse: LucidePlayCircle,
  Search: LucideSearch,
  SearchFilled: LucideSearch,
  DotsVertical: LucideEllipsisVertical,
  Dots: LucideEllipsis,
  Github: LucideGithub,
  Sun: LucideSun,
  Moon: LucideMoon,
  Catergory: LucideLayoutGrid,
  Sort: LucideArrowUpDown,
  Refresh: LucideRefreshCw,
  CirclePlusFilled: LucideCirclePlus,
  CirclePlus: LucideCirclePlus,
  CheckZoom: LucideBadgeCheck,
  AlertCircleFilled: LucideCircleAlert,
};
const CustomIcons: Partial<Record<IconKey, IconComponent>> = {
  Infuse: Icons.Infuse,
  Vlc: Icons.Vlc,
};

const iconKeys = Object.keys(Icons) as IconKey[];
const lineMdKeys = new Set<IconKey>(["AnimatedUpload", "AnimatedDownload"]);
const grommetKeys = new Set<IconKey>(["SelectWait"]);
const icKeys = new Set<IconKey>(["Sort", "Refresh"]);
const currentTablerKeys = new Set<IconKey>([
  "DownloadOutlineCircle",
  "DownloadFilledCircle",
  "Download",
  "DownloadFilled",
  "SelectMode",
  "ChevronRightCircle",
  "ChevronRight",
  "CheckCircle",
  "Exclamation",
  "Eye",
  "DownloadDashed",
  "Sun",
  "Moon",
  "Catergory",
  "CirclePlusFilled",
  "CirclePlus",
  "CheckZoom",
  "AlertCircleFilled",
]);
const currentLineMdKeys = new Set<IconKey>(["AnimatedUpload", "AnimatedDownload"]);
const currentGrommetKeys = new Set<IconKey>(["SelectWait"]);
const currentIcKeys = new Set<IconKey>(["Sort", "Refresh"]);
const currentCustomKeys = new Set<IconKey>(["Infuse", "Vlc"]);

const getCurrentSource = (
  key: IconKey
): "tabler" | "line-md" | "grommet-icons" | "ic" | "lucide" | "custom" => {
  if (currentCustomKeys.has(key)) return "custom";
  if (currentLineMdKeys.has(key)) return "line-md";
  if (currentGrommetKeys.has(key)) return "grommet-icons";
  if (currentIcKeys.has(key)) return "ic";
  if (currentTablerKeys.has(key)) return "tabler";
  return "lucide";
};

const isTablerLegacyKey = (key: IconKey) =>
  !lineMdKeys.has(key) &&
  !grommetKeys.has(key) &&
  !icKeys.has(key) &&
  key !== "Infuse" &&
  key !== "Vlc" &&
  key !== "Loading" &&
  key !== "BitTorrent" &&
  key !== "Folder" &&
  key !== "Search" &&
  key !== "SearchFilled";

function IconCell({ Icon, isUsed = false }: { Icon: IconComponent; isUsed?: boolean }) {
  return (
    <div
      className={
        isUsed
          ? "flex items-center justify-center rounded-md border border-success/40 bg-success/15 p-2"
          : "flex items-center justify-center rounded-md border border-divider bg-content2 p-2"
      }
    >
      <Icon className="size-6" />
    </div>
  );
}

function IconLabPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 p-2">
      <Card>
        <CardHeader className="pb-1">
          <h1 className="text-xl font-semibold">Full Icon Replacement Matrix (Temporary)</h1>
        </CardHeader>
        <CardBody className="pt-1 text-sm text-default-600">
          <p>
            This table includes every icon key used by the app and shows:
            legacy candidates + Lucide candidate.
          </p>
          <p>
            Light green highlight indicates which source is currently used for that key. For custom
            keys (Infuse/VLC), no option column is highlighted.
          </p>
          <p>Total mapped keys: {iconKeys.length}</p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="pb-1">
          <h2 className="text-lg font-semibold">All Icon Keys</h2>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 text-sm">
            <div className="font-medium">Icon Key</div>
            <div className="font-medium text-center">Lucide</div>
            <div className="font-medium text-center">Tabler</div>
            <div className="font-medium text-center">line-md</div>
            <div className="font-medium text-center">grommet-icons</div>
            <div className="font-medium text-center">ic</div>
            <div className="font-medium text-center">custom</div>

            {iconKeys.map((key) => (
              <div key={key} className="contents">
                <div className="flex items-center gap-2 py-1 font-mono text-xs md:text-sm">
                  <span>{key === "Vlc" ? "VLC" : key}</span>
                  {getCurrentSource(key) === "custom" ? (
                    <span className="rounded bg-warning/20 px-1.5 py-0.5 text-[10px] font-sans text-warning-700">
                      custom
                    </span>
                  ) : null}
                </div>
                <div>
                  <IconCell Icon={LucideIcons[key]} isUsed={getCurrentSource(key) === "lucide"} />
                </div>
                <div>
                  {isTablerLegacyKey(key) ? (
                    <IconCell Icon={LegacyIcons[key]} isUsed={getCurrentSource(key) === "tabler"} />
                  ) : (
                    <div className="flex items-center justify-center rounded-md border border-divider bg-content2 p-2 text-default-400">
                      -
                    </div>
                  )}
                </div>
                <div>
                  {lineMdKeys.has(key) ? (
                    <IconCell Icon={LegacyIcons[key]} isUsed={getCurrentSource(key) === "line-md"} />
                  ) : (
                    <div className="flex items-center justify-center rounded-md border border-divider bg-content2 p-2 text-default-400">
                      -
                    </div>
                  )}
                </div>
                <div>
                  {grommetKeys.has(key) ? (
                    <IconCell Icon={LegacyIcons[key]} isUsed={getCurrentSource(key) === "grommet-icons"} />
                  ) : (
                    <div className="flex items-center justify-center rounded-md border border-divider bg-content2 p-2 text-default-400">
                      -
                    </div>
                  )}
                </div>
                <div>
                  {icKeys.has(key) ? (
                    <IconCell Icon={LegacyIcons[key]} isUsed={getCurrentSource(key) === "ic"} />
                  ) : (
                    <div className="flex items-center justify-center rounded-md border border-divider bg-content2 p-2 text-default-400">
                      -
                    </div>
                  )}
                </div>
                <div>
                  {CustomIcons[key] ? (
                    <IconCell Icon={CustomIcons[key] as IconComponent} isUsed={getCurrentSource(key) === "custom"} />
                  ) : (
                    <div className="flex items-center justify-center rounded-md border border-divider bg-content2 p-2 text-default-400">
                      -
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
