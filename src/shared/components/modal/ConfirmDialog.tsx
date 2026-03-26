// src/shared/components/ConfirmDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 옵션 설정 주석 참고
interface ConfirmDialogProps {
  isOpen: boolean; // 모달 열림 상태
  onOpenChange: (open: boolean) => void; // 상태 변경 함수
  title: string; // 제목
  description: string; // 설명 문구
  onConfirm: () => void; // [확인] 클릭 시 실행할 함수
  confirmText?: string; // 확인 버튼 텍스트 (기본값: 확인)
  variant?: "default" | "destructive" | "success" | "delete"; // 버튼 색상
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "확인",
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-425px">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="py-2 text-slate-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button className="mr-2" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onOpenChange(false); // 실행 후 닫기
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
