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
import EquipmentModal from "@/components/testUi/EquipmentModal";
import EquipmentHistory from "@/pages/EquipmentHistory";
import ComparisonHistory from "@/pages/ComparisonHistory";
import InfiniteHistoryGrid from "@/components/testUi/InfiniteHistoryGrid";
import EquipmentApiTest from "@/pages/EquipmentApiTestPage";
import FactoryManagementPage from "./pages/mdm/FactoryManagementPage";
import EquipmentManagementPage from "./pages/mdm/EquipmentManagementPage";
import AreaManagementPage from "./pages/mdm/AreaManagementPage";
import SampleManagementPage from "./pages/mdm/SampleManagementPage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/layout/components/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomTabBar } from "./shared/components/layout/BottomTabBar";
import { useTabStore } from "./shared/store/useTabStore";
import { useEffect } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { backgroundLocation?: Location } | null;
  const background = state?.backgroundLocation;
  const { activeTabId, setActiveTab, tabs, addTab } = useTabStore();

  useEffect(() => {
    const currentPath = location.pathname;
    const existingTab = tabs.find((t) => t.id === currentPath);

    if (!existingTab) {
      const pageTitle =
        currentPath === "/"
          ? "Dashboard"
          : currentPath.split("/").pop()?.toUpperCase() || "Page";

      addTab({ id: currentPath, title: pageTitle });
    } else {
      setActiveTab(currentPath);
    }
  }, []); 

  useEffect(() => {
    if (location.pathname !== activeTabId) {
      setActiveTab(location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (activeTabId && location.pathname !== activeTabId) {
      navigate(activeTabId);
    }
  }, [activeTabId]);

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
                  path="/area-master"
                  element={<AreaManagementPage />}
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
                <Route path="/sample-master" element={<SampleManagementPage />} />
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
        <Toaster richColors position="top-center" />
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
