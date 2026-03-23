import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  type Location,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/pages/Dashboard";
import EquipmentDetail from "@/pages/EquipmentDetail";
import EquipmentModal from "@/components/EquipmentModal";
import EquipmentHistory from "@/pages/EquipmentHistory";
import ComparisonHistory from "@/pages/ComparisonHistory";
import Sidebar from "@/components/Sidebar";
import InfiniteHistoryGrid from "@/components/InfiniteHistoryGrid";
import EquipmentApiTest from "@/pages/EquipmentApiTestPage";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/layout/components/AppSidebar";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const background = state?.backgroundLocation;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-100 overflow-hidden">
        {/* 리팩토링된 사이드바 적용 */}
        <AppSidebar />
        
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* 상단 툴바 (사이드바 트리거 포함) */}
          <header className="h-14 border-b bg-white flex items-center px-4 shrink-0">
            <SidebarTrigger className="hover:bg-slate-100" />
            <div className="ml-4 h-4 w-[1px] bg-slate-200" />
            <span className="ml-4 text-sm font-medium text-slate-600">
              {/* 여기에 현재 페이지 제목 등을 동적으로 뿌려주면 좋습니다 */}
              Operation Control Center
            </span>
          </header>

          {/* 실제 컨텐츠 영역 */}
          <section className="flex-1 overflow-y-auto p-6">
            <Routes location={background || location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/equipment-history" element={<EquipmentHistory />} />
              <Route path="/comparison-history" element={<ComparisonHistory />} />
              <Route path="/equipment/:id" element={<EquipmentDetail />} />
              <Route path="/history-infinite" element={<InfiniteHistoryGrid />} />
              <Route path="/api-test" element={<EquipmentApiTest />} />
            </Routes>

            {background && (
              <Routes>
                <Route path="/equipment/:id" element={<EquipmentModal />} />
              </Routes>
            )}
          </section>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
