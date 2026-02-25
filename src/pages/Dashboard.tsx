import { mockEquipments } from "@/api/mockData";
import EquipmentCard from "@/components/EquipmentCard";
import DashboardSection from "@/components/DashboardSection";
import OperationRate from "@/components/OperationRate";

export default function Home() {
  const getGroup = (start: number, end: number) =>
    mockEquipments.filter((e) => {
      const idNum = parseInt(e.id.split("-")[1]);
      return idNum >= start && idNum <= end;
    });

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Factory <span className="text-blue-600">OS</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            실시간 통합 설비 관제 시스템
          </p>
        </div>

        <OperationRate />
      </header>

      <div className="max-w-7xl mx-auto space-y-10">
        <DashboardSection
          title="Standard Monitoring (Recharts)"
          colorClass="text-slate-400"
          lineClass="bg-slate-200"
        >
          {getGroup(1, 3).map((e) => (
            <EquipmentCard key={e.id} equipment={e} />
          ))}
        </DashboardSection>

        <DashboardSection
          title="Real-time Engine (Chart.js)"
          colorClass="text-blue-500"
          lineClass="bg-blue-100"
        >
          {getGroup(4, 6).map((e) => (
            <EquipmentCard key={e.id} equipment={e} />
          ))}
        </DashboardSection>

        <DashboardSection
          title="Ultra Performance (LightningChart)"
          colorClass="text-emerald-500"
          lineClass="bg-emerald-100"
        >
          {getGroup(7, 9).map((e) => (
            <EquipmentCard key={e.id} equipment={e} />
          ))}
        </DashboardSection>
      </div>
    </div>
  );
}
