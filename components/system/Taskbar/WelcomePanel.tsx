import { memo, useEffect } from "react";

type WelcomePanelProps = {
  onClose: () => void;
  onOpenAbout: () => void;
  onOpenProjects: () => void;
  visible: boolean;
};

const AUTO_HIDE_MS = 5000;

const WelcomePanel: FC<WelcomePanelProps> = ({
  onClose,
  onOpenAbout,
  onOpenProjects,
  visible,
}) => {
  useEffect(() => {
    if (!visible) return undefined;

    const timer = window.setTimeout(onClose, AUTO_HIDE_MS);

    return () => window.clearTimeout(timer);
  }, [onClose, visible]);

  if (!visible) return null;

  return (
    <aside
      style={{
        background:
          "repeating-linear-gradient(180deg, #f4f0de 0px, #f4f0de 2px, #ece6cc 2px, #ece6cc 4px)",
        border: "2px solid #111",
        borderRadius: 10,
        bottom: 42,
        boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
        color: "#1f2937",
        position: "fixed",
        right: 12,
        width: 250,
        zIndex: 120,
      }}
    >
      <header
        style={{
          alignItems: "center",
          background: "linear-gradient(180deg, #2b77de 0%, #1b5eb7 100%)",
          borderBottom: "1px solid #274f90",
          borderRadius: "8px 8px 0 0",
          color: "#e8f2ff",
          display: "flex",
          fontFamily: "Tahoma, 'Segoe UI', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          justifyContent: "space-between",
          lineHeight: 1,
          padding: "6px 10px",
        }}
      >
        <span>Welcome to Aareev's Portfolio</span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#e8f2ff",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
          }}
          type="button"
        >
          ×
        </button>
      </header>
      <div style={{ display: "flex", gap: 8, padding: "9px 10px 10px" }}>
        <div
          style={{
            alignItems: "center",
            border: "3px solid #2563eb",
            borderRadius: "50%",
            color: "#2563eb",
            display: "flex",
            fontFamily: "Georgia, serif",
            fontSize: 24,
            fontStyle: "italic",
            fontWeight: 700,
            height: 40,
            justifyContent: "center",
            minWidth: 40,
          }}
        >
          i
        </div>
        <div style={{ fontFamily: "Tahoma, 'Segoe UI', sans-serif", fontSize: 11 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            A faithful Windows-inspired interface.
          </div>
          <div style={{ lineHeight: 1.35, marginBottom: 8 }}>
            Custom-built to showcase my work and attention to detail. Credits go to Mitch Ivin & Dustin Brett!
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onOpenAbout}
              style={{
                background: "transparent",
                border: "none",
                color: "#1d4ed8",
                cursor: "pointer",
                fontSize: 11,
                padding: 0,
                textDecoration: "underline",
              }}
              type="button"
            >
              About Me
            </button>
            <button
              onClick={onOpenProjects}
              style={{
                background: "transparent",
                border: "none",
                color: "#1d4ed8",
                cursor: "pointer",
                fontSize: 11,
                padding: 0,
                textDecoration: "underline",
              }}
              type="button"
            >
              My Projects
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default memo(WelcomePanel);
