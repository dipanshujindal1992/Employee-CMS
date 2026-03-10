import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeft, ShieldCheck, Ban, Info, X, Lightbulb } from 'lucide-react';
import Card from '../../components/common/Card';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import CustomInput from '../../components/common/CustomInput';
import CustomSelectbox from '../../components/common/CustomSelectbox';
import CustomButton from '../../components/common/CustomButton';
import { ROUTES } from '../../constant/routes';
const TABS = ['EPF', 'ESI', 'Professional Tax', 'Labour Welfare Fund', 'Statutory Bonus'];

const StatutoryComponents: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('EPF');
    const [isEnabled, setIsEnabled] = useState<Record<string, boolean>>({});

    // EPF Configuration State
    const [epfConfig, setEpfConfig] = useState({
        epfNumber: '',
        employeeContributionRate: '12% of Actual PF Wage',
        employerContributionRate: '12% of Actual PF Wage',
        includeEmployerContribution: true,
        includeEDLI: false,
        includeAdminCharges: false,
        overrideRate: false,
        proRateLOP: false,
        considerSalaryComponents: true
    });

    const [showSplitup, setShowSplitup] = useState(false);

    const handleEnable = (tab?: string) => {
        const targetTab = tab || activeTab;
        setIsEnabled(prev => ({ ...prev, [targetTab]: true }));
    };

    const handleSave = () => {
        const saved = localStorage.getItem('payroll_setup_steps');
        const completed = saved ? JSON.parse(saved) : {};
        completed[4] = true;
        localStorage.setItem('payroll_setup_steps', JSON.stringify(completed));
        navigate(ROUTES.DASHBOARD);
    };

    const handleEpfChange = (key: string, value: any) => {
        setEpfConfig(prev => ({ ...prev, [key]: value }));
    };

    const renderEPFContent = () => {
        if (!isEnabled['EPF']) {
            return (
                <div className="max-w-md space-y-6 mx-auto text-center pt-8">
                    <div className="relative w-64 h-64 mx-auto">
                        <svg viewBox="0 0 200 200" className="w-full h-full opacity-80">
                            <circle cx="100" cy="100" r="80" fill="#F0F7FF" />
                            <path d="M70,140 Q100,60 130,140" stroke="#4285F4" strokeWidth="4" fill="none" />
                            <circle cx="100" cy="70" r="20" fill="#BFDBFE" />
                            <rect x="90" y="90" width="20" height="40" rx="4" fill="#60A5FA" />
                            <circle cx="60" cy="110" r="10" fill="#FCD34D" />
                            <circle cx="140" cy="100" r="8" fill="#FCD34D" />
                        </svg>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-800">Are you registered for EPF?</h2>
                    <p className="text-slate-500 text-[15px] leading-relaxed">
                        Any organisation with 20 or more employees must register for the EPF scheme, 
                        a retirement benefit plan for all salaried employees.
                    </p>
                    
                    <CustomButton 
                        onClick={() => handleEnable('EPF')}
                        className="bg-primary hover:bg-primary-dark text-white px-8 h-12 font-semibold shadow-md shadow-blue-500/20 border-none"
                    >
                        Enable EPF
                    </CustomButton>
                </div>
            );
        }

        // Detailed Enabled View
        return (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                     {/* Left Column: Form */}
                     <div className="lg:col-span-7 space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">EPF Number</label>
                                <CustomInput 
                                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-slate-300" 
                                    placeholder="AA/AAA/0000000/XXX" 
                                    value={epfConfig.epfNumber}
                                    onChange={(e) => handleEpfChange('epfNumber', e.target.value)}
                                />
                                <span className="text-[10px] text-slate-400 block">Format: AA/AAA/0000000/XXX</span>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">Deduction Cycle <Info className="w-3.5 h-3.5 text-slate-400" /></label>
                                <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">Monthly</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Employee Contribution Rate</label>
                                <div className="relative">
                                    <CustomSelectbox 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-sm appearance-none bg-white"
                                        value={epfConfig.employeeContributionRate}
                                        onChange={(e) => handleEpfChange('employeeContributionRate', e.target.value)}
                                    >
                                        <option>12% of Actual PF Wage</option>
                                        <option>10% of Actual PF Wage</option>
                                    </CustomSelectbox>
                                    <div className="absolute right-3 top-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-700">Employer Contribution Rate</label>
                                    <CustomButton 
                                        className="text-sm text-blue-600 hover:underline font-medium"
                                        onClick={() => setShowSplitup(!showSplitup)}
                                    >
                                        View Splitup
                                    </CustomButton>
                                </div>
                                
                                {/* Splitup Popover */}
                                <AnimatePresence>
                                    {showSplitup && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute right-0 top-8 z-10 w-96 bg-white rounded-lg shadow-xl border border-slate-200 p-0 overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50">
                                                <span className="text-xs font-bold text-slate-500 tracking-wider">CONTRIBUTION RATE</span>
                                                <CustomButton onClick={() => setShowSplitup(false)} className="text-slate-400 hover:text-slate-600">
                                                    <X className="w-4 h-4" />
                                                </CustomButton>
                                            </div>
                                            <div className="p-4">
                                                <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b border-slate-100 text-xs text-slate-500 font-medium">
                                                    <span>SUB COMPONENTS</span>
                                                    <span>EMPLOYER'S CONTRIBUTION</span>
                                                </div>
                                                <div className="space-y-3 text-sm">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <span className="text-slate-700">Employees' Provident Fund (EPF)</span>
                                                        <span className="text-slate-900 font-medium">3.67% of PF Wage</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <span className="text-slate-700">Employees' Pension Scheme</span>
                                                        <span className="text-slate-900 font-medium flex items-center gap-1">8.33% of PF Wage <Info className="w-3 h-3 text-slate-400" /></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="relative">
                                    <CustomSelectbox 
                                        className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-sm appearance-none bg-white"
                                        value={epfConfig.employerContributionRate}
                                        onChange={(e) => handleEpfChange('employerContributionRate', e.target.value)}
                                    >
                                        <option>12% of Actual PF Wage</option>
                                        <option>10% of Actual PF Wage</option>
                                    </CustomSelectbox>
                                    <div className="absolute right-3 top-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                             <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-0.5">
                                    <CustomInput 
                                        type="checkbox" 
                                        checked={epfConfig.includeEmployerContribution}
                                        onChange={(e) => handleEpfChange('includeEmployerContribution', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Include employer's contribution in the CTC.</span>
                             </label>

                             <div className={clsx("pl-7 space-y-3 transition-all", !epfConfig.includeEmployerContribution && "opacity-50 pointer-events-none")}>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <CustomInput 
                                        type="checkbox" 
                                        checked={epfConfig.includeEDLI}
                                        onChange={(e) => handleEpfChange('includeEDLI', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-800 flex items-center gap-1">Include employer's EDLI contribution in the CTC. <Info className="w-3.5 h-3.5 text-slate-400" /></span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <CustomInput 
                                        type="checkbox" 
                                        checked={epfConfig.includeAdminCharges}
                                        onChange={(e) => handleEpfChange('includeAdminCharges', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-800 flex items-center gap-1">Include admin charges in the CTC. <Info className="w-3.5 h-3.5 text-slate-400" /></span>
                                </label>
                             </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <CustomInput 
                                    type="checkbox" 
                                    checked={epfConfig.overrideRate}
                                    onChange={(e) => handleEpfChange('overrideRate', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Override PF contribution rate at employee level</span>
                            </label>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                             <h4 className="text-sm font-bold text-slate-700 mb-4">PF Configuration when LOP Applied</h4>
                             <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="mt-0.5"><CustomInput type="checkbox" checked={epfConfig.proRateLOP} onChange={(e) => handleEpfChange('proRateLOP', e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" /></div>
                                    <div>
                                        <p className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Pro-rate Restricted PF Wage</p>
                                        <p className="text-xs text-slate-500 mt-0.5">PF contribution will be pro-rated based on the number of days worked by the employee.</p>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="mt-0.5"><CustomInput type="checkbox" checked={epfConfig.considerSalaryComponents} onChange={(e) => handleEpfChange('considerSalaryComponents', e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" /></div>
                                    <div>
                                        <p className="text-sm text-slate-700 font-medium group-hover:text-slate-900">Consider all applicable salary components if PF wage is less than ₹15,000 after Loss of Pay</p>
                                        <p className="text-xs text-slate-500 mt-0.5">PF wage will be computed using the salary earned in that particular month (based on LOP) rather than the actual amount mentioned in the salary structure.</p>
                                    </div>
                                </label>
                             </div>
                        </div>
                     </div>

                     {/* Right Column: Calculation */}
                     <div className="lg:col-span-5 space-y-6">
                        <div className="bg-orange-50 border border-orange-100 rounded-lg p-6">
                            <h3 className="text-sm font-semibold text-slate-800 mb-2">Sample EPF Calculation</h3>
                            <p className="text-xs text-slate-600 leading-relaxed mb-6">
                                Let's assume the PF wage is <span className="font-semibold text-slate-900">₹ 20,000</span>. The breakup of contribution will be:
                            </p>

                            <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Employee's Contribution</h4>
                                </div>
                                <div className="p-4 flex justify-between items-center text-sm border-b border-slate-100 border-dashed">
                                    <span className="text-slate-600">EPF (12% of 20000)</span>
                                    <span className="font-medium text-slate-900">₹ 2400</span>
                                </div>

                                <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Employer's Contribution</h4>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">EPS (8.33% of 20000 (Max of ₹ 15,000))</span>
                                        <span className="font-medium text-slate-900">₹ 1250</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">EPF (12% of 20000 - EPS)</span>
                                        <span className="font-medium text-slate-900">₹ 1150</span>
                                    </div>
                                    
                                    {epfConfig.includeEDLI && (
                                        <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-left-2">
                                            <span className="text-slate-600">EDLI Contribution (0.50% of 20000)</span>
                                            <span className="font-medium text-slate-900">₹ 75</span>
                                        </div>
                                    )}

                                    {epfConfig.includeAdminCharges && (
                                        <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-left-2">
                                            <span className="text-slate-600">EPF Admin Charges (0.50% of 20000)</span>
                                            <span className="font-medium text-slate-900">₹ 100</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-slate-700">Total</span>
                                    <span className="text-sm font-bold text-slate-900">
                                        ₹ {2400 + 1250 + 1150 + (epfConfig.includeEDLI ? 75 : 0) + (epfConfig.includeAdminCharges ? 100 : 0)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2 items-start opacity-75 hover:opacity-100 transition-opacity cursor-pointer">
                                <Lightbulb className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-600 leading-snug">Do you want to preview EPF calculation for multiple cases, based on the preferences you have configured?</p>
                                    <p className="text-xs text-blue-600 font-medium hover:underline">Preview EPF Calculation</p>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>

                 <div className="pt-8 mt-8 border-t border-slate-100 flex gap-4">
                    <CustomButton 
                        onClick={handleSave}
                        className="bg-primary hover:bg-primary-dark text-white px-6 h-10 shadow-sm"
                    >
                        Enable
                    </CustomButton>
                    <CustomButton 
                        variant="ghost"
                        onClick={() => setIsEnabled(prev => ({ ...prev, EPF: false }))}
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-6 h-10 border border-slate-200"
                    >
                        Cancel
                    </CustomButton>
                </div>
            </div>
        );
    }

    const renderDefaultTab = () => (
        !isEnabled[activeTab] ? (
            <div className="max-w-md space-y-6 mx-auto text-center pt-8">
                <div className="relative w-64 h-64 mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full opacity-80">
                        <circle cx="100" cy="100" r="80" fill="#F0F7FF" />
                        <path d="M70,140 Q100,60 130,140" stroke="#4285F4" strokeWidth="4" fill="none" />
                        <circle cx="100" cy="70" r="20" fill="#BFDBFE" />
                        <rect x="90" y="90" width="20" height="40" rx="4" fill="#60A5FA" />
                        <circle cx="60" cy="110" r="10" fill="#FCD34D" />
                        <circle cx="140" cy="100" r="8" fill="#FCD34D" />
                    </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800">Are you registered for {activeTab}?</h2>
                <p className="text-slate-500 text-[15px] leading-relaxed">
                    Any organisation with 20 or more employees must register for the {activeTab} scheme, 
                    a retirement benefit plan for all salaried employees.
                </p>
                
                <CustomButton 
                    onClick={() => handleEnable()}
                    className="bg-primary hover:bg-primary-dark text-white px-8 h-12 font-semibold shadow-md shadow-blue-500/20 border-none"
                >
                    Enable {activeTab}
                </CustomButton>
            </div>
        ) : (
            <div className="w-full text-left space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium">{activeTab} has been enabled successfully.</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">{activeTab} Number</label>
                        <CustomInput className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20" placeholder="Enter Registration Number" />
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end">
                    <CustomButton 
                        onClick={handleSave}
                        className="bg-primary hover:bg-primary-dark text-white px-8"
                    >
                        Save and Continue
                    </CustomButton>
                </div>
            </div>
        )
    );

    const renderProfessionalTax = () => (
        <div className="text-left space-y-6 max-w-4xl mx-auto w-full">
            <div>
                <h2 className="text-lg font-bold text-slate-800">Professional Tax</h2>
                <p className="text-sm text-slate-500 mt-1">This tax is levied on an employee’s income by the State Government. Tax slabs differ in each state.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-lg p-6 w-full max-w-2xl">
                <h3 className="text-base font-semibold text-slate-800 mb-6">Head Office</h3>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex items-center gap-6 bg-slate-50/50">
                     <Ban className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                     <p className="text-sm text-slate-500">
                        Professional Tax is not applicable for your work location in <span className="font-semibold text-slate-700">Haryana</span>
                     </p>
                </div>
            </div>
        </div>
    );

    const renderLabourWelfareFund = () => (
        <div className="text-left space-y-6 max-w-4xl mx-auto w-full">
            <div>
                <h2 className="text-lg font-bold text-slate-800">Labour Welfare Fund</h2>
                <p className="text-sm text-slate-500 mt-1">Labour Welfare Fund act ensures social security and improves working conditions for employees.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-lg max-w-xl w-full">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="text-base font-semibold text-slate-800">Haryana</h3>
                </div>
                <div className="p-6 space-y-5">
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <span className="text-slate-500">Employees' Contribution</span>
                        <div>
                             <p className="text-slate-800 font-medium">0.20% of Gross Pay</p>
                             <p className="text-xs text-slate-400 mt-0.5">(Max Limit : ₹ 34.00)</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <span className="text-slate-500">Employer's Contribution</span>
                        <p className="text-slate-800 font-medium">2 * Employees' Contribution</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <span className="text-slate-500">Deduction Cycle</span>
                        <p className="text-slate-800 font-medium">Monthly</p>
                     </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <span className="text-slate-500">Status</span>
                         <div className="flex items-center gap-1">
                            {isEnabled['Labour Welfare Fund'] ? (
                                <span className="text-emerald-600 font-medium">Enabled</span>
                            ) : (
                                <>
                                    <span className="text-red-500 font-medium">Disabled</span>
                                    <CustomButton 
                                        className="text-blue-600 hover:underline font-medium ml-1" 
                                        onClick={() => handleEnable('Labour Welfare Fund')}
                                    >
                                        (Enable)
                                    </CustomButton>
                                </>
                            )}
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'EPF':
                return renderEPFContent();
            case 'Professional Tax':
                return renderProfessionalTax();
            case 'Labour Welfare Fund':
                return renderLabourWelfareFund();
            default:
                return renderDefaultTab();
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <CustomButton variant="ghost" className="p-0 hover:bg-transparent" onClick={() => navigate(ROUTES.DASHBOARD)}>
                    <ArrowLeft className="w-6 h-6 text-slate-400 hover:text-slate-700 transition-colors" />
                </CustomButton>
                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Statutory Components</h1>
            </div>

            <Card noPadding className="min-h-[600px] flex flex-col border border-slate-200 shadow-sm">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-6 gap-2">
                    {TABS.map((tab) => (
                        <CustomButton
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "px-4 py-4 text-sm font-medium transition-all relative border-b-2",
                                activeTab === tab 
                                    ? "text-[#1e87f0] border-[#1e87f0]" 
                                    : "text-slate-500 border-transparent hover:text-slate-700"
                            )}
                        >
                            {tab}
                        </CustomButton>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 p-8 bg-white overflow-hidden flex flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full flex-1 flex flex-col md:px-4"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </Card>
        </div>
    );
};
export default React.memo(StatutoryComponents);