import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
  extra?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  noPadding = false,
  extra,
}) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg border border-slate-200 shadow-sm transition-all duration-300 overflow-hidden relative",
        className,
      )}
    >
      {title && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            {title}
          </h3>
          {extra && <div className="shrink-0">{extra}</div>}
        </div>
      )}
      <div className={clsx(noPadding ? "" : "p-6")}>{children}</div>
    </div>
  );
};
export default React.memo(Card);
