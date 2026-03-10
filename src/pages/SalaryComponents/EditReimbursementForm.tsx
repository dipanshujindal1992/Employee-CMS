
import React from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import CustomRadioInput from "../../components/common/CustomRadioInput";
import type { SalaryComponentItem } from "./SalaryComponentTable";

interface EditReimbursementFormProps {
  item: SalaryComponentItem;
  onCancel: () => void;
  onSave: () => void;
}

const EditReimbursementForm: React.FC<EditReimbursementFormProps> = ({ item, onCancel, onSave }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white min-h-screen"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4">
        <h2 className="text-lg font-medium text-slate-800">
          Edit Reimbursement
        </h2>
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
              Reimbursement Type
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
                Include this as a Flexible Benefit Plan component
              </span>
              <span className="text-xs text-slate-400 max-w-lg">
                FBP allows your employees to personalise their salary structure
                by choosing how much they want to receive under each FBP
                component.
              </span>
            </div>
          </label>

          <div className="space-y-3 pt-4">
            <label className="text-sm font-medium text-slate-700">
              How do you want to handle unclaimed reimbursement?
            </label>
            <div className="space-y-2">
              <CustomRadioInput
                name="unclaimedHandle"
                defaultChecked
                className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                label="Carry forward and encash at the end of the fiscal year"
              />
              <CustomRadioInput
                name="unclaimedHandle"
                className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                label="Do not carry forward and encash monthly"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Enter Amount <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center max-w-[200px]">
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg text-slate-400 text-sm">
                ₹
              </div>
              <CustomInput
                defaultValue="0"
                className="rounded-l-none border-r-0"
              />
              <div className="px-3 py-1.5 bg-transparent text-slate-400 text-xs flex flex-col items-center justify-center border-y border-r border-slate-200 rounded-r-lg">
                <span>▲</span>
                <span>▼</span>
              </div>
              <span className="ml-3 text-sm text-slate-500 whitespace-nowrap">
                per month
              </span>
            </div>
          </div>

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
              component with an employee, you will only be able to edit the Name
              in Payslip and Amount. The changes you make to Amount will apply
              only to new employees.
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

export default React.memo(EditReimbursementForm) ;
