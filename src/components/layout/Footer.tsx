import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Monitor,
  HelpCircle,
  Shield,
  FileText,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto w-full transition-all duration-300">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Top Section - Support & Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-6 md:gap-4">
          {/* Support Contacts */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium pb-0.5">
                  Toll Free Support
                </p>
                <p className="text-[13px] font-bold text-slate-700">
                  1800 572 6671
                </p>
                <p className="text-[10px] text-slate-400">Mon-Fri, 9AM - 7PM</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium pb-0.5">
                  Email Support
                </p>
                <a
                  href="mailto:support@trydigital.com"
                  className="text-[13px] font-bold text-[#4285F4] hover:underline"
                >
                  support@trydigital.com
                </a>
                <p className="text-[10px] text-slate-400">
                  Response within 24hrs
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to="#"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#4285F4] transition-colors group"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4285F4]" />
              Help Center
            </Link>
            <Link
              to="#"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#4285F4] transition-colors group"
            >
              <Monitor className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4285F4]" />
              Webinars & Training
            </Link>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 gap-4">
          <p className="text-[11px] text-slate-500 font-medium">
            © {currentYear}{" "}
            <span className="font-bold text-slate-700">
              Trydigital Solution
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
            <Link
              to="#"
              className="hover:text-[#4285F4] transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" /> Privacy Policy
            </Link>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <Link
              to="#"
              className="hover:text-[#4285F4] transition-colors flex items-center gap-1"
            >
              <FileText className="w-3 h-3" /> Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
