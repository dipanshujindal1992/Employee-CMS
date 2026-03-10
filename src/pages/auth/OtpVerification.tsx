import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { ROUTES } from "../../constant/routes";
import { forgotPasswordRequest, otpVerifyRequest } from '../../redux/services/authSlice';
import type { RootState } from '../../redux/store';


const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { email, phone, companyName } = location.state || {}; // Get state passed from Signup
  const [actionType, setActionType] = useState<"verify" | "resend" | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Persistence logic for the timer
  const getInitialTimer = () => {
    const expiry = sessionStorage.getItem("otpExpiryTime");
    if (expiry) {
      const remaining = Math.floor((parseInt(expiry) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    // Set initial expiry if none exists
    const newExpiry = Date.now() + 60 * 1000;
    sessionStorage.setItem("otpExpiryTime", newExpiry.toString());
    return 60;
  };

  const [resendTimer, setResendTimer] = useState(getInitialTimer);

  const successMessage = useSelector((state: RootState) => state?.auth?.successMessage);
  const errorMessage = useSelector((state: RootState) => state?.auth?.errorMessage);

  useEffect(() => {
    if (successMessage && isLoading) {
      setIsLoading(false);
      toast.success(successMessage);

      if (actionType === "verify") {
        sessionStorage.removeItem("otpExpiryTime");

        if (email && phone && companyName) {
          navigate(ROUTES.INITIAL_ORGANISATION, {
            replace: true,
            state: {
              email,
              phone,
              companyName,
              isVerified: true,
            },
          });
        } else {
          navigate(ROUTES.RESET_PASSWORD, {
            replace: true,
            state: { email },
          });
        }
      }

      setActionType(null);
    }

    if (errorMessage && isLoading) {
      setIsLoading(false);
      toast.error(errorMessage);
      setActionType(null);
    }
  }, [
    successMessage,
    errorMessage,
    isLoading,
    actionType,
    navigate,
    email,
    phone,
    companyName,
  ]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = useCallback((index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleKeyDown = useCallback((
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4).split("");
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      pastedData.forEach((value, index) => {
        if (index < 4 && !isNaN(Number(value))) {
          newOtp[index] = value;
        }
      });
      setOtp(newOtp);
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 3);
      inputRefs.current[nextIndex]?.focus();
    }
  }, [otp]);
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (otp.some((digit) => digit === "")) return;

    setIsLoading(true);
    setActionType("verify");

    dispatch(otpVerifyRequest({
      otp: otp.join(""),
      email: email || ""
    }));
  }, [otp, email, dispatch]);

  const handleResend = useCallback(() => {
    if (!email || resendTimer > 0) return;

    setIsLoading(true);
    setActionType("resend");

    const newExpiry = Date.now() + 60 * 1000;
    sessionStorage.setItem("otpExpiryTime", newExpiry.toString());
    setResendTimer(60);

    dispatch(forgotPasswordRequest({ email }));
  }, [dispatch, email, resendTimer]);
  const verifyButtonContent = useMemo(() => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verifying...</span>
        </>
      );
    }

    return <span>Verify Code</span>;
  }, [isLoading]);


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

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Enter OTP</h1>
            <p className="text-slate-500">
              We've sent a code to{" "}
              <span className="font-medium text-slate-900">
                {email || phone || "your email"}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-4">
              {otp?.map((digit, index) => (
                <CustomInput
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-500">
                Didn't receive code?{" "}
                <CustomButton
                  type="button"
                  className="text-[#FF4444] font-semibold hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  variant="none"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                </CustomButton>
              </p>
            </div>

            <CustomButton
              type="submit"
              disabled={isLoading || otp.some((d) => d === "")}
              className="w-full bg-[#FF4444] hover:bg-red-600 text-white font-semibold py-3 rounded-lg mt-4 shadow-lg shadow-red-500/20 flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {verifyButtonContent}
            </CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
};
export default React.memo(OtpVerification)
