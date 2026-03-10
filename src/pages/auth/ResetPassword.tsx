import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { ROUTES } from "../../constant/routes";
import {
  resetPasswordRequest,
  resetAuthFlags,
} from "../../redux/services/authSlice";
import type { RootState } from "../../redux/store";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email;

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const successMessage = useSelector(
    (state: RootState) => state.auth.successMessage,
  );
  const errorMessage = useSelector(
    (state: RootState) => state.auth.errorMessage,
  );

  useEffect(() => {
    if (successMessage && isLoading) {
      setIsLoading(false);
      toast.success(successMessage);
      navigate(ROUTES.SIGNIN);
      dispatch(resetAuthFlags());
    }
    if (errorMessage && isLoading) {
      setIsLoading(false);
      toast.error(errorMessage);
    }
  }, [successMessage, errorMessage, isLoading, navigate, dispatch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!passwords.password || !passwords.confirmPassword) {
        setError("All fields are required.");
        return;
      }

      if (passwords.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      if (passwords.password !== passwords.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setIsLoading(true);
      dispatch(
        resetPasswordRequest({
          password: passwords.confirmPassword,
          email: email,
          newPassword: passwords.password,
        }),
      );
    },
    [passwords, dispatch, email],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPasswords((prev) => ({ ...prev, password: value }));
      setError((prev) => (prev ? "" : prev));
    },
    [],
  );

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPasswords((prev) => ({ ...prev, confirmPassword: value }));
      setError((prev) => (prev ? "" : prev));
    },
    [],
  );

  const passwordInputType = useMemo(
    () => (showPassword ? "text" : "password"),
    [showPassword],
  );

  const confirmPasswordInputType = useMemo(
    () => (showConfirmPassword ? "text" : "password"),
    [showConfirmPassword],
  );

  const passwordToggleIcon = useMemo(() => {
    return showPassword ? (
      <EyeOff className="h-5 w-5" />
    ) : (
      <Eye className="h-5 w-5" />
    );
  }, [showPassword]);

  const confirmPasswordToggleIcon = useMemo(() => {
    return showConfirmPassword ? (
      <EyeOff className="h-5 w-5" />
    ) : (
      <Eye className="h-5 w-5" />
    );
  }, [showConfirmPassword]);

  const errorMessageMemo = useMemo(() => {
    if (!error) return null;
    return <p className="text-xs text-red-500">{error}</p>;
  }, [error]);

  const submitButtonContent = useMemo(() => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Updating...</span>
        </>
      );
    }
    return <span>Update Password</span>;
  }, [isLoading]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
        <p className="text-slate-500">Create a new secure password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <CustomInput
              type={passwordInputType}
              className={`w-full pl-10 pr-12 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:border-primary focus:ring-primary/20"
              }`}
              placeholder="••••••••"
              value={passwords.password}
              onChange={handlePasswordChange}
              maxLength={30}
              requiredIndicator
            />
            <CustomButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              variant="none"
            >
              {passwordToggleIcon}
            </CustomButton>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <CustomInput
              type={confirmPasswordInputType}
              className={`w-full pl-10 pr-12 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500 focus:ring-red-200"
                  : "border-slate-200 focus:border-primary focus:ring-primary/20"
              }`}
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={handleConfirmPasswordChange}
              maxLength={30}
              requiredIndicator
            />
            <CustomButton
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              variant="none"
            >
              {confirmPasswordToggleIcon}
            </CustomButton>
          </div>

          {errorMessageMemo}
        </div>

        <CustomButton
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitButtonContent}
        </CustomButton>
      </form>
    </div>
  );
};

export default React.memo(ResetPassword);
