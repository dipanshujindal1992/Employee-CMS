import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import { ROUTES } from "../../constant/routes";
import { useDispatch, useSelector } from "react-redux";
import { signInRequest} from "../../redux/services/authSlice";
import type { RootState } from "../../redux/store";
import { toast } from "react-toastify";
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const successMessage = useSelector(
    (state: RootState) => state.auth.successMessage,
  );
  const errorMessage = useSelector(
    (state: RootState) => state.auth.errorMessage,
  );
 
  useEffect(() => {
    if (successMessage  && isLoading) {
      setIsLoading(false);
      if (successMessage) toast.success(successMessage);
      navigate(ROUTES.DASHBOARD);
    }
    if (errorMessage && isLoading) {
      setIsLoading(false);
      toast.error(errorMessage);
    }
  }, [
    successMessage,
    errorMessage,
    navigate,
    isLoading,
    dispatch,
  ]);
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) {
        return;
      }
      setIsLoading(true);
      dispatch(signInRequest(formData));
    },
    [dispatch, formData, validate, errors,isLoading],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);
  const signInButtonContent = useMemo(() => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Signing in...</span>
        </>
      );
    }

    return (
      <>
        <span>Sign In</span>
        <ArrowRight className="h-5 w-5" />
      </>
    );
  }, [isLoading]);
  const passwordToggleIcon = useMemo(() => {
    if (showPassword) {
      return <EyeOff className="h-5 w-5" />;
    }

    return <Eye className="h-5 w-5" />;
  }, [showPassword]);
  const passwordInputType = useMemo(() => {
    return showPassword ? "text" : "password";
  }, [showPassword]);
  const emailErrorMemo = useMemo(() => {
    if (!errors.email) return null;

    return <p className="text-xs text-red-500">{errors.email}</p>;
  }, [errors.email]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-slate-500">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <CustomInput
              type="text"
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:border-primary focus:ring-primary/20"
              }`}
              name="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              maxLength={60}
            />
          </div>
          {emailErrorMemo}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <CustomInput
              type={passwordInputType}
              className={`w-full pl-10 pr-12 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:border-primary focus:ring-primary/20"
              }`}
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              maxLength={30}
            />
            <CustomButton
              type="button"
              onClick={handleTogglePassword}
              variant="none"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {passwordToggleIcon}
            </CustomButton>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <CustomButton
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {signInButtonContent}
        </CustomButton>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-50 px-2 text-slate-500 font-medium">
            Or
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to={ROUTES.SIGNUP}
            className="text-primary font-semibold hover:text-primary-dark transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};
export default React.memo(Login);
