import React from "react";
import CustomInput from "../common/CustomInput";
import CustomRadioInput from "../common/CustomRadioInput";
import { Zap, Landmark, Scroll, Banknote, Check } from "lucide-react";
import clsx from "clsx";

import type { EmployeeFormData } from "./Step2SalaryDetails";

interface Step4Props {
  formData: Partial<EmployeeFormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const Step4PaymentInfo: React.FC<Step4Props> = ({
  formData,
  handleInputChange,
  handleChange,
  errors,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      <div className="flex flex-col gap-1 mb-6">
        <label className="text-lg font-semibold text-slate-800">
          How would you like to pay this employee?
          <span className="text-red-500">*</span>
        </label>
      </div>

      <div className="space-y-4">
        {/* Direct Deposit */}
        <div
          className={clsx(
            "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
            formData.paymentMethod === "direct_deposit"
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-slate-200 hover:border-primary/50 bg-white"
          )}
          onClick={() => handleChange("paymentMethod", "direct_deposit")}
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-800">
              Direct Deposit (Automated Process)
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Initiate payment in Zoho Payroll once the pay run is approved
            </div>
          </div>
          {formData.paymentMethod === "direct_deposit" ? (
            <div className="text-sm font-medium text-primary">
              Expected Config
            </div>
          ) : (
            <div className="text-sm font-medium text-primary hover:underline">
              Configure Now
            </div>
          )}
        </div>

        {/* Bank Transfer */}
        <div
          className={clsx(
            "rounded-xl border transition-all overflow-hidden",
            formData.paymentMethod === "bank_transfer"
              ? "border-primary bg-white ring-1 ring-primary"
              : "border-slate-200 hover:border-primary/50 bg-white"
          )}
        >
          <div
            className={clsx(
              "flex items-center gap-4 p-4 cursor-pointer",
              formData.paymentMethod === "bank_transfer" &&
              "bg-primary/5 border-b border-primary/10"
            )}
            onClick={() => handleChange("paymentMethod", "bank_transfer")}
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-800">
                Bank Transfer (Manual Process)
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Download Bank Advice and process the payment through your bank's
                website
              </div>
            </div>
            <div
              className={clsx(
                "w-6 h-6 rounded-full border flex items-center justify-center",
                formData.paymentMethod === "bank_transfer"
                  ? "bg-primary border-primary text-white"
                  : "border-slate-300 bg-white"
              )}
            >
              {formData.paymentMethod === "bank_transfer" && (
                <Check className="w-3.5 h-3.5" />
              )}
            </div>
          </div>

          {formData.paymentMethod === "bank_transfer" && (
            <div className="p-6 grid grid-cols-1 gap-6 animate-in slide-in-from-top-2 duration-300">
              <CustomInput
                label="Account Holder Name"
                requiredIndicator
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleInputChange}
                error={errors.accountHolderName}
                placeholder="e.g. John Doe"
                maxLength={30}
              />
              <CustomInput
                label="Bank Name"
                requiredIndicator
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                error={errors.bankName}
                placeholder="e.g. HDFC Bank"
                maxLength={30}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  label="Account Number"
                  requiredIndicator
                  name="accountNumber"
                  type="password"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  error={errors.accountNumber}
                  placeholder="Enter Account Number"
                  maxLength={18}
                />
                <CustomInput
                  label="Re-enter Account Number"
                  requiredIndicator
                  name="reAccountNumber"
                  value={formData.reAccountNumber}
                  onChange={handleInputChange}
                  error={errors.reAccountNumber}
                  placeholder="Re-enter Account Number"
                  maxLength={18}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  label="IFSC"
                  requiredIndicator
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  error={errors.ifscCode}
                  placeholder="IFSC Code"
                  className="uppercase"
                  maxLength={11}
                />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Account Type
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <CustomRadioInput
                        type="radio"
                        name="accountType"
                        value="current"
                        checked={formData.accountType === "current"}
                        onChange={(e) =>
                          handleChange("accountType", e.target.value)
                        }
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                      />
                      <span className="text-sm text-slate-700">Current</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <CustomRadioInput
                        type="radio"
                        name="accountType"
                        value="savings"
                        checked={formData.accountType === "savings"}
                        onChange={(e) =>
                          handleChange("accountType", e.target.value)
                        }
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                      />
                      <span className="text-sm text-slate-700">Savings</span>
                    </label>
                  </div>
                  {errors.accountType && (
                    <span className="text-xs text-red-500 font-medium">
                      {errors.accountType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cheque */}
        <div
          className={clsx(
            "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
            formData.paymentMethod === "cheque"
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-slate-200 hover:border-primary/50 bg-white"
          )}
          onClick={() => handleChange("paymentMethod", "cheque")}
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Scroll className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-800">Cheque</div>
          </div>
          <div
            className={clsx(
              "w-6 h-6 rounded-full border flex items-center justify-center",
              formData.paymentMethod === "cheque"
                ? "bg-primary border-primary text-white"
                : "border-slate-300 bg-white"
            )}
          >
            {formData.paymentMethod === "cheque" && (
              <Check className="w-3.5 h-3.5" />
            )}
          </div>
        </div>

        {/* Cash */}
        <div
          className={clsx(
            "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
            formData.paymentMethod === "cash"
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-slate-200 hover:border-primary/50 bg-white"
          )}
          onClick={() => handleChange("paymentMethod", "cash")}
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Banknote className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-800">Cash</div>
          </div>
          <div
            className={clsx(
              "w-6 h-6 rounded-full border flex items-center justify-center",
              formData.paymentMethod === "cash"
                ? "bg-primary border-primary text-white"
                : "border-slate-300 bg-white"
            )}
          >
            {formData.paymentMethod === "cash" && (
              <Check className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Step4PaymentInfo);
