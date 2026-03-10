import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, Search, Plus, X, Check } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSearchableSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  requiredIndicator?: boolean;
  onAddNew?: () => void;
  addNewLabel?: string;
  className?: string;
  disabled?: boolean;
  hideSearch?: boolean;
  hideClear?: boolean;
  name?: string;
}

const CustomSearchableSelect: React.FC<CustomSearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
  requiredIndicator,
  onAddNew,
  addNewLabel = "Add New",
  className,
  disabled = false,
  hideSearch = false,
  hideClear = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = useMemo(() =>
    options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ), [options, searchTerm]);

  const selectedOption = useMemo(() =>
    options.find((option) => option.value === value), [options, value]);

  const handleSelect = useCallback((optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  }, [onChange]);

  const toggleDropdown = useCallback(() => {
    if (!disabled) setIsOpen(prev => !prev);
  }, [disabled]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSearchClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleAddNewClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    if (onAddNew) onAddNew();
  }, [onAddNew]);

  return (
    <div
      className={clsx("flex flex-col relative", className)}
      ref={containerRef}
    >
      {label && (
        <label className="text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {requiredIndicator && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger */}
      <div
        className={clsx(
          "relative flex items-center justify-between w-full px-3 py-2 bg-white border rounded-md text-sm transition-all shadow-sm cursor-pointer",
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-slate-300 focus:border-primary focus:ring-primary",
          disabled ? "bg-slate-100 cursor-not-allowed text-slate-500" : "hover:border-slate-400"
        )}
        onClick={toggleDropdown}
      >
        <span
          className={clsx(
            "truncate pr-6",
            !selectedOption && "text-slate-400"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center gap-1">
          {selectedOption && !disabled && !hideClear && (
            <div
              role="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </div>
          )}
          <ChevronDown
            className={clsx(
              "w-4 h-4 text-slate-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.1 }}
            className="absolute z-50 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 overflow-hidden top-full left-0 flex flex-col max-h-60"
          >
            {/* Search Input - Sticky Top */}
            {!hideSearch && (
              <div className="p-2 border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-slate-400"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={handleSearchClick}
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Options List - Scrollable */}
            <div className="overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value}
                      className={clsx(
                        "px-3 py-2 text-sm cursor-pointer flex items-center justify-between",
                        isSelected
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      {option.label}
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-sm text-slate-400">
                  No options found
                </div>
              )}
            </div>

            {/* Add New Button - Sticky Bottom */}
            {onAddNew && (
              <div
                className="p-2 border-t border-slate-100 bg-slate-50 relative z-10 cursor-pointer hover:bg-blue-50 transition-colors"
                onMouseDown={handleAddNewClick}
              >
                <div className="flex items-center justify-center gap-2 text-blue-600 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  {addNewLabel}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(CustomSearchableSelect);
