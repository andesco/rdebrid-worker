import { createElement, type SVGProps } from "react";
import GrommetIconsSelect from "~icons/grommet-icons/select";
import IcRoundRefresh from "~icons/ic/round-refresh";
import IcRoundSort from "~icons/ic/round-sort";
import LineMdDownloadingLoop from "~icons/line-md/downloading-loop";
import LineMdUploadingLoop from "~icons/line-md/uploading-loop";
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
import TablerAlertCircleFilled from "~icons/tabler/alert-circle-filled";
import TablerArrowDownDashed from "~icons/tabler/arrow-down-dashed";
import TablerCategory from "~icons/tabler/category";
import TablerChevronRight from "~icons/tabler/chevron-right";
import TablerCircleArrowDown from "~icons/tabler/circle-arrow-down";
import TablerCircleArrowDownFilled from "~icons/tabler/circle-arrow-down-filled";
import TablerCircleCheckFilled from "~icons/tabler/circle-check-filled";
import TablerCircleChevronRight from "~icons/tabler/circle-chevron-right";
import TablerCirclePlus from "~icons/tabler/circle-plus";
import TablerCirclePlusFilled from "~icons/tabler/circle-plus-filled";
import TablerExclamationCircleFilled from "~icons/tabler/exclamation-circle-filled";
import TablerEye from "~icons/tabler/eye";
import TablerMoon from "~icons/tabler/moon";
import TablerSelect from "~icons/tabler/select";
import TablerSearch from "~icons/tabler/search";
import TablerSquareRoundedArrowDown from "~icons/tabler/square-rounded-arrow-down";
import TablerSquareRoundedArrowDownFilled from "~icons/tabler/square-rounded-arrow-down-filled";
import TablerSun from "~icons/tabler/sun";
import TablerZoomCheck from "~icons/tabler/zoom-check";
const SimpleInfuseIcon = (props: SVGProps<SVGSVGElement>) =>
  createElement(
    "svg",
    {
      role: "img",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      width: "1.5rem",
      height: "1.5rem",
      className: `pointer-events-none ${props.className ?? ""}`.trim(),
      ...props,
    },
    createElement("title", null, "Infuse"),
    createElement("path", {
      fill: "#FF8800",
      d: "M18.802 7.736c0 .502-.035.8-.146 1.24a5.1 5.1 0 0 1-.968 1.932c-.176.218-.574.61-.778.764-.077.06-2.619 1.894-5.65 4.077a842 842 0 0 0-5.638 4.077 2.6 2.6 0 0 0-.55.715 2.39 2.39 0 0 0 1.003 3.18c.703.379 1.622.372 2.293-.02a2322 2322 0 0 0 11.378-8.184 6 6 0 0 0 .845-.849 4.78 4.78 0 0 0 .76-4.416 4.86 4.86 0 0 0-1.354-2.068 15 15 0 0 0-.673-.518c-.257-.185-.48-.35-.497-.361-.02-.017-.025.089-.025.43M4.31 5.62c-.903.2-1.573.844-1.822 1.75l-.066.234v7.712l.064.227c.302 1.093 1.212 1.8 2.316 1.8 1.158 0 2.12-.794 2.349-1.945.044-.223.044-7.654 0-7.877a2.5 2.5 0 0 0-.23-.656A2.38 2.38 0 0 0 5.393 5.64a3 3 0 0 0-1.083-.02M6.642.03a4.79 4.79 0 0 0-4.126 3.777c-.054.263-.124.912-.1.936a1 1 0 0 0 .208-.12 4.2 4.2 0 0 1 1.393-.572c.335-.073 1.005-.09 1.366-.037.596.089 1.104.295 1.705.698.103.07 1.913 1.376 4.02 2.902 2.107 1.529 3.884 2.804 3.95 2.837.098.049.15.058.328.058.185 0 .228-.009.352-.068.187-.091.654-.555.834-.834.882-1.341.71-3.078-.41-4.185-.143-.143-.938-.726-3.273-2.417C11.196 1.779 9.706.716 9.584.645A4.8 4.8 0 0 0 6.642.03",
    })
  );

const SimpleVlcIcon = (props: SVGProps<SVGSVGElement>) =>
  createElement(
    "svg",
    {
      role: "img",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      width: "1.5rem",
      height: "1.5rem",
      className: `pointer-events-none ${props.className ?? ""}`.trim(),
      ...props,
    },
    createElement("title", null, "VLC media player"),
    createElement("path", {
      fill: "#FF8800",
      d: "M12.0319 0c-.8823 0-1.0545.136-1.0545.136-.1738.056-.3556.255-.4105.43L9.683 3.3808c.4729.1729 1.3222.4266 2.2337.4266 1.0987 0 2.017-.3494 2.3763-.5075L13.4352.566c-.055-.1755-.237-.3707-.4067-.4374 0 0-.1142-.1286-.9966-.1286zm3.5645 7.455c-.3601.34-1.3276.9373-3.6797.9373-2.2929 0-3.189-.5678-3.5213-.9113l-1.3887 4.4227c.2272.3614 1.2539 1.5594 4.8847 1.5594 3.7569 0 4.8539-1.3467 5.0649-1.6737zm-8.5897 4.4487l-1.0025 3.1922H4.3428c-.2486 0-.5097.1932-.5826.4315l-2.334 7.6317a.3962.3962 0 0 0-.0169.1537c-.0008.0053-.002.0099-.002.016 0 .0839.0233.226.0233.226.0322.2456.2612.4452.5098.4452h20.1192c.2487 0 .4768-.1994.5098-.4453 0 0 .0234-.142.0234-.226a.0245.0245 0 0 0-.0025-.01.3201.3201 0 0 0 .0024-.0313.4096.4096 0 0 0-.019-.1282l-2.3339-7.6318c-.0729-.2383-.334-.4314-.5826-.4314h-1.6636l.2005.6391c-.2407.4854-1.4886 2.38-6.3027 2.38-4.6003 0-5.8288-1.73-6.1107-2.3072z",
    })
  );

export const Icons = {
  HomeOutline: LucideHouse,
  HomeFilled: LucideHouse,
  DownloadOutlineCircle: TablerCircleArrowDown,
  DownloadFilledCircle: TablerCircleArrowDownFilled,
  Download: TablerSquareRoundedArrowDown,
  DownloadFilled: TablerSquareRoundedArrowDownFilled,
  TorrentFilled: LucideMagnet,
  TorrentOutline: LucideMagnet,
  Delete: LucideTrash2,
  Copy: LucideCopy,
  CopySuccess: LucideCopyCheck,
  Play: LucidePlay,
  ExternalLink: LucideExternalLink,
  SelectAll: LucideListChecks,
  DeSelect: LucideListX,
  SelectMode: TablerSelect,
  ChevronRightCircle: TablerCircleChevronRight,
  ChevronRight: TablerChevronRight,
  CheckCircle: TablerCircleCheckFilled,
  Exclamation: TablerExclamationCircleFilled,
  AnimatedUpload: LineMdUploadingLoop,
  AnimatedDownload: LineMdDownloadingLoop,
  SelectWait: GrommetIconsSelect,
  Eye: TablerEye,
  Loading: LucideLoaderCircle,
  BitTorrent: LucideMagnet,
  DownloadDashed: TablerArrowDownDashed,
  Folder: LucideFolder,
  Link: LucideLink,
  Upload: LucideUpload,
  Vlc: SimpleVlcIcon,
  Infuse: SimpleInfuseIcon,
  Search: TablerSearch,
  SearchFilled: TablerSearch,
  DotsVertical: LucideEllipsisVertical,
  Dots: LucideEllipsis,
  Github: LucideGithub,
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
