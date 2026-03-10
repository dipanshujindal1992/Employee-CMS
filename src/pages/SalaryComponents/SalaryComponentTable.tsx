
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import {
  CornerDownRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import SalaryComponentActionMenu from "./SalaryComponentActionMenu";
// Define a comprehensive interface for the data items
export interface SalaryComponentItem {
  id: string | number;
  name: string;
  status?: string;
  type?: string;
  calculation?: string;
  epf?: string;
  esi?: string;
  frequency?: string; 
  amount?: string | number;

}

interface SalaryComponentTableProps {
  data: SalaryComponentItem[];
  activeTab: string;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number, name: string) => void;
  onToggleStatus: (id: string | number) => void;
}



const SalaryComponentTable: React.FC<SalaryComponentTableProps> = ({
  data,
  activeTab,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [activeDropdownId, setActiveDropdownId] = useState<string | number | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = () => setActiveDropdownId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleToggleDropdown = useCallback((id: string | number | null) => {
    setActiveDropdownId(id);
  }, []);

  const handleEditItem = useCallback((id: string | number) => {
    onEdit(id);
  }, [onEdit]);

  return (
    <div className="flex-1 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Name</th>
                {activeTab === "Earnings" && (
                  <>
                    <th className="px-6 py-4">Earning Type</th>
                    <th className="px-6 py-4">Calculation Type</th>
                    <th className="px-6 py-4">Consider for EPF</th>
                    <th className="px-6 py-4">Consider for ESI</th>
                  </>
                )}
                {activeTab === "Deductions" && (
                  <>
                    <th className="px-6 py-4">Deduction Type</th>
                    <th className="px-6 py-4">Deduction Frequency</th>
                  </>
                )}
                {activeTab === "Benefits" && (
                  <>
                    <th className="px-6 py-4">Benefit Type</th>
                    <th className="px-6 py-4">Benefit Frequency</th>
                  </>
                )}
                {activeTab === "Reimbursements" && (
                  <>
                    <th className="px-6 py-4">Reimbursement Type</th>
                    <th className="px-6 py-4">
                      Maximum Reimbursable Amount
                    </th>
                  </>
                )}
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/80 group transition-colors"
                >
                  <td
                    className="px-6 py-4"
                    onClick={() => handleEditItem(item.id)}
                  >
                    <span className="font-medium text-primary hover:text-primary-dark cursor-pointer">
                      {item.name}
                    </span>
                  </td>

                  {activeTab === "Earnings" && (
                    <>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.calculation}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span
                            className={clsx(
                              "text-sm font-medium",
                              item.epf?.startsWith("Yes")
                                ? "text-slate-700"
                                : "text-slate-400",
                            )}
                          >
                            {item.epf?.split("(")[0].trim()}
                          </span>
                          {item.epf?.includes("(") && (
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              ({item.epf.split("(")[1]}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={clsx(
                            "text-sm font-medium",
                            item.esi === "Yes"
                              ? "text-slate-700"
                              : "text-slate-400",
                          )}
                        >
                          {item.esi}
                        </span>
                      </td>
                    </>
                  )}

                  {activeTab === "Deductions" && (
                    <>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.frequency}
                      </td>
                    </>
                  )}

                  {activeTab === "Benefits" && (
                    <>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.frequency}
                      </td>
                    </>
                  )}

                  {activeTab === "Reimbursements" && (
                    <>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.amount}
                      </td>
                    </>
                  )}

                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                        item.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200",
                      )}
                    >
                      {item.status === "Active" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SalaryComponentActionMenu 
                      item={item} 
                      isOpen={activeDropdownId === item.id}
                      onToggle={handleToggleDropdown}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={onToggleStatus}
                    />
                  </td>
                </motion.tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <CornerDownRight className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-700">
                        No {activeTab} Found
                      </h3>
                      <p className="text-slate-500 mt-2 text-sm max-w-sm">
                        You haven't added any components to {activeTab} yet.
                        Click "Add Component" to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default React.memo(SalaryComponentTable);

