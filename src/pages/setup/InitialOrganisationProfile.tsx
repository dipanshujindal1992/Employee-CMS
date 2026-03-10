import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Loader2 } from "lucide-react";
import CustomInput from "../../components/common/CustomInput";
import CustomRadioInput from "../../components/common/CustomRadioInput";
import CustomSelectbox from "../../components/common/CustomSelectbox";
import CustomButton from "../../components/common/CustomButton";
import CustomSearchableSelect from "../../components/common/CustomSearchableSelect";
import CustomImageUpload from "../../components/common/CustomImageUpload";
import { ROUTES } from "../../constant/routes";
import { organizationAddRequest, resetAuthFlags } from "../../redux/services/authSlice";
import type { RootState } from "../../redux/store";
import { Country, State, City } from "country-state-city";

const INDUSTRY_OPTIONS = [
  { label: "Agriculture", value: "Agriculture" },
  { label: "Apparel", value: "Apparel" },
  { label: "Banking", value: "Banking" },
  { label: "Biotechnology", value: "Biotechnology" },
  { label: "Chemicals", value: "Chemicals" },
  { label: "Communications", value: "Communications" },
  { label: "Construction", value: "Construction" },
  { label: "Consulting", value: "Consulting" },
  { label: "Education", value: "Education" },
  { label: "Electronics", value: "Electronics" },
  { label: "Energy", value: "Energy" },
  { label: "Engineering", value: "Engineering" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Environmental", value: "Environmental" },
  { label: "Finance", value: "Finance" },
  { label: "Food & Beverage", value: "Food & Beverage" },
  { label: "Government", value: "Government" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Hospitality", value: "Hospitality" },
  { label: "Insurance", value: "Insurance" },
  { label: "Machinery", value: "Machinery" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Media", value: "Media" },
  { label: "Not For Profit", value: "Not For Profit" },
  { label: "Recreation", value: "Recreation" },
  { label: "Retail", value: "Retail" },
  { label: "Shipping", value: "Shipping" },
  { label: "Technology", value: "Technology" },
  { label: "Telecommunications", value: "Telecommunications" },
  { label: "Transportation", value: "Transportation" },
  { label: "Utilities", value: "Utilities" },]

const InitialOrganisationProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { companyName } = location.state || {}; // Retain state

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    organisationName: companyName || "", // Prefill if available
    businessLocation: "India",
    country: "India",
    industry: "",
    address1: "",
    address2: "",
    state: "",
    city: "",
    zipCode: "",
    runPayrollEarlier: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isOrganizationAddSuccess = useSelector(
    (state: RootState) => state?.auth?.isOrganizationAddSuccess
  );
  const isOrganizationAddFailure = useSelector(
    (state: RootState) => state?.auth?.isOrganizationAddFailure
  );
  const successMessage = useSelector(
    (state: RootState) => state?.auth?.successMessage
  );
  const errorMessage = useSelector(
    (state: RootState) => state?.auth?.errorMessage
  );
  const userId = useSelector((state: RootState) => state?.auth?.userId)

  useEffect(() => {
    if (isOrganizationAddSuccess && isLoading) {
      setIsLoading(false);
      toast.success(successMessage || "Organisation profile setup successfully!");
      if (typeof dispatch === 'function') {
        dispatch(resetAuthFlags());
      }
      navigate(ROUTES.DASHBOARD);
    }
    if (isOrganizationAddFailure && isLoading) {
      setIsLoading(false);
      toast.error(errorMessage || "Failed to setup organisation profile");
      if (typeof dispatch === 'function') {
        dispatch(resetAuthFlags());
      }
    }
  }, [isOrganizationAddSuccess, isOrganizationAddFailure, successMessage, errorMessage, isLoading, navigate, dispatch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => {
        if (prev[name]) {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
        return prev;
      });
    },
    [],
  );

  const handleSelectChange = useCallback((name: string, value: string | number) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value as string };
      if (name === "country" && prev.country !== value) {
        newData.state = "";
        newData.city = "";
        newData.businessLocation = value as string; // Sync business location with country
      } else if (name === "state" && prev.state !== value) {
        newData.city = "";
      }
      return newData;
    });
    setErrors((prev) => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleLogoUpload = useCallback((file: File) => {
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setLogo(null);
    setLogoPreview(null);
  }, []);

  const countryOptions = useMemo(() => Country.getAllCountries()?.map(c => ({ label: c?.name, value: c?.name })), []);

  const { stateOptions, cityOptions } = useMemo(() => {
    const selectedCountry = Country.getAllCountries().find(c => c.name === formData.country);
    const countryIso = selectedCountry?.isoCode || '';
    const states = State.getStatesOfCountry(countryIso)?.map(s => ({ label: s?.name, value: s?.name }));

    const selectedState = State.getStatesOfCountry(countryIso).find(s => s.name === formData.state);
    const stateIso = selectedState?.isoCode || '';
    const cities = City.getCitiesOfState(countryIso, stateIso)?.map(c => ({ label: c?.name, value: c?.name }));

    return { stateOptions: states, cityOptions: cities };
  }, [formData.country, formData.state]);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.organisationName?.trim())
      newErrors.organisationName = "Organisation Name is required";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (!formData.address1?.trim())
      newErrors.address1 = "Address Line 1 is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.zipCode?.trim()) newErrors.zipCode = "PIN Code is required";
    if (!formData.runPayrollEarlier)
      newErrors.runPayrollEarlier = "Please select an option";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.organisationName, formData.industry, formData.address1, formData.country, formData.state, formData.city, formData.zipCode, formData.runPayrollEarlier]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsLoading(true);

      const formDataPayload = new FormData();
      formDataPayload.append("organizationName", formData.organisationName);
      formDataPayload.append("location", formData.country);
      formDataPayload.append("industry", formData.industry);
      formDataPayload.append("address1", formData.address1);
      formDataPayload.append("address2", formData.address2);
      formDataPayload.append("state", formData.state);
      formDataPayload.append("city", formData.city);
      formDataPayload.append("pincode", formData.zipCode);
      formDataPayload.append("isRun", (formData.runPayrollEarlier === "yes").toString());
      formDataPayload.append("userId", userId);
      formDataPayload.append("country", formData.country);

      if (logo) {
        formDataPayload.append("logo", logo);
      }

      dispatch(organizationAddRequest(formDataPayload));
    },
    [formData, dispatch, validate, userId, logo],
  );

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white min-h-[600px]">
      {/* Left Side - Hero */}
      <div className="hidden md:flex flex-col justify-center bg-slate-50 p-12 relative overflow-hidden">
        <div className="z-10 relative">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-xl font-bold text-slate-800">
                TDSL Payroll
              </span>
            </div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Hi {companyName || "User"}! Let's get started
            </h2>
            <h1 className="text-4xl font-bold text-slate-800 leading-tight">
              Tell us a bit about your organisation
            </h1>
          </div>
        </div>

        {/* Decorative Image/Graphic Placeholder */}
        <div className="relative mt-8 z-10 flex justify-center">
          <div className="w-64 h-64 bg-blue-100 rounded-full blur-3xl absolute top-10 left-10 opacity-50"></div>
          {/* You could add an img here if you had one, for now utilizing shapes/text */}
          <div
            className="relative w-full h-48 bg-contain bg-no-repeat bg-center opacity-80"
            style={{
              backgroundImage:
                'url("https://cdn-icons-png.flaticon.com/512/3063/3063823.png")',
            }}
          ></div>
          {/* Using a generic building icon as placeholder representing organization setup */}
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>


      <div className="p-8 md:p-12 bg-white flex flex-col justify-center overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <CustomImageUpload
            logoPreview={logoPreview}
            onLogoUpload={handleLogoUpload}
            onRemoveLogo={handleRemoveLogo}
            className="mb-6"
          />
          <CustomInput
            label="Organisation Name"
            name="organisationName"
            value={formData.organisationName}
            onChange={handleChange}
            requiredIndicator
            error={errors.organisationName}
            maxLength={30}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomInput
              label="Business Location"
              name="businessLocation"
              value={formData.businessLocation}
              readOnly
              requiredIndicator
              className="bg-slate-50 text-slate-500 cursor-not-allowed"
              maxLength={30}
            />
            <CustomSelectbox
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              options={INDUSTRY_OPTIONS}
              requiredIndicator
              error={errors.industry}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700 block">
              Organisation Address <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 -mt-3">
              This will be considered as the address of your primary work
              location.
            </p>

            <CustomInput
              name="address1"
              placeholder="Address Line 1"
              value={formData.address1}
              onChange={handleChange}
              error={errors.address1}
              maxLength={50}
            />
            <CustomInput
              name="address2"
              placeholder="Address Line 2"
              value={formData.address2}
              onChange={handleChange}
              maxLength={50}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CustomSearchableSelect
                label="Country"
                options={countryOptions}
                value={formData.country}
                onChange={(val) => handleSelectChange('country', val)}
                placeholder="Select Country"
                requiredIndicator
                error={errors.country}
              />
              <CustomSearchableSelect
                name="state"
                placeholder="Select State"
                label="State"
                requiredIndicator
                value={formData.state}
                onChange={(val) => handleSelectChange('state', val)}
                options={stateOptions}
                error={errors.state}
              />
              <CustomSearchableSelect
                name="city"
                placeholder="Select City"
                label="City"
                requiredIndicator
                value={formData.city}
                onChange={(val) => handleSelectChange('city', val)}
                options={cityOptions}
                error={errors.city}
              />
              <CustomInput
                label="PIN Code"
                name="zipCode"
                placeholder="PIN Code"
                value={formData.zipCode}
                onChange={handleChange}
                error={errors.zipCode}
                maxLength={6}
                requiredIndicator
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-slate-700 block">
              Have you run TDSL Payroll earlier this financial year?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-start gap-3 cursor-pointer group p-4 rounded-lg border transition-all
  ${formData.runPayrollEarlier === "yes"
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:bg-slate-50"}`}
            >
              <CustomRadioInput
                name="runPayrollEarlier"
                value="yes"
                checked={formData.runPayrollEarlier === "yes"}
                onChange={handleChange}
                className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-primary checked:border-4 transition-all mt-1 shrink-0"
                label="Yes, we've already run TDSL Payroll(s) for this financial year."
              />
            </div>
            <div
              className={`flex flex-col sm:flex-row items-start gap-3 cursor-pointer group p-4 rounded-lg border transition-all
  ${formData.runPayrollEarlier === "no"
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:bg-slate-50"}`}
            >
              <CustomRadioInput
                name="runPayrollEarlier"
                value="no"
                checked={formData.runPayrollEarlier === "no"}
                onChange={handleChange}
                className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-primary checked:border-4 transition-all mt-1 shrink-0"
                label="No, we'll run this financial year's first TDSL Payroll with Payroll."
              />
            </div>
            {errors.runPayrollEarlier && (
              <p className="text-xs text-red-500">{errors.runPayrollEarlier}</p>
            )}
          </div>

          <CustomButton
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1e87f0] hover:bg-blue-600 text-white py-3 font-semibold rounded shadow-md shadow-blue-500/20 transition-all text-center flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Save & Continue"
            )}
          </CustomButton>
        </form>
      </div>
    </div>
  );
};
export default React.memo(InitialOrganisationProfile);
