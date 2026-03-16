import React from "react";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";

const SpotifyApp: FC<ComponentProcessProps> = () => {
  const embedUrl =
    "https://open.spotify.com/embed/playlist/1y97nfJIgk5xeiFZuJBVrU?utm_source=generator&theme=0";

  return (
    <div className="h-full w-full overflow-hidden bg-[#121212] p-2 sm:p-3">
      <div className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-black/30">
        <iframe
          className="block h-full min-h-0 w-full flex-1"
          data-testid="embed-iframe"
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Playlist Embed"
        />
      </div>
    </div>
  );
};

export default SpotifyApp;
