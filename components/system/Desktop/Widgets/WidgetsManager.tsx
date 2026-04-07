import { useSession } from "contexts/session";
import WidgetContainer from "./WidgetContainer";
import { BatteryWidget, ClockWidget, CalculatorWidget, SystemMonitorWidget, WeatherWidget } from "./WidgetTypes";

const WidgetsManager = () => {
  const { widgets } = useSession();

  if (!widgets || Object.keys(widgets).length === 0) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {Object.entries(widgets).map(([widgetKey, widget]) => {
          let Content = null;
          switch (widget.type) {
            case "Clock": Content = ClockWidget; break;
            case "Battery": Content = BatteryWidget; break;
            case "Calculator": Content = CalculatorWidget; break;
            case "SystemMonitor": Content = SystemMonitorWidget; break;
            case "Weather": Content = WeatherWidget; break;
            default: return null;
          }

          return (
            <WidgetContainer key={widgetKey} widget={widget} widgetKey={widgetKey}>
              <Content />
            </WidgetContainer>
          );
        })}
      </div>
    </div>
  );
};

export default WidgetsManager;
