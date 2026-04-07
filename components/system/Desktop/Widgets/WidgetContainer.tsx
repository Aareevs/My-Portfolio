import { useState } from "react";
import { Rnd } from "react-rnd";
import { useSession } from "contexts/session";
import { type WidgetState } from "contexts/session/types";
import { X } from "lucide-react";

type Props = {
  widget: WidgetState;
  children: React.ReactNode;
};

const WidgetContainer: React.FC<Props> = ({ widget, children }) => {
  const { setWidgets } = useSession();
  const [hover, setHover] = useState(false);

  const handleDelete = () => {
    setWidgets((w) => {
      const copy = { ...w };
      delete copy[widget.id];
      return copy;
    });
  };

  const handleDragStop = (e: any, d: any) => {
    setWidgets((w) => ({
      ...w,
      [widget.id]: {
        ...w[widget.id],
        position: { x: d.x, y: d.y }
      }
    }));
  };

  return (
    <Rnd
      default={{
        x: widget.position?.x || Math.floor(window.innerWidth / 2 - 140),
        y: widget.position?.y || Math.floor(window.innerHeight / 2 - 100),
        width: "auto",
        height: "auto",
      }}
      enableResizing={false}
      bounds="parent"
      dragHandleClassName="widget-drag-handle"
      onDragStop={handleDragStop}
      style={{ zIndex: 10, position: 'absolute', pointerEvents: 'auto' }}
    >
      <div 
        style={{ position: 'relative', width: '100%', height: '100%' }} 
        className="widget-drag-handle"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && (
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: -12,
              right: -12,
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            <X size={14} />
          </button>
        )}
        {children}
      </div>
    </Rnd>
  );
};

export default WidgetContainer;
