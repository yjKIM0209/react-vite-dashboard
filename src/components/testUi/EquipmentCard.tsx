import { Link, useLocation } from "react-router-dom";
import type { Equipment } from "@/types/equipment";

interface EquipmentCardProps {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  const location = useLocation();
  const isHighTemp = equipment.temperature > 40;

  return (
    <div
      id={equipment.id}
      className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {equipment.type}
            </p>
            <h2 className="text-xl font-bold text-slate-900">
              {equipment.name}
            </h2>
            <p className="text-sm text-slate-400 font-mono">{equipment.id}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold ${
              equipment.status === "Running"
                ? "bg-green-100 text-green-700"
                : equipment.status === "Error"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            ● {equipment.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">현재 온도</span>
            <span
              className={`font-semibold ${isHighTemp ? "text-red-500 animate-pulse" : "text-slate-700"}`}
            >
              {equipment.temperature}°C
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">전력 사용량</span>
            <span className="font-semibold text-slate-700">
              {equipment.powerUsage} kW
            </span>
          </div>
        </div>
      </div>

      <Link
        to={`/equipment/${equipment.id}`}
        state={{ backgroundLocation: location }}
      >
        <button className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          상세 데이터 보기
        </button>
      </Link>
    </div>
  );
}
