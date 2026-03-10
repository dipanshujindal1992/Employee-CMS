import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { salaryHistoryListRequest } from "../../redux/services/salaryHistorySlice";
import { Download, FileText, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";
import CustomButton from "../common/CustomButton";
import { SALARY_HISTORY_API, SALARY_HISTORY_MONTH_DOWNLOAD_API } from "../../constant/api";
import { PdfDownloadCom } from "../common/PdfDownloadCom";
import { ExcelDownloadCom } from "../common/ExcelDownloadCom";

interface SalaryHistoryViewProps {
    employeeId: string;
}

const SalaryHistoryView: React.FC<SalaryHistoryViewProps> = ({ employeeId }) => {
    const dispatch = useDispatch();

    const { list, totalPages, page, isLoading } = useSelector(
        (state: RootState) => state.salaryHistory
    );

    /* -------------------- Fetch Data -------------------- */
    useEffect(() => {
        if (employeeId) {
            dispatch(
                salaryHistoryListRequest({
                    employeeId,
                    page: 1,
                    limit: 10,
                })
            );
        }
    }, [dispatch, employeeId]);

    /* -------------------- Callbacks -------------------- */

    const handlePageClick = useCallback(
        (selectedItem: { selected: number }) => {
            dispatch(
                salaryHistoryListRequest({
                    employeeId,
                    page: selectedItem.selected + 1,
                    limit: 10,
                })
            );
        },
        [dispatch, employeeId]
    );

    const formatMoney = useCallback((val: number) => {
        if (val === undefined || val === null) return "0.00";
        return val.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, []);

    const getMonthName = useCallback((monthNumber: number) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString("en-US", { month: "long" });
    }, []);

    const handleDownloadExcel = useCallback(() => {
        ExcelDownloadCom({
            api: SALARY_HISTORY_API(employeeId),
            name: "Salary History List",
            method: "get",
        });
    }, [employeeId]);

    const handleMonthDownloadExcel = useCallback((id: string) => {
        PdfDownloadCom({
            api: SALARY_HISTORY_MONTH_DOWNLOAD_API(id),
            name: "Salary Monthly History List",
            method: "get",
        });
    }, []);

    /* -------------------- Memoized Values -------------------- */

    const hasData = useMemo(() => list && list.length > 0, [list]);

    const renderedRows = useMemo(() => {
        if (!hasData) return null;

        return list?.map((record: any) => (
            <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">
                        {getMonthName(record.month)} {record.year}
                    </div>
                </td>

                <td className="p-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-slate-700 font-mono">
                        ₹ {formatMoney(record.regularEarnings?.total)}
                    </div>
                </td>

                <td className="p-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-slate-700 font-mono">
                        ₹ {formatMoney(record.extraEarnings?.total)}
                    </div>
                </td>

                <td className="p-4 whitespace-nowrap text-right bg-primary/5">
                    <div className="text-sm font-bold text-primary font-mono flex items-center gap-1 justify-end">
                        <IndianRupee className="w-3 h-3" />
                        {formatMoney(record.totalNetPay)}
                    </div>
                </td>

                <td className="p-4 whitespace-nowrap text-center">
                    <span
                        className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${record.status === "generated"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                    >
                        {record.status}
                    </span>
                </td>

                <td className="p-4 whitespace-nowrap text-center">
                    <CustomButton
                        variant="none"
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-primary transition-colors inline-flex"
                        title="Download Payslip"
                        onClick={() => handleMonthDownloadExcel(record._id)}
                    >
                        <Download className="w-4 h-4" />
                    </CustomButton>
                </td>
            </tr>
        ));
    }, [list, hasData, getMonthName, formatMoney, handleMonthDownloadExcel]);

    /* -------------------- UI -------------------- */

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-500" />
                        <h3 className="text-sm font-bold text-slate-800">
                            Salary History
                        </h3>
                    </div>

                    {hasData && (
                        <CustomButton
                            className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors bg-white shadow-sm border border-slate-200"
                            onClick={handleDownloadExcel}
                            title="Download Excel"
                        >
                            <Download className="w-4 h-4" />
                        </CustomButton>
                    )}
                </div>

                {isLoading ? (
                    <div className="p-12 flex justify-center items-center text-slate-400">
                        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : hasData ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="p-4 whitespace-nowrap">Month / Year</th>
                                    <th className="p-4 whitespace-nowrap text-right">Regular Earnings</th>
                                    <th className="p-4 whitespace-nowrap text-right">Extra Earnings</th>
                                    <th className="p-4 whitespace-nowrap text-right text-primary font-bold">
                                        Total Net Pay
                                    </th>
                                    <th className="p-4 whitespace-nowrap text-center">Status</th>
                                    <th className="p-4 whitespace-nowrap w-10 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {renderedRows}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-400">
                        <p className="text-sm">
                            No salary history found for this employee.
                        </p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-slate-100">
                        <span className="text-xs text-slate-500 font-medium tracking-wide">
                            Showing Page {page} of {totalPages}
                        </span>

                        <ReactPaginate
                            breakLabel={<span className="text-slate-400">...</span>}
                            nextLabel={<ChevronRight className="w-4 h-4" />}
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            pageCount={totalPages}
                            previousLabel={<ChevronLeft className="w-4 h-4" />}
                            renderOnZeroPageCount={null}
                            containerClassName="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-slate-100"
                            pageClassName="flex"
                            pageLinkClassName="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            previousClassName="flex"
                            previousLinkClassName="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            nextClassName="flex"
                            nextLinkClassName="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            activeLinkClassName="bg-primary !text-white hover:bg-primary shadow-sm ring-1 ring-primary/20"
                            disabledClassName="opacity-50 cursor-not-allowed"
                            forcePage={page - 1}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(SalaryHistoryView);