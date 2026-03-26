// src/features/factory/pages/EquipmentManagementPage.tsx
import { useState } from "react";
import { ConfirmDialog } from "@/shared/components/modal/ConfirmDialog";
import { Button } from "@/components/ui/button";

export default function EquipmentManagementPage() {
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);

  const handleDeleteFactory = () => {
    // 실제 삭제 API 호출 로직이 들어갈 자리
    console.log("공장 정보 삭제 완료!");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">설비 관리</h1>

      <Button variant="destructive" onClick={() => setIsDelModalOpen(true)}>
        설비 삭제
      </Button>

      {/* 미리 만들어둔 공통 모달 호출 */}
      <ConfirmDialog
        isOpen={isDelModalOpen}
        onOpenChange={setIsDelModalOpen}
        title="설비 정보 삭제 확인"
        description="해당 설비을 삭제하면 연결된 모든 설비 데이터에 접근할 수 없습니다. 정말 삭제하시겠습니까?"
        onConfirm={handleDeleteFactory}
        confirmText="삭제하기"
        variant="success" // 빨간색 버튼으로 강조
      />
    </div>
  );
}
