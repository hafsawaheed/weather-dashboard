import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSettings } from '../../hooks/useSettings';
import { formatHour } from '../../utils/date';
import { SectionHeader } from '../common/SectionHeader';
import { GlassCard } from '../ui/GlassCard';
import { MotionSection } from '../ui/MotionSection';

const ChartTooltip = ({ active, payload, label, suffix }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/20 bg-slate-950/90 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-xl">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-slate-200">
        {Math.round(payload[0].value)}{suffix}
      </p>
    </div>
  );
};

const TrendChart = ({ data, dataKey, suffix, label }) => (
  <div className="h-64 w-full" aria-label={label} role="img">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id={`${dataKey}-gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="currentColor" stopOpacity={0.35} />
            <stop offset="95%" stopColor="currentColor" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 8" vertical={false} opacity={0.18} />
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.65 }}
          minTickGap={22}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.65 }}
          width={52}
          tickFormatter={(value) => `${Math.round(value)}${suffix}`}
        />
        <Tooltip content={<ChartTooltip suffix={suffix} />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="currentColor"
          strokeWidth={2.5}
          fill={`url(#${dataKey}-gradient)`}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const WeatherCharts = ({ weather }) => {
  const { unitConfig } = useSettings();
  const timezoneOffset = weather.location.timezoneOffset;

  const chartData = useMemo(
    () =>
      weather.hourly.slice(0, 12).map((hour) => ({
        time: formatHour(hour.timestamp, timezoneOffset),
        temperature: hour.temperature,
        humidity: hour.humidity,
      })),
    [timezoneOffset, weather.hourly],
  );

  return (
    <MotionSection aria-labelledby="trends-heading">
      <SectionHeader
        id="trends-heading"
        title="Weather Trends"
        description="Temperature and humidity through the next forecast period"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-4 text-sky-600 dark:text-sky-300 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-950 dark:text-white">
            Temperature trend
          </h3>
          <TrendChart
            data={chartData}
            dataKey="temperature"
            suffix={unitConfig.temperatureSymbol}
            label="Temperature trend chart"
          />
        </GlassCard>
        <GlassCard className="p-4 text-indigo-600 dark:text-indigo-300 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-950 dark:text-white">
            Humidity trend
          </h3>
          <TrendChart
            data={chartData}
            dataKey="humidity"
            suffix="%"
            label="Humidity trend chart"
          />
        </GlassCard>
      </div>
    </MotionSection>
  );
};

export default WeatherCharts;
