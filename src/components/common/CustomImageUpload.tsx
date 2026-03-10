import React, { useCallback } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "react-toastify";

interface CustomImageUploadProps {
    logoPreview: string | null;
    onLogoUpload: (file: File) => void;
    onRemoveLogo: () => void;
    label?: string;
    supportedFormats?: string;
    maxSizeMB?: number;
    className?: string;
}

const CustomImageUpload: React.FC<CustomImageUploadProps> = ({
    logoPreview,
    onLogoUpload,
    onRemoveLogo,
    label = "Upload Logo",
    supportedFormats = "image/*",
    maxSizeMB = 1,
    className = "",
}) => {
    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                if (file.size > maxSizeMB * 1024 * 1024) {
                    toast.error(`File size should be less than ${maxSizeMB}MB`);
                    return;
                }
                onLogoUpload(file);
            }
        },
        [onLogoUpload, maxSizeMB]
    );

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div className="relative group">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-blue-500 group-hover:bg-blue-50">
                    {logoPreview ? (
                        <img
                            src={logoPreview}
                            alt="Logo Preview"
                            className="w-full h-full object-contain p-2"
                        />
                    ) : (
                        <>
                            <Upload className="w-6 h-6 text-slate-400 mb-1 group-hover:scale-110 transition-all" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                {label}
                            </span>
                        </>
                    )}
                    <input
                        type="file"
                        accept={supportedFormats}
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                {logoPreview && (
                    <button
                        type="button"
                        onClick={onRemoveLogo}
                        className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-slate-400 hover:text-red-500 hover:shadow-lg transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            <p className="mt-2 text-[11px] text-slate-400 font-medium">
                {supportedFormats.replace("image/*", "PNG, JPG")} up to {maxSizeMB}MB
            </p>
        </div>
    );
};

export default React.memo(CustomImageUpload);
