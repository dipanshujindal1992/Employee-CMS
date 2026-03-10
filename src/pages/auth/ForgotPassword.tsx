import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';
import { ROUTES } from '../../constant/routes';
import { forgotPasswordRequest, resetAuthFlags } from '../../redux/services/authSlice';
import type { RootState } from '../../redux/store';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const successMessage = useSelector((state: RootState) => state.auth.successMessage);
    const errorMessage = useSelector((state: RootState) => state.auth.errorMessage);

    useEffect(() => {
        if (successMessage && isLoading) {
            setIsLoading(false);
            toast.success(successMessage);
            navigate(ROUTES.VERIFY_OTP, { state: { email } });
            dispatch(resetAuthFlags());
        }
        if (errorMessage && isLoading) {
            setIsLoading(false);
            toast.error(errorMessage);
        }
    }, [successMessage, errorMessage, isLoading, navigate, email, dispatch]);

    const handleEmailChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            if (error) setError('');
        },
        [error]
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (!email) {
                setError('Email is required');
                return;
            }

            if (!/\S+@\S+\.\S+/.test(email)) {
                setError('Invalid email format');
                return;
            }

            setIsLoading(true);
            dispatch(forgotPasswordRequest({ email }));
        },
        [email, dispatch]
    );

    const errorMessageMemo = useMemo(() => {
        if (!error) return null;
        return <p className="text-xs text-red-500">{error}</p>;
    }, [error]);
    const buttonContent = useMemo(() => {
        if (isLoading) {
            return (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending OTP...</span>
                </>
            );
        }
        return <span>Send OTP</span>;
    }, [isLoading]);

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Forgot Password?</h1>
                <p className="text-slate-500">Enter your email to reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        Email Address
                    </label>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <CustomInput
                            type="email"
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                                error
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-slate-200 focus:border-primary focus:ring-primary/20'
                            }`}
                            placeholder="you@company.com"
                            value={email}
                            onChange={handleEmailChange}
                            maxLength={30}
                        />
                    </div>
                    {errorMessageMemo}
                </div>

                <CustomButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {buttonContent}
                </CustomButton>
            </form>

            <div className="text-center">
                <Link
                    to={ROUTES.SIGNIN}
                    className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default React.memo(ForgotPassword);
