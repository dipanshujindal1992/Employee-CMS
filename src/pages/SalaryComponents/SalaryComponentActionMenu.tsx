import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";
import clsx from "clsx";
import CustomButton from "../../components/common/CustomButton";
import { type SalaryComponentItem } from "./SalaryComponentTable";

interface SalaryComponentActionMenuProps {
  item: SalaryComponentItem;
  isOpen: boolean;
  onToggle: (id: string | number | null) => void;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number, name: string) => void;
  onToggleStatus: (id: string | number) => void;
}

const SalaryComponentActionMenu = memo(({
  item,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onToggleStatus
}: SalaryComponentActionMenuProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.right - 224,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item.id);
    onToggle(null);
  }, [item.id, onEdit, onToggle]);

  const handleToggleStatusClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus(item.id);
    onToggle(null);
  }, [item.id, onToggleStatus, onToggle]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id, item.name);
    onToggle(null);
  }, [item.id, item.name, onDelete, onToggle]);

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(isOpen ? null : item.id);
  }, [isOpen, item.id, onToggle]);

  return (
    <>
      <CustomButton
        ref={buttonRef}
        onClick={handleButtonClick}
        className={clsx(
          "p-2 rounded-full transition-all duration-200",
          isOpen
            ? "bg-blue-50 text-primary shadow-sm ring-2 ring-primary/10"
            : "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
        )}
      >
        <MoreHorizontal className="w-5 h-5" />
      </CustomButton>

      <AnimatePresence>
        {isOpen && menuPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 9999,
            }}
            className="w-56 bg-white rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden py-2"
            onClick={handleMenuClick}
          >
            <div className="px-2 space-y-1">
              <CustomButton
                variant="none"
                onClick={handleEditClick}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-primary transition-all group"
              >
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                  <Pencil className="w-4 h-4" />
                </div>
                Edit
              </CustomButton>

              <CustomButton
                onClick={handleToggleStatusClick}
                variant="none"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-primary transition-all group"
              >
                <div className={clsx(
                  "p-1.5 rounded-md transition-colors",
                  item.status === "Active"
                    ? "bg-amber-50 text-amber-500 group-hover:bg-amber-100"
                    : "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100"
                )}>
                  {item.status === "Active" ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </div>
                Mark as {item.status === "Active" ? "Inactive" : "Active"}
              </CustomButton>

              <div className="h-px bg-slate-100 my-1 mx-2" />

              <CustomButton
                onClick={handleDeleteClick}
                variant="none"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all group"
              >
                <div className="p-1.5 rounded-md bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </div>
                Delete
              </CustomButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default SalaryComponentActionMenu;
