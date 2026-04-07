import { useEffect, useState, useCallback } from "react";
import { HardDrive, Cpu, Battery, Wifi, Volume2, CloudRain, Sun, Cloud, CloudLightning, CloudSnow, CloudDrizzle, CloudSun, CloudFog, Bluetooth, Headphones } from "lucide-react";

const WidgetBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{
    width: 280,
    backgroundColor: 'rgba(30,30,30,0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    padding: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, sans-serif'
  }}>
    <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 12, textTransform: 'uppercase', color: '#e5e5e5' }}>{title}</div>
    {children}
  </div>
);

export const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <WidgetBox title="Date Time">
      <div style={{ fontSize: 32, fontWeight: 300, marginBottom: 4 }}>{time.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}</div>
      <div style={{ fontSize: 13, color: '#60a5fa' }}>{time.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </WidgetBox>
  );
};

interface BtDevice {
  name: string;
  battery: number;
  server?: any;
}

export const BatteryWidget = () => {
  const [level, setLevel] = useState(1);
  const [charging, setCharging] = useState(false);
  const [btDevices, setBtDevices] = useState<BtDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [btSupported] = useState(() => typeof navigator !== 'undefined' && 'bluetooth' in navigator);

  useEffect(() => {
    let bat: any;
    const update = () => { if (bat) { setLevel(bat.level); setCharging(bat.charging); } };
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((b: any) => {
        bat = b;
        update();
        b.addEventListener('levelchange', update);
        b.addEventListener('chargingchange', update);
      });
    }
  }, []);

  const scanBluetooth = useCallback(async () => {
    if (!btSupported) return;
    setScanning(true);
    try {
      const bt = (navigator as any).bluetooth;
      const device = await bt.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });
      if (device.gatt) {
        const server = await device.gatt.connect();
        try {
          const service = await server.getPrimaryService('battery_service');
          const char = await service.getCharacteristic('battery_level');
          const val = await char.readValue();
          const batteryLevel = val.getUint8(0);
          setBtDevices(prev => {
            const filtered = prev.filter(d => d.name !== (device.name || 'Unknown Device'));
            return [...filtered, { name: device.name || 'Unknown Device', battery: batteryLevel, server }];
          });
          // Listen for battery changes
          await char.startNotifications();
          char.addEventListener('characteristicvaluechanged', (e: any) => {
            const newVal = e.target.value.getUint8(0);
            setBtDevices(prev => prev.map(d => 
              d.name === (device.name || 'Unknown Device') ? { ...d, battery: newVal } : d
            ));
          });
        } catch {
          // Device doesn't have battery service
          setBtDevices(prev => {
            const filtered = prev.filter(d => d.name !== (device.name || 'Unknown Device'));
            return [...filtered, { name: device.name || 'Unknown Device', battery: -1, server }];
          });
        }
      }
    } catch (e) {
      // User cancelled or error
    }
    setScanning(false);
  }, [btSupported]);

  const getBatteryColor = (pct: number) => {
    if (pct > 60) return '#4ade80';
    if (pct > 20) return '#facc15';
    return '#ef4444';
  };

  return (
    <WidgetBox title="Battery">
      {/* Device Battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: btDevices.length > 0 || btSupported ? 14 : 0 }}>
        <Battery size={32} color={charging ? '#4ade80' : 'white'} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 300 }}>{Math.round(level * 100)}%</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{charging ? 'Plugged In' : 'Remaining'}</div>
        </div>
      </div>

      {/* Connected BT Devices */}
      {btDevices.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, marginBottom: 8 }}>
          {btDevices.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < btDevices.length - 1 ? 8 : 0 }}>
              <Headphones size={18} color="#60a5fa" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>
                  {d.battery >= 0 ? `${d.battery}%` : 'Battery N/A'}
                </div>
              </div>
              {d.battery >= 0 && (
                <div style={{ width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <div style={{ width: `${d.battery}%`, height: '100%', backgroundColor: getBatteryColor(d.battery), borderRadius: 2 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Scan Button */}
      {btSupported && (
        <div
          onClick={(e) => { e.stopPropagation(); scanBluetooth(); }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '6px 0', borderRadius: 4, cursor: scanning ? 'wait' : 'pointer',
            backgroundColor: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)',
            fontSize: 12, color: '#60a5fa', transition: 'background-color 0.2s',
            opacity: scanning ? 0.6 : 1
          }}
          onMouseEnter={(e) => { if (!scanning) e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.25)'; }}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.15)'}
        >
          <Bluetooth size={14} />
          {scanning ? 'Scanning...' : btDevices.length > 0 ? 'Pair Another Device' : 'Pair Bluetooth Device'}
        </div>
      )}
    </WidgetBox>
  );
};

export const CalculatorWidget = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [newNum, setNewNum] = useState(false);

  const handleInput = (val: string) => {
    if (val === 'AC') {
      setDisplay('0');
      setPrev(null);
      setOp(null);
      setNewNum(false);
    } else if (['+', '-', 'X', '/'].includes(val)) {
      setPrev(display);
      setOp(val);
      setNewNum(true);
    } else if (val === '=') {
      if (prev && op) {
        const a = parseFloat(prev);
        const b = parseFloat(display);
        let res = 0;
        if (op === '+') res = a + b;
        if (op === '-') res = a - b;
        if (op === 'X') res = a * b;
        if (op === '/') res = a / b;
        setDisplay(res.toString());
        setPrev(null);
        setOp(null);
        setNewNum(true);
      }
    } else {
      if (newNum) {
        setDisplay(val);
        setNewNum(false);
      } else {
        if (val === '.' && display.includes('.')) return;
        setDisplay(display === '0' && val !== '.' ? val : display + val);
      }
    }
  };

  const btnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    width: '100%', aspectRatio: '1/1', fontSize: 24, fontWeight: 300, color: '#f3f4f6', 
    userSelect: 'none', borderRadius: 8, transition: 'background-color 0.1s'
  };

  return (
    <div style={{ width: 300, backgroundColor: '#202020', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '24px 32px', fontSize: 56, fontWeight: 300, color: '#ffffff' }}>
        {display.slice(0, 8)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '0 24px 24px 24px' }}>
        {['AC', '^', '%', '/', '7', '8', '9', 'X', '4', '5', '6', '-', '1', '2', '3', '+', '0', '00', '.', '='].map(btn => (
          <div key={btn} onClick={(e) => { e.stopPropagation(); handleInput(btn); }} style={btnStyle}
               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            {btn}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SystemMonitorWidget = () => {
  const [mem, setMem] = useState(0);
  useEffect(() => {
    const i = setInterval(() => {
      if ((performance as any).memory) {
        setMem(Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024));
      } else {
        setMem(Math.floor(Math.random() * 50) + 100); // Mock if unavailable
      }
    }, 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <WidgetBox title="CPU / Memory">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Cpu size={24} className="text-blue-400" />
        <div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>System Usage</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Active processing via V8</div>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
          <span>Memory Used (Heap)</span>
          <span className="text-blue-400">{mem} MB</span>
        </div>
        <div style={{ width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div style={{ width: `${Math.min(100, (mem / 2000) * 100)}%`, height: '100%', backgroundColor: '#60a5fa' }} />
        </div>
      </div>
    </WidgetBox>
  );
};

// wttr.in WWO weather codes mapping
const getWeatherDetails = (code: number) => {
  if (code === 113) return { label: 'Clear', Icon: Sun, color: '#facc15' };
  if (code === 116) return { label: 'Partly Cloudy', Icon: CloudSun, color: '#facc15' };
  if (code === 119) return { label: 'Cloudy', Icon: Cloud, color: '#d1d5db' };
  if (code === 122) return { label: 'Overcast', Icon: Cloud, color: '#9ca3af' };
  if ([143, 248, 260].includes(code)) return { label: 'Fog', Icon: CloudFog, color: '#9ca3af' };
  if ([176, 263, 266].includes(code)) return { label: 'Drizzle', Icon: CloudDrizzle, color: '#60a5fa' };
  if ([293, 296, 299, 302, 305, 308, 311, 314, 353, 356, 359].includes(code)) return { label: 'Rain', Icon: CloudRain, color: '#3b82f6' };
  if ([179, 182, 185, 227, 230, 317, 320, 323, 326, 329, 332, 335, 338, 350, 362, 365, 368, 371, 374, 377, 392, 395].includes(code)) return { label: 'Snow', Icon: CloudSnow, color: '#e5e7eb' };
  if ([200, 386, 389].includes(code)) return { label: 'Storm', Icon: CloudLightning, color: '#fbbf24' };
  return { label: 'Unknown', Icon: Cloud, color: '#d1d5db' };
};

export const WeatherWidget = () => {
  const [data, setData] = useState<any>(null);
  const [location, setLocation] = useState('Fetching...');
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    // Timezone → city name mapping for wttr.in query
    const tzMap: Record<string, string> = {
      'Asia/Kolkata': 'Pune',
      'Asia/Calcutta': 'Pune',
      'Asia/Mumbai': 'Mumbai',
      'Asia/Delhi': 'New Delhi',
      'Asia/Chennai': 'Chennai',
      'America/New_York': 'New York',
      'America/Chicago': 'Chicago',
      'America/Denver': 'Denver',
      'America/Los_Angeles': 'Los Angeles',
      'America/Phoenix': 'Phoenix',
      'America/Toronto': 'Toronto',
      'America/Vancouver': 'Vancouver',
      'Europe/London': 'London',
      'Europe/Paris': 'Paris',
      'Europe/Berlin': 'Berlin',
      'Europe/Moscow': 'Moscow',
      'Asia/Tokyo': 'Tokyo',
      'Asia/Shanghai': 'Shanghai',
      'Asia/Singapore': 'Singapore',
      'Asia/Dubai': 'Dubai',
      'Australia/Sydney': 'Sydney',
      'Pacific/Auckland': 'Auckland',
    };

    const fetchWeather = async () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cityQuery = tzMap[tz] || tz.split('/').pop()?.replace(/_/g, ' ') || 'Pune';

      // Try browser geolocation first for city name display
      let displayLocation = cityQuery;

      try {
        const wRes = await fetch(`/weather-api/${encodeURIComponent(cityQuery)}?format=j1`);
        if (!wRes.ok) throw new Error(`HTTP ${wRes.status}`);
        const wData = await wRes.json();

        if (wData?.current_condition?.[0] && wData?.weather) {
          const cc = wData.current_condition[0];
          const areaName = wData.nearest_area?.[0]?.areaName?.[0]?.value;
          const country = wData.nearest_area?.[0]?.country?.[0]?.value;
          if (areaName) displayLocation = country ? `${areaName}, ${country}` : areaName;

          setLocation(displayLocation);
          setData({
            current_weather: {
              temperature: parseFloat(cc.temp_C),
              weathercode: parseInt(cc.weatherCode, 10),
            },
            daily: wData.weather.map((day: any) => ({
              date: day.date,
              maxtempC: parseFloat(day.maxtempC),
              mintempC: parseFloat(day.mintempC),
              weathercode: parseInt(day.hourly?.[4]?.weatherCode || '113', 10),
            })),
          });
        }
      } catch {
        setLocation(displayLocation);
        setError(true);
      }
    };

    fetchWeather();
  }, []);

  if (error) {
    return (
      <div style={{ width: 440, height: 160, backgroundColor: '#202b33', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif', flexDirection: 'column', gap: 8 }}>
        <CloudRain size={32} />
        <div>Weather unavailable</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ width: 440, height: 160, backgroundColor: '#202b33', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif' }}>
        Loading Weather...
      </div>
    );
  }

  const { current_weather, daily } = data;
  const currDetails = getWeatherDetails(current_weather.weathercode);
  const CurrIcon = currDetails.Icon;

  return (
    <div style={{ 
      width: 440, 
      backgroundColor: '#202b33', 
      color: '#ffffff', 
      padding: '24px', 
      display: 'flex', 
      justifyContent: 'space-between',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      userSelect: 'none'
    }}>
      {/* Left Pane */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <CurrIcon size={64} style={{ marginTop: 8 }} color={currDetails.color} strokeWidth={1.5} />
          <div style={{ fontSize: 13, color: '#e5e7eb', marginTop: 12 }}>{time.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 2 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 400, color: '#f3f4f6' }}>{currDetails.label}</div>
            <div style={{ fontSize: 56, fontWeight: 300, lineHeight: 1, marginTop: -4 }}>
              {Math.round(current_weather.temperature)}°<span style={{ fontSize: 40 }}>C</span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#d1d5db' }}>{location}</div>
        </div>
      </div>

      {/* Right Pane (Forecast) */}
      <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
        {daily.slice(1).map((day: any, i: number) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const DIcon = getWeatherDetails(day.weathercode).Icon;
          const dColor = getWeatherDetails(day.weathercode).color;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 13, marginBottom: 8, color: '#e5e7eb' }}>{dayName}</div>
              <DIcon size={28} color={dColor} strokeWidth={1.5} style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>{Math.round(day.maxtempC)}°</div>
              <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{Math.round(day.mintempC)}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
