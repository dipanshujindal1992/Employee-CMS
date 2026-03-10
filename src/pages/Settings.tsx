import React, { useMemo } from 'react';
import Card from '../components/common/Card';
import {
    Building2,
    Users,
    Settings as SettingsIcon,
    Palette,
    Zap,

} from 'lucide-react';
import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';

import { ROUTES } from '../constant/routes';
const SettingGroup = React.memo(({ title, icon: Icon, items, delay }: { title: string, icon: any, items: (string | { label: string, path: string })[], delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
    >
        <Card className="h-full hover:shadow-xl transition-shadow duration-300 group cursor-pointer border-transparent hover:border-primary/20">
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-blue-50 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{title}</h3>
            </div>
            <ul className="space-y-2.5">
                {items?.map((item, index) => {
                    const label = typeof item === 'string' ? item : item?.label;
                    const path = typeof item === 'string' ? '#' : item?.path;

                    return (
                        <li key={index}>
                            {typeof item === 'object' ? (
                                <Link to={path} className="text-sm text-slate-500 hover:text-primary transition-colors block py-0.5 hover:translate-x-1 transform duration-200 font-medium">
                                    {label}
                                </Link>
                            ) : (
                                <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors block py-0.5 hover:translate-x-1 transform duration-200 font-medium">
                                    {label}
                                </a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </Card>
    </motion.div>
));

const Settings: React.FC = () => {


    const orgItems = useMemo(
        () => [
            { label: "Profile", path: ROUTES.SETUP_ORGANISATION },
            { label: "Work Locations", path: ROUTES.WORK_LOCATIONS },
            { label: "Departments", path: ROUTES.DEPARTMENTS },
            { label: "Designations", path: ROUTES.DESIGNATIONS },
            { label: "Tax Details", path: ROUTES.SETUP_TAX },
        ],
        []
    );

    const setupItems = useMemo(
        () => [
            { label: "Pay Schedule", path: ROUTES.SETUP_PAY_SCHEDULE },
            { label: "Statutory Components", path: ROUTES.SETUP_STATUTORY },
            { label: "Salary Components", path: ROUTES.SALARY_COMPONENTS },
        ],
        []
    );

    const roleItems = useMemo(() => ['Users', 'Roles'], []);


    const customItems = useMemo(() => ['Email Templates', 'Sender Email Preferences', 'Salary Templates', 'PDF Templates', 'Reporting Tags'], []);
    const autoItems = useMemo(() => ['Workflow Rules', 'Actions', 'Schedules'], []);
    return (
        <div className="max-w-7xl mx-auto pb-10">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
            >
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Settings</h1>
                        <p className="text-slate-500 mt-1">Manage your organization preferences.</p>
                    </div>
                </div>
            </motion.div>

            {/* Org Settings Section */}
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest pl-1"
            >
                Organisation Settings
            </motion.h2>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                <SettingGroup
                    title="Organisation"
                    icon={Building2}
                    items={orgItems}
                    delay={0.1}
                />

                <SettingGroup
                    title="Users and Roles"
                    icon={Users}
                    items={roleItems}
                    delay={0.2}
                />


            </div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest pl-1"
            >
                Module Settings
            </motion.h2>


            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <SettingGroup
                    title="Setup & Config"
                    icon={SettingsIcon}
                    items={setupItems}
                    delay={0.4}
                />
                <SettingGroup
                    title="Customisations"
                    icon={Palette}
                    items={customItems}
                    delay={0.5}
                />
                <SettingGroup
                    title="Automations"
                    icon={Zap}
                    items={autoItems}
                    delay={0.6}
                />
            </div>
        </div>
    );
};
export default React.memo(Settings);