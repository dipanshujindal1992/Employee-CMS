import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constant/routes";
import {
    LayoutDashboard,
    Users,
    PlayCircle,
    Settings,
    ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import CustomButton from "../common/CustomButton";

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { name: "Employees", icon: Users, path: ROUTES.EMPLOYEES },
    { name: 'Pay Runs', icon: PlayCircle, path: ROUTES.PAY_RUNS },
    { name: "Settings", icon: Settings, path: ROUTES.SETTINGS },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {


const handleNavClick = useCallback(() => {
  if (window.innerWidth < 1024) {
    onClose();
  }
}, [onClose]);
    return (
        <aside
            className={clsx(
                "w-64 glass-dark text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full",
            )}
        >
            {/* Header / Logo Area */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700/30">
                <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Trydigital Payroll
                    </span>
                </div>
                {/* Mobile Close Button */}
                <CustomButton
                    onClick={onClose}
                    className="lg:hidden p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                </CustomButton>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                <ul className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                onClick={() => handleNavClick()}
                            >
                                {({ isActive }) => (
                                    <div className="relative overflow-hidden rounded-lg group">
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary"
                                                initial={false}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                        <span
                                            className={clsx(
                                                "relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "text-white"
                                                    : "text-slate-400 group-hover:text-slate-100 group-hover:bg-white/5",
                                            )}
                                        >
                                            <item.icon
                                                className={clsx(
                                                    "w-5 h-5 transition-colors",
                                                    isActive
                                                        ? "text-secondary"
                                                        : "group-hover:text-white",
                                                )}
                                            />
                                            {item.name}
                                        </span>
                                    </div>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer / Support */}
            <div className="p-4 border-t border-slate-700/30 bg-slate-900/40">
                <CustomButton className="text-xs font-semibold text-slate-400 hover:text-white transition-colors w-full text-center uppercase tracking-wider">
                    Contact Support
                </CustomButton>
            </div>
        </aside>
    );
};
export default React.memo(Sidebar);
