import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  type Location,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/pages/Dashboard";
import EquipmentDetail from "@/pages/EquipmentDetail";
import EquipmentModal from "@/components/EquipmentModal";
import EquipmentHistory from "@/pages/EquipmentHistory";
import ComparisonHistory from "@/pages/ComparisonHistory";
import InfiniteHistoryGrid from "@/components/InfiniteHistoryGrid";
import EquipmentApiTest from "@/pages/EquipmentApiTestPage";
import FactoryManagementPage from "./pages/mdm/FactoryManagementPage";
import EquipmentManagementPage from "./pages/mdm/EquipmentManagementPage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/layout/components/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomTabBar } from "./shared/components/layout/BottomTabBar";
import { useTabStore } from "./shared/store/useTabStore";
import { useEffect } from "react";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const background = state?.backgroundLocation;
  const { activeTabId, setActiveTab, tabs, addTab } = useTabStore();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    const existingTab = tabs.find((t) => t.id === currentPath);

    if (!existingTab) {
      const pageTitle =
        currentPath === "/"
          ? "Dashboard"
          : currentPath.split("/").pop()?.toUpperCase() || "Page";

      addTab({ id: currentPath, title: pageTitle });
    } else if (currentPath !== activeTabId) {
      setActiveTab(currentPath);
    }
  }, [location.pathname, tabs, activeTabId, addTab, setActiveTab]);

  useEffect(() => {
    if (activeTabId && location.pathname !== activeTabId) {
      navigate(activeTabId);
    }
  }, [activeTabId, navigate, location.pathname]);

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
                  path="/factory-master"
                  element={<FactoryManagementPage />}
                />
                <Route
                  path="/equipment-master"
                  element={<EquipmentManagementPage />}
                />
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

            <BottomTabBar />
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
