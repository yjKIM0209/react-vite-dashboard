import { Link, useParams } from "react-router-dom";
import EquipmentDetailContent from "@/components/EquipmentDetailContent";

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← 대시보드로 돌아가기
      </Link>

      <div className="shadow-xl rounded-2xl overflow-hidden max-w-2xl mx-auto">
        {id ? (
          <EquipmentDetailContent id={id} />
        ) : (
          <div className="p-10 text-center bg-white rounded-2xl">
            잘못된 설비 ID입니다.
          </div>
        )}
      </div>
    </div>
  );
}
