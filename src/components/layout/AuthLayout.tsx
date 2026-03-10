import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { ROUTES } from '../../constant/routes';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isSignup = location.pathname === ROUTES.SIGNUP || location.pathname === ROUTES.INITIAL_ORGANISATION || location.pathname === ROUTES.VERIFY_OTP;

    if (isSignup) {
        return (
            <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-6xl"
                >
                    {children}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass p-8 rounded-2xl shadow-xl">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
export default React.memo(AuthLayout);
