import { useState } from "react";
import { mockEquipments } from "@/api/mockData";

export default function OperationRate() {
  const [errorIndex, setErrorIndex] = useState(0);
  const total = mockEquipments.length;
  const running = mockEquipments.filter((e) => e.status === "Running").length;

  const errorEquipments = mockEquipments.filter((e) => e.status === "Error");
  const errorCount = errorEquipments.length;
  const rate = Math.round((running / total) * 100);

  const scrollToError = () => {
    if (errorCount > 0) {
      const targetError = errorEquipments[errorIndex % errorCount];
      const element = document.getElementById(targetError.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setErrorIndex((prev) => (prev + 1) % errorCount);
      }
    }
  };

  return (
    <div className="flex items-center gap-6 w-full max-w-[450px]">
      {/* 에러 알림 박스 */}
      <div
        onClick={scrollToError}
        className={`flex flex-col items-center justify-center bg-red-50 border border-red-100 px-4 py-2 rounded-xl min-w-[80px] 
          ${errorCount > 0 ? "cursor-pointer hover:bg-red-100 transition-colors" : ""}`}
      >
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-tight">
          {errorCount > 1 ? "Next Error" : "Errors"}
        </span>
        <span
          className={`text-xl font-black ${errorCount > 0 ? "text-red-600 animate-pulse" : "text-slate-300"}`}
        >
          {errorCount}
        </span>
      </div>

      {/* 가동률 진행 바 */}
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Operation Rate
          </span>
          <span className="text-sm font-black text-blue-600 font-mono">
            {rate}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full transition-all duration-1000 ease-out bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
            style={{ width: `${rate}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-0.5">
          <p className="text-[9px] text-slate-400 font-medium uppercase">
            System Status: {errorCount > 0 ? "Check Required" : "Stable"}
          </p>
          <p className="text-[9px] text-slate-400 font-medium font-mono">
            ACTIVE: <span className="text-slate-600 font-bold">{running}</span>{" "}
            / {total} UNITS
          </p>
        </div>
      </div>
    </div>
  );
}
