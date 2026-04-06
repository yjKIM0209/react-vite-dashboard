import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EquipmentDetailContent from "@/components/testUi/EquipmentDetailContent";

export default function EquipmentModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(-1); // 뒤로 가기
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [navigate]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      navigate(-1);
    }
  };

  if (!id) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-20 text-slate-400"
        >
          ✕
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          <EquipmentDetailContent id={id} />
        </div>
      </div>
    </div>
  );
}
