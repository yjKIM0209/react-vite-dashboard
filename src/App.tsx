import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  type Location,
} from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import EquipmentDetail from "@/pages/EquipmentDetail";
import EquipmentModal from "@/components/EquipmentModal";
import EquipmentHistory from "@/pages/EquipmentHistory";
import ComparisonHistory from "@/pages/ComparisonHistory";
import Sidebar from "@/components/Sidebar";

function AppContent() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const background = state?.backgroundLocation;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative">
        <Routes location={background || location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipment-history" element={<EquipmentHistory />} />
          <Route path="/comparison-history" element={<ComparisonHistory />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
        </Routes>

        {background && (
          <Routes>
            <Route path="/equipment/:id" element={<EquipmentModal />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
