import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import { AlertCircle, Loader2 } from "lucide-react";
import CustomInput from "../../components/common/CustomInput";
import CustomSelectbox from "../../components/common/CustomSelectbox";
import CustomButton from "../../components/common/CustomButton";
import CustomSearchableSelect from "../../components/common/CustomSearchableSelect";
import CustomImageUpload from "../../components/common/CustomImageUpload";
import { IMAGE_BASE_URL } from "../../constant/api";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import {
  organizationAddDetailRequest,
  organizationGetRequest,
  organizationResetState,
} from "../../redux/services/organizationSlice";
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

const OrganisationProfile: React.FC = () => {
  const dateFormatOptions = useMemo(
    () => [
      {
        label: "MM/dd/yy [ 01/22/26 ]",
        value: "MM/dd/yy [ 01/22/26 ]",
      },
      {
        label: "dd/MM/yy [ 22/01/26 ]",
        value: "dd/MM/yy [ 22/01/26 ]",
      },
      {
        label: "yyyy-MM-dd [ 2026-01-22 ]",
        value: "yyyy-MM-dd [ 2026-01-22 ]",
      },
    ],
    []
  );

  const fieldSeparatorOptions = useMemo(
    () => [
      { label: "/", value: "/" },
      { label: "-", value: "-" },
      { label: ".", value: "." },
    ],
    []
  );
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { organization, isLoading, successMessage, error } = useSelector(
    (state: RootState) => state?.organization || {} as any,
  );

  const [formData, setFormData] = useState({
    organisationName: "",
    businessLocation: "",
    country: "",
    industry: "",
    dateFormat: "",
    fieldSeparator: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    email: "",
    runPayrollEarlier: "",
  });

  useEffect(() => {
    dispatch(organizationGetRequest());
  }, [dispatch]);

  useEffect(() => {
    if (organization) {
      setFormData((prev) => ({
        ...prev,
        organisationName: organization.organizationName || "",
        businessLocation: organization.location || "India",
        country: organization.country || organization.location || "India",
        industry: organization.industry || "",
        dateFormat: organization.dateFormat || "",
        fieldSeparator: organization.fieldSeparator || "",
        address1: organization.address1 || "",
        address2: organization.address2 || "",
        city: organization.city || "",
        state: organization.state || "",
        zipCode: organization.pincode || "",
      }));
    }
  }, [organization]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);

      const saved = localStorage.getItem("payroll_setup_steps");
      const completed = saved ? JSON.parse(saved) : {};
      completed[1] = true;
      localStorage.setItem("payroll_setup_steps", JSON.stringify(completed));

      dispatch(organizationResetState());
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(organizationResetState());
    }
  }, [successMessage, error, dispatch, navigate]);

  const handleLogoUpload = useCallback(
    (file: File) => {
      setLogo(file);
    },
    [],
  );

  const handleRemoveLogo = useCallback(() => {
    setLogo(null);
  }, []);

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
        newData.businessLocation = value as string; // Sync with country
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

  const countryOptions = useMemo(() => Country.getAllCountries()?.map(c => ({ label: c.name, value: c.name })), []);

  const { stateOptions, cityOptions } = useMemo(() => {
    const selectedCountry = Country.getAllCountries().find(c => c.name === formData.country);
    const countryIso = selectedCountry?.isoCode || '';
    const states = State.getStatesOfCountry(countryIso)?.map(s => ({ label: s.name, value: s.name }));

    const selectedState = State.getStatesOfCountry(countryIso).find(s => s.name === formData.state);
    const stateIso = selectedState?.isoCode || '';
    const cities = City.getCitiesOfState(countryIso, stateIso)?.map(c => ({ label: c.name, value: c.name }));

    return { stateOptions: states, cityOptions: cities };
  }, [formData.country, formData.state]);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.organisationName?.trim())
      newErrors.organisationName = "Organisation Name is required.";
    if (!formData.industry) newErrors.industry = "Industry is required.";
    if (!formData.address1?.trim())
      newErrors.address1 = "Address Line 1 is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.zipCode?.trim()) newErrors.zipCode = "PIN Code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.organisationName, formData.industry, formData.address1, formData.country, formData.state, formData.city, formData.zipCode]);

  const handleSave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!validate()) return;
      const data = new FormData();
      data.append("organizationName", formData.organisationName);
      data.append("location", formData.country);
      data.append("country", formData.country);
      data.append("industry", formData.industry);
      data.append("dateFormat", formData.dateFormat);
      data.append("fieldSeparator", formData.fieldSeparator);
      data.append("address1", formData.address1);
      data.append("address2", formData.address2);
      data.append("state", formData.state);
      data.append("city", formData.city);
      data.append("pincode", formData.zipCode);

      if (logo) {
        data.append("logo", logo);
      }

      dispatch(organizationAddDetailRequest(data));
    },
    [formData, logo, dispatch, validate],
  );

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Organisation Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure your organization details.
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          Organisation ID: 60063049909
        </div>
      </div>

      <Card className="space-y-8">
        {/* Logo Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700 block">
            Organisation Logo
          </label>
          <div className="flex gap-6 items-start">
            <CustomImageUpload
              logoPreview={logo ? URL.createObjectURL(logo) : organization?.logo ? `${IMAGE_BASE_URL}/${organization.logo.replace(/\\/g, "/")}` : null}
              onLogoUpload={handleLogoUpload}
              onRemoveLogo={handleRemoveLogo}
              supportedFormats="PNG, JPG, and JPEG"
              className="w-32 h-32"
            />
            <div className="flex-1 text-xs text-slate-500 leading-relaxed">
              <p className="mb-1">
                This logo will be displayed on documents such as Payslip and TDS
                Worksheet.
              </p>
              <p>
                Preferred Image Size: 240 x 240 pixels @ 72 DPI, Maximum size of
                1MB.
              </p>
              <p>Accepted File Formats: PNG, JPG, and JPEG.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 my-6"></div>

        {/* Organisation Name */}
        <div className="space-y-6">
          <div>
            <CustomInput
              label="Organisation Name"
              name="organisationName"
              value={formData.organisationName}
              onChange={handleChange}
              requiredIndicator
              error={errors.organisationName}
              helperText="This is your registered business name which will appear in all the forms and payslips."
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="opacity-70 pointer-events-none">
              <CustomInput
                label="Business Location"
                name="businessLocation"
                value={formData.businessLocation}
                readOnly
                requiredIndicator
              />
            </div>
            <div>
              <CustomSelectbox
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                options={INDUSTRY_OPTIONS}
                requiredIndicator
                error={errors.industry}
                fullWidth
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomSelectbox
              label="Date Format"
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              options={dateFormatOptions}
              requiredIndicator
              fullWidth
            />

            <CustomSelectbox
              label="Field Separator"
              name="fieldSeparator"
              value={formData.fieldSeparator}
              onChange={handleChange}
              options={fieldSeparatorOptions}
              fullWidth
            />
          </div>
        </div>

        <div className="border-t border-slate-100 my-6"></div>

        {/* Organisation Address */}
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

          />
          <CustomInput
            name="address2"
            placeholder="Address Line 2"
            value={formData.address2}
            onChange={handleChange}

          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              requiredIndicator
              maxLength={6}
            />
          </div>
        </div>

        <div className="border-t border-slate-100 my-6"></div>

        {/* Filing Address */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700 block">
            Filing Address
          </label>
          <p className="text-xs text-slate-500 -mt-3">
            This registered address will be used across all Forms and Payslips.
          </p>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <span className="font-medium text-slate-800">Head Office</span>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p>{formData?.city}</p>
              <p>
                {formData?.city}{formData?.state ? `, ${formData?.state}` : ''} {formData?.zipCode}
              </p>
              <p className="font-medium text-slate-500">{formData?.country}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 my-6"></div>

        {/* Contact Information */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700 block">
            Contact Information
          </label>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Primary Contact Email Address
              </label>
              <p className="text-xs text-slate-500">
                This email address receives reminders and email notifications
                from Payroll.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs border border-orange-200">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="text-sm text-slate-800">
                  <p className="font-medium"> developer.tdsl@gmail.com</p>
                  <p className="text-slate-500">{formData.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Emails Are Sent Through
              </label>
              <p className="text-xs text-slate-500">
                You can configure the email addresses that would be used in the
                sender address field for emails sent via Zoho Payroll.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
                  <div className="w-4 h-3 border-2 border-current rounded-sm relative">
                    <div className="absolute top-[2px] left-[1px] w-full border-t border-current transform rotate-45 scale-x-50 origin-left"></div>
                  </div>
                </div>
                <div className="text-sm text-slate-800">
                  <p className="text-slate-500">Email address of</p>
                  <p className="font-medium">developer.tdsl@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded p-4 flex gap-3 text-xs text-blue-800 mt-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-600" />
              <div>
                <span className="font-bold">
                  Your primary contact's email address belongs to a public
                  domain.
                </span>
                So, emails will be sent from
                <span className="font-bold">developer.tdsl@gmail.com</span>
                to prevent them from landing in the Spam folder. If you still
                want to send emails using the public domain,
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6">
          <CustomButton
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#1e87f0] hover:bg-blue-600 text-white py-3 font-semibold rounded shadow-md shadow-blue-500/20 transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto group" />
            ) : (
              "Save & Continue"
            )}
          </CustomButton>
        </div>
      </Card>
    </div>
  );
};
export default React.memo(OrganisationProfile);
