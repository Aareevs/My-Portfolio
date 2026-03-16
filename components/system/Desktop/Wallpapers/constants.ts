import {
  type WallpaperMenuItem,
  type WallpaperFunc,
} from "components/system/Desktop/Wallpapers/types";
import { type WallpaperFit } from "contexts/session/types";

export const bgPositionSize: Record<WallpaperFit, string> = {
  center: "center center",
  fill: "center center / cover",
  fit: "center center / contain",
  stretch: "center center / 100% 100%",
  tile: "50% 50%",
};

export const WALLPAPER_PATHS: Record<
  string,
  () => Promise<{ default: WallpaperFunc; libs: string[] }>
> = {
  COASTAL_LANDSCAPE: () =>
    import("components/system/Desktop/Wallpapers/ShaderToy/CoastalLandscape"),
  HEXELLS: () => import("components/system/Desktop/Wallpapers/hexells"),
  MATRIX: () => import("components/system/Desktop/Wallpapers/Matrix"),
  STABLE_DIFFUSION: () =>
    import("components/system/Desktop/Wallpapers/StableDiffusion"),
  VANTA: () => import("components/system/Desktop/Wallpapers/vantaWaves"),
};

export const WALLPAPER_WORKERS: Record<string, () => Worker> = {
  COASTAL_LANDSCAPE: (): Worker =>
    new Worker(
      new URL(
        "components/system/Desktop/Wallpapers/ShaderToy/CoastalLandscape/wallpaper.worker",
        import.meta.url
      ),
      { name: "Wallpaper (Coastal Landscape)" }
    ),
  HEXELLS: (): Worker =>
    new Worker(
      new URL(
        "components/system/Desktop/Wallpapers/hexells/wallpaper.worker",
        import.meta.url
      ),
      { name: "Wallpaper (Hexells)" }
    ),
  STABLE_DIFFUSION: (): Worker =>
    new Worker(
      new URL("components/apps/StableDiffusion/sd.worker", import.meta.url),
      { name: "Wallpaper (Stable Diffusion)" }
    ),
  VANTA: (): Worker =>
    new Worker(
      new URL(
        "components/system/Desktop/Wallpapers/vantaWaves/wallpaper.worker",
        import.meta.url
      ),
      { name: "Wallpaper (Vanta Waves)" }
    ),
};

export const WALLPAPER_WORKER_NAMES = Object.keys(WALLPAPER_WORKERS);

export const REDUCED_MOTION_PERCENT = 0.1;

export const WALLPAPER_MENU: WallpaperMenuItem[] = [
  {
    id: "/Users/Public/Pictures/windows-10-default.webp",
    name: "Windows 10 Default",
  },
  {
    hasAlt: false,
    id: "COASTAL_LANDSCAPE",
    name: "Coastal Landscape",
  },
  {
    id: "/Users/Public/Pictures/bliss-windows-xp.jpg",
    name: "Bliss Windows XP",
  },
  {
    id: "/Users/Public/Pictures/plain-black.svg",
    name: "Black Screen",
  },
  {
    id: "/Users/Public/Pictures/grand-canyon.jpg",
    name: "Grand Canyon",
  },
  {
    id: "/Users/Public/Pictures/oregon-sunset.mov",
    name: "Oregon Sunset",
  },
  {
    id: "/Users/Public/Pictures/swiss-alps.jpg",
    name: "Swiss Alps",
  },
  {
    id: "/Users/Public/Pictures/moon-sky.mp4",
    name: "Moon & Sky",
  },
  {
    id: "/Users/Public/Pictures/Tahoe Day.mov",
    name: "Tahoe Day",
  },
  {
    id: "VANTA",
    name: "Vanta Waves",
  },
];

export const BASE_CANVAS_SELECTOR = ":scope > canvas";

export const BASE_VIDEO_SELECTOR = ":scope > video";

export const STABLE_DIFFUSION_DELAY_IN_MIN = 10;

export const PRELOAD_ID = "preloadWallpaper";

export const MAX_RETRIES = 5;
