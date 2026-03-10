import React, { useCallback } from "react";
import CustomInput from "../common/CustomInput";
import CustomSelectbox from "../common/CustomSelectbox";
import CustomSearchableSelect from "../common/CustomSearchableSelect";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import type { EmployeeFormData } from "./Step2SalaryDetails";

interface Option {
  label: string;
  value: string | number;
}

interface Step1Props {
  formData: Partial<EmployeeFormData>;
  errors: Record<string, string>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  departmentOptions: Option[];
  designationOptions: Option[];
  workLocationOptions: Option[];
  genderOptions: Option[];
  handleDesignationChange: (val: string | number) => void;
  handleDepartmentChange: (val: string | number) => void;
  handleOpenDeptModal: () => void;
  handleOpenDesigModal: () => void;
  today?: string;
}

const Step1BasicDetails: React.FC<Step1Props> = ({
  formData,
  errors,
  handleInputChange,
  departmentOptions,
  designationOptions,
  workLocationOptions,
  genderOptions,
  handleDesignationChange,
  handleDepartmentChange,
  handleOpenDeptModal,
  handleOpenDesigModal,
}) => {
  const handlePhoneChange = useCallback(
    (phone: string) => {
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

      handleInputChange({
        target: {
          name: "phone",
          value: formattedPhone,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    },
    [handleInputChange]
  );
  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      {/* Employee Name */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-start">
        <label className="md:col-span-1 text-sm font-semibold text-slate-700 pt-3">
          Employee Name<span className="text-red-500">*</span>
        </label>
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CustomInput
            placeholder="First Name"
            className="bg-slate-50/50"
            value={formData.firstName}
            name="firstName"
            onChange={handleInputChange}
            error={errors.firstName}
            maxLength={30}
          />
          <CustomInput
            placeholder="Middle Name"
            className="bg-slate-50/50"
            value={formData.middleName}
            name="middleName"
            onChange={handleInputChange}
            maxLength={30}
          />
          <CustomInput
            placeholder="Last Name"
            className="bg-slate-50/50"
            value={formData.lastName}
            name="lastName"
            onChange={handleInputChange}
            maxLength={30}
          />
        </div>
      </div>

      <div className="h-px bg-slate-100 my-2"></div>

      {/* Employee ID & DOJ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8">
        <CustomInput
          label="Employee ID"
          requiredIndicator
          placeholder="e.g. EMP-024"
          value={formData.employeeId}
          name="employeeId"
          onChange={handleInputChange}
          error={errors.employeeId}
          maxLength={10}
        />
        <CustomInput
          label="Date of Joining"
          requiredIndicator
          placeholder="Select Date"
          type="date"
          value={formData.dateofJoining}
          name="dateofJoining"
          onChange={handleInputChange}
          error={errors.dateofJoining}
        />
      </div>

      {/* Email & Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8">
        <CustomInput
          label="Work Email"
          requiredIndicator
          placeholder="first.last@company.com"
          type="workEmail"
          value={formData.workEmail}
          name="workEmail"
          onChange={handleInputChange}
          error={errors.workEmail}
          maxLength={60}
        />
        <div className="flex flex-col group w-full">
          <label className="text-sm font-semibold text-slate-600 mb-1.5 cursor-pointer group-focus-within:text-primary transition-colors">
            Mobile Number<span className="text-red-500 ml-0.5">*</span>
          </label>

          <PhoneInput
            country={"in"}
            value={formData.phone || ""}
            onChange={handlePhoneChange}
            inputClass={`!w-full !py-2.5 !pr-4 !pl-[48px] !bg-white !border !rounded-xl !text-sm !transition-all !shadow-sm focus:!outline-none focus:!ring-4 ${errors.phone
                ? "!border-red-300 focus:!border-red-500 focus:!ring-red-100"
                : "!border-slate-200 focus:!border-primary/50 focus:!ring-primary/10 hover:!border-slate-300"
              }`}
            buttonClass={`!border-none !bg-transparent !rounded-l-xl ${errors.phone ? "!border-red-300" : "!border-slate-200"
              }`}
            containerClass="!w-full"
            enableSearch={true}
            searchPlaceholder="Search country"
          />

          {errors.phone && (
            <span className="text-xs text-red-500 mt-1.5 font-medium">{errors.phone}</span>
          )}
        </div>
      </div>

      {/* Director Checkbox */}
      <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 flex gap-3 items-start">
        <CustomInput
          type="checkbox"
          id="director"
          className="mt-1 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
        />
        <label htmlFor="director" className="text-sm text-slate-700">
          <span className="font-semibold text-slate-800 block mb-1">
            Director / Substantial Interest
          </span>
          Check this if the employee is a director or person with substantial
          interest in the company.
        </label>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8">
        <div className="space-y-1">
          <CustomSelectbox
            label="Gender"
            name="gender"
            requiredIndicator
            options={genderOptions}
            value={formData.gender}
            onChange={handleInputChange}
          />
          {errors.gender && (
            <span className="text-xs text-red-500 font-medium">
              {errors.gender}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <CustomSelectbox
            label="Work Location"
            requiredIndicator
            options={workLocationOptions}
            value={formData.locationId}
            name="locationId"
            onChange={handleInputChange}
          />
          {errors.locationId && (
            <span className="text-xs text-red-500 font-medium">
              {errors.locationId}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <CustomSearchableSelect
            label="Designation"
            placeholder="Select Designation"
            options={designationOptions}
            value={formData.designationId || ""}
            onChange={handleDesignationChange}
            requiredIndicator
            error={errors.designationId}
            onAddNew={handleOpenDesigModal}
            addNewLabel="Add New Designation"
          />
        </div>

        <div className="space-y-1">
          <CustomSearchableSelect
            label="Department"
            placeholder="Select Department"
            options={departmentOptions}
            value={formData.departmentId || ""}
            onChange={handleDepartmentChange}
            requiredIndicator
            error={errors.departmentId}
            onAddNew={handleOpenDeptModal}
            addNewLabel="Add New Department"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Step1BasicDetails);
