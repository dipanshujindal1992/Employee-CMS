import React, { useRef, useState } from "react";

interface CustomFileInputProps {
  label?: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  preview?: boolean;
  className?: string;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({
  label = "Upload Image",
  onFileSelect,
  accept = "image/png, image/jpeg",
  preview = true,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    // Validation
    if (!file.type.includes("image")) {
      setError("Only image files are allowed.");
      return;
    }

    setError("");
    setSelectedFile(file);
    onFileSelect(file);

    if (preview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleClick}
        className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition"
      >
        {preview && previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="h-24 w-24 object-cover rounded"
          />
        ) : (
          <span className="text-gray-500">{label}</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
      />

      {selectedFile && (
        <p className="mt-2 text-sm text-gray-600">{selectedFile.name}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default React.memo(CustomFileInput);