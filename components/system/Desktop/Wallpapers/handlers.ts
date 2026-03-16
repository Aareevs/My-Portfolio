import { type WallpaperHandler } from "components/system/Desktop/Wallpapers/types";
import {
  MILLISECONDS_IN_HOUR,
} from "utils/constants";
import { jsonFetch, viewWidth, viewHeight } from "utils/functions";

export const wallpaperHandler: Record<string, WallpaperHandler> = {
  LOREM_PICSUM: () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const createLoremPicsumUrl = (): string =>
      `https://picsum.photos/seed/${Math.floor(Math.random() * Date.now())}/${viewWidth()}/${viewHeight()}`;

    return {
      fallbackBackground: createLoremPicsumUrl(),
      newWallpaperFit: "fill",
      updateTimeout: MILLISECONDS_IN_HOUR,
      wallpaperUrl: createLoremPicsumUrl(),
    };
  },
};
