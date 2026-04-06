import { mockEquipments } from "@/api/mockData";
import LiveTemperature from "@/components/testUi/LiveTemperature";
import TemperatureChart from "@/components/testUi/TemperatureChart";
import LightningTemperatureChart from "@/components/testUi/LightningTemperatureChart";
import ChartJSTemperatureChart from "@/components/testUi/ChartJSTemperatureChart";

export default function EquipmentDetailContent({ id }: { id: string }) {
  const equipment = mockEquipments.find((e) => e.id === id);

  if (!equipment)
    return <div className="p-10 text-center">설비를 찾을 수 없습니다.</div>;

  const idNumber = parseInt(id.split("-")[1], 10);
  let ChartEngine;
  let engineName;

  if (idNumber >= 7) {
    ChartEngine = <LightningTemperatureChart />;
    engineName = "LightningChart (Ultra-Performance)";
  } else if (idNumber >= 4) {
    ChartEngine = <ChartJSTemperatureChart />;
    engineName = "Chart.js (Real-time)";
  } else {
    ChartEngine = <TemperatureChart />;
    engineName = "Recharts (Standard)";
  }

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-auto ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{equipment.name}</h1>
        <span className="text-slate-400 font-mono">{equipment.id}</span>
      </div>

      <LiveTemperature initialTemp={equipment.temperature} />

      <div className="mt-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
            Engine: {engineName}
          </p>
        </div>
        {/* 선택된 차트 엔진 렌더링 */}
        <div className="min-h-[300px]">{ChartEngine}</div>
      </div>

      <div className="grid grid-cols-2 gap-8 border-t pt-6 mt-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">설비 유형</p>
            <p className="text-lg font-medium">{equipment.type}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">현재 상태</p>
            <p
              className={`text-lg font-bold ${equipment.status === "Running" ? "text-green-600" : "text-red-600"}`}
            >
              {equipment.status}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">마지막 점검일</p>
            <p className="text-lg font-medium">{equipment.lastMaintenance}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">누적 가동 시간</p>
            <p className="text-lg font-medium">
              {equipment.operationalHours} 시간
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
