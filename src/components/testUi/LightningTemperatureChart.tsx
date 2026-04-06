import { useEffect, useRef } from "react";
import {
  lightningChart,
  Themes,
  AxisScrollStrategies,
  SolidFill,
  ColorHEX,
  type ChartXY,
  type DataPattern,
} from "@arction/lcjs";

export default function LightningTemperatureChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    let chart: ChartXY | undefined;

    try {
      chart = lightningChart().ChartXY({
        container: chartRef.current,
        theme: Themes.light,
      });

      chart.setTitle("실시간 고성능 데이터 추이 (LightningChart)");
      chart.setPadding({ top: 10, bottom: 10, left: 10, right: 30 });

      const xAxis = chart.getDefaultAxisX();
      xAxis.setScrollStrategy(AxisScrollStrategies.progressive);

      const lineSeries = chart.addLineSeries({
        dataPattern: { pattern: "ProgressiveX" } as DataPattern,
      });

      lineSeries.setStrokeStyle((style) =>
        style
          .setThickness(3)
          .setFillStyle(new SolidFill({ color: ColorHEX("#10b981") })),
      );

      let x = 0;
      const interval = setInterval(() => {
        lineSeries.add({ x: x++, y: 24 + Math.random() * 5 });
      }, 500);

      return () => {
        chart?.dispose();
        clearInterval(interval);
      };
    } catch (error) {
      console.error("LightningChart 초기화 에러:", error);
    }
  }, []);

  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-inner mt-6 border border-emerald-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-emerald-600 uppercase">
          High-Performance Chart
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold">
            WEBGL_ACCELERATED
          </span>
        </div>
      </div>
      <div
        ref={chartRef}
        className="w-full h-full"
        style={{ height: "240px" }}
      />
    </div>
  );
}
