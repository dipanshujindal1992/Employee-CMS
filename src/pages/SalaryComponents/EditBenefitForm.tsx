import React from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import type { SalaryComponentItem } from "./SalaryComponentTable";

interface EditBenefitFormProps {
  item: SalaryComponentItem;
  onCancel: () => void;
  onSave: () => void;
}

const EditBenefitForm: React.FC<EditBenefitFormProps> = ({
  item,
  onCancel,
  onSave,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white min-h-screen"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4">
        <h2 className="text-lg font-medium text-slate-800">Edit Benefit</h2>
        <div className="flex items-center gap-4">
          <CustomButton className="flex items-center gap-1.5 text-xs font-medium text-orange-400 hover:text-orange-500">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              💡
            </motion.span>
            Page Tips
          </CustomButton>
          <CustomButton
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <XCircle className="w-5 h-5 text-slate-400" />
          </CustomButton>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Benefit Plan
            </label>
            <CustomInput
              disabled
              value={item.type}
              className="max-w-md bg-slate-50 border-slate-200 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Associate this benefit with
            </label>
            <CustomInput
              disabled
              value={item.type}
              className="max-w-md bg-slate-50 border-slate-200 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Name in Payslip <span className="text-red-500">*</span>
            </label>
            <CustomInput
              defaultValue={item.name}
              className="max-w-md focus:ring-primary/20 border-slate-200"
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer group pt-2">
            <CustomInput
              type="checkbox"
              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
            />
            <div className="flex flex-col">
              <span className="text-sm text-slate-700 font-medium">
                Calculate on pro-rata basis
              </span>
              <span className="text-xs text-slate-400">
                Pay will be adjusted based on employee working days.
              </span>
            </div>
          </label>

          <div className="border-t border-slate-100 pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <CustomInput
                type="checkbox"
                defaultChecked={item.status === "Active"}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
              />
              <span className="text-sm text-slate-700 font-medium">
                Mark this as Active
              </span>
            </label>
          </div>

          <div className="p-4 bg-orange-50/50 border border-orange-100/50 rounded-lg">
            <p className="text-xs text-orange-800 leading-relaxed">
              <span className="font-bold">Note:</span> Once you associate this
              benefits with an employee, you will only be able to edit the Name
              in Payslip. The change will be reflected in both new and existing
              employees.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <CustomButton onClick={onSave} variant="primary" className="px-6">
              Save
            </CustomButton>
            <CustomButton
              onClick={onCancel}
              variant="ghost"
              className="px-6 border border-slate-200"
            >
              Cancel
            </CustomButton>
          </div>

          <p className="text-[11px] text-red-500">
            * indicates mandatory fields
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(EditBenefitForm);
