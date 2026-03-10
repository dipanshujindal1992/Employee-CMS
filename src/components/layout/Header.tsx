import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Settings, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../../constant/routes";
import type { RootState } from "../../redux/store";
import { logoutRequest } from "../../redux/services/authSlice";

import ProfilePopover from "./ProfilePopover";
import CustomButton from "../common/CustomButton";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const successMessage = useSelector(
    (state: RootState) => state?.auth?.successMessage,
  );
  const errorMessage = useSelector(
    (state: RootState) => state?.auth?.errorMessage,
  );
  const userData = useSelector((state: RootState) => state?.auth?.userData);

  useEffect(() => {
    if (successMessage && isLoading) {
      setIsLoading(false);
      toast.success(successMessage);
      navigate(ROUTES.SIGNIN);
    }
    if (errorMessage && isLoading) {
      setIsLoading(false);
      toast.error(errorMessage);
    }
  }, [navigate, successMessage, isLoading, errorMessage]);

  const handleSignOut = useCallback(() => {
    setIsProfileOpen(false);
    setIsLoading(true);
    dispatch(logoutRequest());
  }, [dispatch]);

  const toggleProfile = useCallback(() => {
    setIsProfileOpen(prev => !prev);
  }, []);

  const closeProfile = useCallback(() => {
    setIsProfileOpen(false);
  }, []);

  const goToSettings = useCallback(() => {
    navigate(ROUTES.SETTINGS);
  }, [navigate]);

  return (
    <header className="h-16 glass fixed top-0 right-0 left-0 lg:left-64 z-40 px-4 lg:px-6 flex items-center justify-between transition-all duration-300">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3 lg:gap-0">
        <CustomButton
          variant="none"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-primary transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </CustomButton>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 md:gap-5 relative">
        <div className="h-6 w-px bg-slate-200/60 mx-1 hidden md:block"></div>

        <div className="flex items-center gap-1 md:gap-2 text-slate-500">

          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(241, 245, 249, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={goToSettings}
            className="p-2 rounded-full transition-colors relative hidden sm:block"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-slate-600" strokeWidth={1.8} />
          </motion.button>



          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={toggleProfile}
            className="ml-2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center font-bold shadow-md hover:shadow-lg transition-all text-sm md:text-base cursor-pointer"
          >
            {userData?.name?.charAt(0).toUpperCase() || "U"}
          </motion.button>
        </div>

        {/* Profile Popover */}
        <ProfilePopover
          isOpen={isProfileOpen}
          onClose={closeProfile}
          onSignOut={handleSignOut}
          userProfile={userData}
        />
      </div>
    </header>
  );
};
export default React.memo(Header);
