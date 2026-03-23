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
import InfiniteHistoryGrid from "@/components/InfiniteHistoryGrid";
import EquipmentApiTest from "@/pages/EquipmentApiTestPage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/layout/components/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const background = state?.backgroundLocation;

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-slate-100 overflow-hidden">
          <AppSidebar />

          <main className="flex-1 flex flex-col h-full overflow-hidden relative">
            <section className="flex-1 overflow-auto w-full h-full relative">
              <Routes location={background || location}>
                <Route path="/" element={<Dashboard />} />
                <Route
                  path="/equipment-history"
                  element={<EquipmentHistory />}
                />
                <Route
                  path="/comparison-history"
                  element={<ComparisonHistory />}
                />
                <Route path="/equipment/:id" element={<EquipmentDetail />} />
                <Route
                  path="/history-infinite"
                  element={<InfiniteHistoryGrid />}
                />
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
    </TooltipProvider>
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
