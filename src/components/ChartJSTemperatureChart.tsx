import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function ChartJSTemperatureChart() {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [
      {
        label: "실시간 온도 (°C)",
        data: [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      setChartData((prev) => {
        const newLabels = [...(prev.labels || []), timeStr];
        const newData = [
          ...(prev.datasets[0].data as number[]),
          24 + Math.random() * 5,
        ];

        if (newLabels.length > 20) {
          newLabels.shift();
          newData.shift();
        }

        return {
          ...prev,
          labels: newLabels,
          datasets: [{ ...prev.datasets[0], data: newData }],
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: {
        grid: { color: "#e2e8f0" },
        ticks: { font: { size: 10 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    animation: { duration: 0 },
  };

  return (
    <div className="h-[300px] w-full bg-slate-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-emerald-600 tracking-widest">
          LIVE DATA ENGINE
        </span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-500 font-mono">
            CONNECTED
          </span>
        </div>
      </div>
      <div className="h-[220px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
