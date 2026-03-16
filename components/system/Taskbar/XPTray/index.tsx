import { memo, useEffect, useState } from "react";
import { Info, Monitor, Minimize, ShieldCheck } from "lucide-react";

type XPTrayProps = {
  clockWidth: number;
  hasAI: boolean;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
  onToggleWelcome: () => void;
  trayWidth: number;
};

type TrayIconProps = {
  active?: boolean;
  color?: string;
  icon: React.ComponentType<{
    className?: string;
    size?: number;
    style?: React.CSSProperties;
  }>;
  onClick: () => void;
  title: string;
};

const TrayIcon: FC<TrayIconProps> = ({
  active,
  color = "#fff",
  icon: Icon,
  onClick,
  title,
}) => (
  <button
    onClick={onClick}
    style={{
      alignItems: "center",
      background: active ? "rgba(255,255,255,0.15)" : "transparent",
      border: "none",
      borderRadius: 2,
      cursor: "pointer",
      display: "flex",
      height: 28,
      justifyContent: "center",
      width: 28,
    }}
    title={title}
    type="button"
  >
    <Icon size={14} style={{ color }} />
  </button>
);

const XPTray: FC<XPTrayProps> = ({
  clockWidth,
  hasAI,
  isCrtEnabled,
  onToggleCrt,
  onToggleWelcome,
  trayWidth,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = (): void =>
      setIsFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
        borderLeft: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        height: "100%",
        padding: "0 8px",
        position: "absolute",
        right: `calc(${clockWidth}px + ${hasAI ? 46 : 0}px)`,
        top: 0,
        width: trayWidth,
        zIndex: 2,
      }}
    >
      <TrayIcon
        color="#67cbf7"
        icon={Info}
        onClick={onToggleWelcome}
        title="About this interface"
      />
      <TrayIcon
        active={isCrtEnabled}
        color={isCrtEnabled ? "#4ade80" : "rgba(255,255,255,0.75)"}
        icon={ShieldCheck}
        onClick={onToggleCrt}
        title="Toggle brightness"
      />
      <TrayIcon
        icon={isFullscreen ? Minimize : Monitor}
        onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {
              // Ignore fullscreen failures.
            });
          } else {
            document.exitFullscreen().catch(() => {
              // Ignore fullscreen failures.
            });
          }
        }}
        title="Toggle fullscreen"
      />
    </div>
  );
};

export default memo(XPTray);
