import React, { useCallback, useMemo } from "react";
import CustomInput from "../common/CustomInput";
import CustomSearchableSelect from "../common/CustomSearchableSelect";
import { Country, State, City } from "country-state-city";

import type { EmployeeFormData } from "./Step2SalaryDetails";
import "react-phone-input-2/lib/style.css";
interface Step3Props {
  formData: Partial<EmployeeFormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  today?: string;
}

const Step3PersonalDetails: React.FC<Step3Props> = ({
  formData,
  handleInputChange,
  errors,
  today,
}) => {
  const handleSelectChange = useCallback((name: string, value: string) => {
    handleInputChange({
      target: { name, value, type: "text" }
    } as unknown as React.ChangeEvent<HTMLInputElement>);

    if (name === "country" && formData?.country !== value) {
      handleInputChange({ target: { name: "state", value: "", type: "text" } } as unknown as React.ChangeEvent<HTMLInputElement>);
      handleInputChange({ target: { name: "city", value: "", type: "text" } } as unknown as React.ChangeEvent<HTMLInputElement>);
    } else if (name === "state" && formData?.state !== value) {
      handleInputChange({ target: { name: "city", value: "", type: "text" } } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  }, [handleInputChange, formData?.country, formData?.state]);

  const countryOptions = useMemo(() =>
    Country.getAllCountries()?.map(c => ({ label: c?.name, value: c?.name })),
    []);

  const { stateOptions, cityOptions } = useMemo(() => {
    if (!formData?.country) return { stateOptions: [], cityOptions: [] };

    const selectedCountry = Country.getAllCountries().find(c => c.name === formData.country);
    const countryIso = selectedCountry?.isoCode || '';

    const states = State.getStatesOfCountry(countryIso)?.map(s => ({ label: s?.name, value: s?.name }));

    let cities: { label: string; value: string }[] = [];
    if (formData.state) {
      const selectedState = State.getStatesOfCountry(countryIso).find(s => s.name === formData.state);
      const stateIso = selectedState?.isoCode || '';
      cities = City.getCitiesOfState(countryIso, stateIso)?.map(c => ({ label: c?.name, value: c?.name }));
    }

    return { stateOptions: states, cityOptions: cities };
  }, [formData?.country, formData?.state]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <h3 className="text-slate-700 font-medium mb-2">Personal Details</h3>
        <p className="text-slate-500 text-sm">
          Enter the personal information of the employee.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <CustomInput
          name="email"
          label="Personal Email Address"
          placeholder="personal@gmail.com"
          type="email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          maxLength={60}
        />

        <CustomInput
          label="Date of Birth"
          requiredIndicator
          type="date"
          name="dob"
          value={formData?.dob}
          onChange={handleInputChange}
          error={errors?.dob}
          max={today}
        />
        <CustomInput
          label="Father's Name"
          placeholder="Father's Name"
          requiredIndicator
          name="fatherName"
          value={formData?.fatherName}
          onChange={handleInputChange}
          error={errors?.fatherName}
          maxLength={30}
        />
        <CustomInput
          label="PAN Number"
          placeholder="Permanent Account Number"
          className="uppercase"
          name="pan"
          requiredIndicator
          value={formData?.pan}
          onChange={handleInputChange}
          error={errors?.pan}
          maxLength={10}
        />
        <CustomInput
          requiredIndicator
          label="Aadhar Number"
          placeholder="XXXX XXXX XXXX"
          name="adharNumber"
          value={formData?.adharNumber}
          onChange={handleInputChange}
          error={errors?.adharNumber}
          maxLength={12}
        />
      </div>

      <div className="h-px bg-slate-100 my-2"></div>

      <div className="space-y-4">
        <h4 className="font-semibold text-slate-700 text-sm">
          Present Address
        </h4>
        <div className="grid grid-cols-1 gap-4">
          <CustomInput
            placeholder="Address Line 1"
            name="addressLine1"
            value={formData?.addressLine1}
            onChange={handleInputChange}
            maxLength={50}
          />
          <CustomInput
            placeholder="Address Line 2"
            name="addressLine2"
            value={formData?.addressLine2}
            onChange={handleInputChange}
            maxLength={50}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSearchableSelect
              label="Country"
              options={countryOptions}
              value={formData?.country || ""}
              onChange={(val) => handleSelectChange('country', String(val))}
              placeholder="Select Country"
            />
            <CustomSearchableSelect
              label="State"
              options={stateOptions}
              value={formData?.state || ""}
              onChange={(val) => handleSelectChange('state', String(val))}
              placeholder="Select State"
              disabled={!formData?.country}
            />
            <CustomSearchableSelect
              label="City"
              options={cityOptions}
              value={formData?.city || ""}
              onChange={(val) => handleSelectChange('city', String(val))}
              placeholder="Select City"
              disabled={!formData?.state}
            />
            <CustomInput
              label="Zip Code"
              placeholder="Zip Code"
              name="zipCode"
              value={formData?.zipCode}
              onChange={handleInputChange}
              maxLength={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Step3PersonalDetails);
