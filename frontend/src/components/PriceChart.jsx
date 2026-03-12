import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { currentCETHour, toLocalHour } from '../utils/formatters'

const NOW_HOUR = currentCETHour()

function priceColor(sek) {
  if (sek <= 0.40) return '#22c55e'   // green — cheap
  if (sek <= 0.70) return '#eab308'   // yellow — moderate
  return '#ef4444'                    // red — expensive
}

function CustomDot({ cx, cy, payload }) {
  const hour = parseInt(toLocalHour(payload.timestamp_utc).split(':')[0], 10)
  if (hour !== NOW_HOUR) return null
  return <circle cx={cx} cy={cy} r={6} fill="#60a5fa" stroke="#1e40af" strokeWidth={2} />
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm">
      <p className="text-gray-400">{label}</p>
      <p className="font-semibold" style={{ color: priceColor(p.price_sek_kwh) }}>
        {p.price_sek_kwh.toFixed(2)} <span className="text-gray-400 font-normal">SEK/kWh</span>
      </p>
      <p className="text-gray-500 text-xs">{p.price_eur_mwh.toFixed(1)} EUR/MWh</p>
      {p.is_mock && <p className="text-yellow-500 text-xs mt-1">mock data</p>}
    </div>
  )
}

export function PriceChart({ prices, isMock }) {
  const chartData = prices.map((p) => ({
    ...p,
    hour: toLocalHour(p.timestamp_utc),
    price_sek_kwh: parseFloat(p.price_sek_kwh),
    price_eur_mwh: parseFloat(p.price_eur_mwh),
  }))

  const avg = chartData.reduce((s, d) => s + d.price_sek_kwh, 0) / chartData.length

  // Show only HH:00 labels (every full hour) to avoid overlap on 15-min data
  const tickFormatter = (value) => (value.endsWith(':00') ? value : '')

  return (
    <div className="w-full">
      {isMock && (
        <p className="text-xs text-yellow-400 mb-2 text-center">
          ⚠ Showing mock data — add ENTSOE_API_KEY to see real prices
        </p>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis
            dataKey="hour"
            interval={0}
            tickFormatter={tickFormatter}
            tick={{ fill: '#9ca3af', fontSize: 11, dy: 4 }}
            angle={-45}
            textAnchor="end"
          />
          <YAxis
            tickFormatter={(v) => `${v.toFixed(2)}`}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avg}
            stroke="#6b7280"
            strokeDasharray="4 4"
            label={{ value: 'avg', fill: '#6b7280', fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="price_sek_kwh"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 4, fill: '#60a5fa' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
