import { useState, useMemo, useCallback } from "react";
import EquipmentTree from "@/components/testUi/EquipmentTree";
import TanStackHistoryGrid from "@/components/testUi/TanStackHistoryGrid";
import type { HistoryData } from "@/types";
import { useEquipmentStore } from "@/store/useEquipmentStore";

type PeriodType = "today" | "week" | "month" | "custom";

// 초기 데이터 생성 로직
const generateInitialData = (): HistoryData[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return Array.from({ length: 50 }).map((_, i) => {
    const startTime = `${year}-${month}-${day} 10:00`;
    const endTime = `${year}-${month}-${day} 11:00`;

    return {
      no: i + 1,
      status: i % 5 === 0 ? "점검" : "정상",
      process: ["믹싱", "충진", "포장", "검사"][i % 4],
      factory: "창원공장",
      area: "A-Line",
      eqpId: `EQP-${1001 + i}`,
      eqpName: `설비-${1001 + i}`,
      startTime: startTime,
      endTime: endTime,
      repairCost: Math.floor(Math.random() * 5000) + 500,
      duration: "01:00",
      memo: "",
    };
  });
};

export default function ComparisonHistory() {
  const [rowData, setRowData] = useState<HistoryData[]>(generateInitialData());
  const [selectedEqpIds, setSelectedEqpIds] = useState<string[]>([]);
  const [displayEqpIds, setDisplayEqpIds] = useState<string[]>([]);
  const searchText = useEquipmentStore((state) => state.searchText);
  const setSearchText = useEquipmentStore((state) => state.setSearchText);

  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const [periodType, setPeriodType] = useState<PeriodType>("month");
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0);
    return formatDate(firstDay);
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59);
    return formatDate(lastDay);
  });

  const filteredData = useMemo(() => {
    return rowData.filter((item) => {
      const matchesEqp =
        displayEqpIds.length === 0 || displayEqpIds.includes(item.eqpId);
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const itemTime = new Date(item.startTime.replace(/-/g, "/")).getTime();
      return matchesEqp && itemTime >= start && itemTime <= end;
    });
  }, [rowData, displayEqpIds, startDate, endDate]);

  const handleUpdateRow = useCallback(
    (index: number, field: keyof HistoryData, value: string | number) => {
      const targetItem = filteredData[index];
      if (!targetItem) return;

      setRowData((prev) => {
        const actualIndex = prev.findIndex((item) => item.no === targetItem.no);
        if (actualIndex === -1) return prev;

        const newData = [...prev];
        newData[actualIndex] = {
          ...newData[actualIndex],
          [field]: value,
        };
        return newData;
      });
    },
    [filteredData],
  );

  // 신규 행 추가 핸들러
  const handleAddRow = () => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16).replace("T", " ");

    const newRow: HistoryData = {
      no: rowData.length > 0 ? Math.max(...rowData.map((r) => r.no)) + 1 : 1,
      status: "신규",
      process: "신규공정",
      factory: "창원공장",
      area: "A-Line",
      eqpId: `EQP-NEW-${Date.now().toString().slice(-4)}`,
      eqpName: "새 설비",
      startTime: formattedDate,
      endTime: "",
      repairCost: 0,
      duration: "00:00",
      memo: "신규 추가됨",
    };

    setRowData((prev) => [newRow, ...prev]);
  };

  const handlePeriodChange = (type: PeriodType) => {
    setPeriodType(type);
    if (type === "custom") return;
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (type === "today") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (type === "week") {
      const day = now.getDay();
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(now.getFullYear(), now.getMonth(), diffToMonday);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (type === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    }
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  const handleSearch = () => setDisplayEqpIds(selectedEqpIds);

  return (
    <div className="flex h-full flex-col p-4 bg-slate-50 gap-4 overflow-hidden text-slate-900">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            설비 상태 이력 조회 (TanStack Table)
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="그리드 내 결과 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-72 pl-4 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        <section className="w-80 border border-slate-200 bg-white flex flex-col p-4 rounded-lg shadow-sm gap-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 pl-2">
            검색 조건
          </h2>

          <div className="flex-1 overflow-auto bg-slate-50 border border-slate-200 rounded p-2">
            <EquipmentTree onSelectionChange={setSelectedEqpIds} />
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
            <label className="text-xs font-semibold text-slate-500">
              기간 유형
            </label>
            <select
              value={periodType}
              onChange={(e) => handlePeriodChange(e.target.value as PeriodType)}
              className="border border-slate-300 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="today">금일</option>
              <option value="week">금주</option>
              <option value="month">금월</option>
              <option value="custom">사용자 정의</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500">
              조회 기간
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPeriodType("custom");
              }}
              className="border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPeriodType("custom");
              }}
              className="border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-[#10b981] text-white py-2.5 rounded-md font-bold hover:bg-[#059669] transition-all shadow-md active:scale-[0.98]"
          >
            조회
          </button>
        </section>

        {/* 그리드 섹션 */}
        <section className="flex-1 border border-slate-200 bg-white flex flex-col rounded-lg shadow-sm overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <TanStackHistoryGrid
              data={filteredData}
              onAddRow={handleAddRow}
              onUpdateRow={handleUpdateRow}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
