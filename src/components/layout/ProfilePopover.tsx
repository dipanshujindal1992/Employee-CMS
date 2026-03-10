import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Power } from "lucide-react";
import CustomButton from "../common/CustomButton";
import type { User } from "../../redux/services/authSlice";

interface ProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  userProfile: User | null;
}

const ProfilePopover: React.FC<ProfilePopoverProps> = ({
  isOpen,
  onClose,
  onSignOut,
  userProfile,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-transparent"
          />

          {/* Popover */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 -right-2 sm:right-0 w-[calc(100vw-24px)] sm:w-96 max-w-[360px] sm:max-w-sm bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
          >
            {/* Arrow */}
            <div className="absolute top-0 right-6 w-4 h-4 bg-white border-t border-l border-slate-100 transform rotate-45 -translate-y-1/2"></div>

            <div className="p-5">
              <div className="flex justify-start items-start gap-4 mb-4 relative">
                <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center p-2 flex-shrink-0 border border-slate-100">
                  {/* Placeholder for Logo - Using Text for now based on screenshot style */}
                  <div className="text-xs font-bold text-center text-primary leading-tight">
                    {userProfile?.name?.split(" ")[0] || "User profile"}
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-1 ">
                  <h3 className="font-bold text-slate-800 text-lg truncate w-[78%]">
                    {userProfile?.name || "User Name"}
                  </h3>
                  <p className="text-slate-500 text-sm truncate w-[78%]">
                    {userProfile?.email || "user@example.com"}
                  </p>
                </div>
                <CustomButton
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors absolute top-0 right-0"
                  variant="none"
                >
                  <X className="w-5 h-5" />
                </CustomButton>
              </div>

              <div className="text-xs text-slate-500 space-y-1 mb-6">
                <p>
                  User ID:{" "}
                  <span className="text-slate-700 font-medium">
                    {userProfile?._id || "N/A"}
                  </span>
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <CustomButton
                  onClick={onSignOut}
                  className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Power className="w-4 h-4" />
                  Sign Out
                </CustomButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default React.memo(ProfilePopover);
