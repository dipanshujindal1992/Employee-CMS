import React from "react";
import Modal from "./Modal";
import CustomButton from "./CustomButton";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <CustomButton variant="outline" onClick={onClose} disabled={isLoading} className="cursor-pointer">
            {cancelText}
          </CustomButton>
          <CustomButton
            onClick={onConfirm}
            isLoading={isLoading}
            variant={variant === "danger" ? "danger" : "primary"}
            className="cursor-pointer"
          >
            {confirmText}
          </CustomButton>
        </>
      }
    >
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-slate-600">{message}</p>
      </div>
    </Modal>
  );
};

export default React.memo(ConfirmationModal);
