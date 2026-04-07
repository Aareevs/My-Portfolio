import { memo, useRef } from "react";
import StyledDesktop from "components/system/Desktop/StyledDesktop";
import useWallpaper from "components/system/Desktop/Wallpapers/useWallpaper";
import FileManager from "components/system/Files/FileManager";
import WidgetsManager from "components/system/Desktop/Widgets/WidgetsManager";
import { DESKTOP_PATH } from "utils/constants";

const Desktop: FC = ({ children }) => {
  const desktopRef = useRef<HTMLElement | null>(null);

  useWallpaper(desktopRef);

  return (
    <StyledDesktop ref={desktopRef}>
      <FileManager
        url={DESKTOP_PATH}
        allowMovingDraggableEntries
        hideLoading
        hideScrolling
        isDesktop
        loadIconsImmediately
      />
      <WidgetsManager />
      {children}
    </StyledDesktop>
  );
};

export default memo(Desktop);
