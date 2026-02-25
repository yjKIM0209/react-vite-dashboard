import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 가상의 시계열 데이터 (최근 10분간의 기록)
const data = [
  { time: "10:00", temp: 24.5 },
  { time: "10:01", temp: 24.8 },
  { time: "10:02", temp: 25.1 },
  { time: "10:03", temp: 24.9 },
  { time: "10:04", temp: 25.3 },
  { time: "10:05", temp: 25.0 },
];

export default function TemperatureChart() {
  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-inner mt-6 border border-slate-50">
      <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
        최근 온도 변화 추이
      </h3>
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="time"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
