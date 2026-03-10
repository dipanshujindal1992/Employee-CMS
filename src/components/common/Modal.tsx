import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import CustomButton from './CustomButton';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    overflowVisible?: boolean;
}

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
};

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    overflowVisible = false
}) => {

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={clsx(
                            "relative w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]",
                            overflowVisible ? "overflow-visible" : "overflow-hidden",
                            sizeClasses[size]
                        )}
                    >
                        {/* Header */}
                        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                            <h3 className="text-lg font-bold text-slate-800 leading-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                {title}
                            </h3>
                            <CustomButton
                                onClick={onClose}
                                variant="none"
                                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all focus:outline-none"
                            >
                                <X className="w-5 h-5" />
                            </CustomButton>
                        </div>

                        {/* Body */}
                        <div className={clsx("px-4 sm:px-8 py-4 sm:py-6 w-full", overflowVisible ? "overflow-visible" : "overflow-y-auto overflow-x-hidden")}>
                            {children}
                        </div>

                        {/* Footer */}
                        <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0 w-full overflow-x-auto">
                            {footer ? footer : (
                                <>
                                    <CustomButton variant="outline" onClick={onClose}>Cancel</CustomButton>
                                    <CustomButton >Save Changes</CustomButton>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
export default React.memo(Modal);
