import React, { useState, useCallback, useEffect, useMemo } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { ROUTES } from "../../constant/routes";
import { signUpRequest, resetAuthFlags } from "../../redux/services/authSlice";
import type { RootState } from "../../redux/store";
import { Country, State } from 'country-state-city';
import CustomSearchableSelect from "../../components/common/CustomSearchableSelect";
import PhoneInput from "react-phone-input-2";


interface CountryData {
  name: string;
  dialCode: string;
  countryCode: string;
}
const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    country: "India",
    state: "",
    phoneCode: "+91",
    phone: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const successMessage = useSelector(
    (state: RootState) => state?.auth?.successMessage,
  );
  const errorMessage = useSelector(
    (state: RootState) => state?.auth?.errorMessage,
  );

  useEffect(() => {
    if (successMessage && isLoading) {
      setIsLoading(false);
      toast.success(successMessage);
      navigate(ROUTES.VERIFY_OTP, {
        state: {
          email: formData.email,
          phone: `${formData.phoneCode}${formData.phone}`,
          companyName: formData.companyName,
        },
      });
      dispatch(resetAuthFlags());
    }
    if (errorMessage && isLoading) {
      setIsLoading(false);
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage, isLoading, navigate, formData.email, formData.phone, formData.phoneCode, formData.companyName, dispatch]);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim())
      newErrors.companyName = "Company Name is required.";
    if (!formData.email) newErrors.email = "Email Address is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format.";

    if (!formData.phone) newErrors.phone = "Phone Number is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (!formData.state) newErrors.state = "State is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.companyName, formData.email, formData.phone, formData.password, formData.state]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsLoading(true);
      dispatch(
        signUpRequest({
          name: formData.companyName,
          email: formData.email,
          phone: `${formData.phoneCode}${formData.phone}`,
          password: formData.password,
          country: formData.country,
          state: formData.state,
        }),
      );
    },
    [formData, dispatch, validate],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      let updatedValue = value;
      if (name === "phone") {
        updatedValue = value.replace(/\D/g, "");
      }

      setFormData((prev) => ({ ...prev, [name]: updatedValue }));

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

  const countryIso = useMemo(() => {
    const selected = Country.getAllCountries().find(c => c.name === formData.country);
    return selected?.isoCode || '';
  }, [formData.country]);

  const countryOptions = useMemo(() =>
    Country.getAllCountries().map(c => ({ label: c.name, value: c.name })),
    []);



  const stateOptions = useMemo(() =>
    State.getStatesOfCountry(countryIso).map(s => ({ label: s.name, value: s.name })),
    [countryIso]);

  const passwordInputType = useMemo(
    () => (showPassword ? "text" : "password"),
    [showPassword]
  );

  const passwordToggleIcon = useMemo(() => {
    return showPassword ? <EyeOff size={18} /> : <Eye size={18} />;
  }, [showPassword]);


  const submitButtonContent = useMemo(() => {
    if (isLoading) {
      return <Loader2 className="animate-spin mx-auto" />;
    }
    return "Sign up now";
  }, [isLoading]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, [showPassword]);

  const handlePhoneChange = useCallback(
    (
      value: string,
      data: CountryData,

    ) => {
      setFormData((prev) => ({
        ...prev,
        phone: value,
        phoneCode: `+${data?.dialCode ?? "91"}`,
        country: data?.name ?? "India",
      }));

      setErrors((prev) => {
        if (!prev.phone) return prev;
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    },
    []
  );
  const phoneInputClass = useMemo(
    () =>
      `!w-full !py-2 !pl-14 !border !rounded-md ${errors.phone ? "!border-red-500" : "!border-slate-300"
      }`,
    [errors.phone]
  );

  const phoneButtonClass = useMemo(
    () =>
      `!border-slate-300 ${errors.phone ? "!border-red-500" : ""
      }`,
    [errors.phone]
  );
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-2xl bg-white min-h-[600px]">
      {/* Left Side - Hero */}
      <div className="hidden md:flex flex-col justify-between bg-[#FFF8F4] p-12 relative overflow-hidden md:rounded-l-2xl">
        <div className="z-10 relative h-full flex flex-col justify-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/50 w-fit px-4 py-2 rounded-full backdrop-blur-sm shadow-sm transition-transform hover:scale-105">
                <span className="bg-green-500 rounded-full p-1 text-white">
                  <Check size={12} />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  Create your account
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/50 w-fit px-4 py-2 rounded-full backdrop-blur-sm shadow-sm ml-8 transition-transform hover:scale-105">
                <span className="bg-green-500 rounded-full p-1 text-white">
                  <Check size={12} />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  Configure settings
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/50 w-fit px-4 py-2 rounded-full backdrop-blur-sm shadow-sm transition-transform hover:scale-105">
                <span className="bg-green-500 rounded-full p-1 text-white">
                  <Check size={12} />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  Run payroll
                </span>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-slate-800 leading-tight">
              Payroll made simple, efficient, and auto-compliant for every
              business.
            </h2>
          </div>
        </div>

        {/* Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200/50 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="p-8 md:p-12 flex flex-col justify-center bg-white relative rounded-2xl md:rounded-l-none md:rounded-r-2xl">
        {/* Top Branding Mobile Only */}
        <div className="md:hidden mb-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold">
            P
          </div>
          <h1 className="text-xl font-bold text-slate-800">Payroll</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Let's get started
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <CustomInput
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter Company Name"
            error={errors.companyName}
            requiredIndicator={true}
            maxLength={30}
          />

          <CustomInput
            label="Email Address"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            error={errors.email}
            maxLength={60}
            requiredIndicator
          />

          <div className="space-y-1 z-20 relative">
            <label className="text-sm font-semibold text-slate-700 mb-1">
              Mobile Number (Personal)<span className="text-red-500">*</span>
            </label>
            <PhoneInput
              country="in"
              value={formData.phone}
              onChange={handlePhoneChange}
              inputProps={{
                name: "phone",
                required: true,
                maxLength: 15,
                autoFocus: false,
              }}
              containerClass="!w-full"
              inputClass={phoneInputClass}
              buttonClass={phoneButtonClass}
              specialLabel=""
              disableCountryCode={false}
              countryCodeEditable
              enableSearch
              searchPlaceholder="Search country"
            />

            {errors.phone && (
              <span className="text-xs text-red-500 mt-1 font-medium">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="relative">
            <CustomInput
              label="Password"
              name="password"
              placeholder="Enter Password"
              type={passwordInputType}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              className="pr-10"
              requiredIndicator={true}
              maxLength={20}
            />
            <CustomButton
              type="button"
              variant="none"
              onClick={toggleShowPassword}
              className="absolute right-1 top-[30px] text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {passwordToggleIcon}
            </CustomButton>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-2">
            <div>
              <CustomSearchableSelect
                options={countryOptions}
                value={formData.country}
                onChange={(val) => handleSelectChange('country', val)}
                placeholder="Select Country"
                requiredIndicator
                label="Country"
              />
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}

            </div>
            <div>
              <CustomSearchableSelect
                options={stateOptions}
                value={formData.state}
                onChange={(val) => handleSelectChange('state', val)}
                placeholder="Select State"
                label="State"
                requiredIndicator
              />
              {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
            </div>
          </div>

          <div className="text-xs text-slate-500 my-1">
            Your data will be in INDIA data center.
          </div>

          <CustomButton
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF4444] hover:bg-red-600 text-white font-semibold py-3 rounded-lg mt-4 shadow-lg shadow-red-500/20 justify-center"
          >
            {submitButtonContent}
          </CustomButton>
        </form>


        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to={ROUTES.SIGNIN}
              className="text-blue-600 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default React.memo(Signup);
