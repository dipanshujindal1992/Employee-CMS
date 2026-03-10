import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import clsx from "clsx";

// Redux & Constants
import type { RootState } from "../redux/store";
import { fetchSalaryCategoryRequest, type SalaryCategory } from "../redux/services/salaryComponentSlice";
import {
  deleteEarningRequest,
  fetchEarningsRequest,
  updateEarningStatusRequest,
  fetchEarningByIdRequest,
  resetEarningFlags,
  type Earning,
} from "../redux/services/earningSlice";
import {
  deductionListRequest,
  deleteDeductionRequest,
  updateDeductionStatusRequest,
  clearDeductionMessages,
} from "../redux/services/deductionSlice";
import { ROUTES } from "../constant/routes";

// Components
import CustomButton from "../components/common/CustomButton";
import CustomInput from "../components/common/CustomInput";
import CustomPagination from "../components/common/CustomPagination";
import ConfirmationModal from "../components/common/ConfirmationModal";

// Sub-components
import NewEarningForm from "./SalaryComponents/NewEarningForm";
import NewDeductionForm from "./SalaryComponents/NewDeductionForm";
import EditEarningForm from "./SalaryComponents/EditEarningForm";
import EditDeductionForm from "./SalaryComponents/EditDeductionForm";
import EditBenefitForm from "./SalaryComponents/EditBenefitForm";
import EditReimbursementForm from "./SalaryComponents/EditReimbursementForm";
import SalaryComponentTable, {
  type SalaryComponentItem,
} from "./SalaryComponents/SalaryComponentTable";

const TABS = ["Earnings", "Deductions", "Benefits", "Reimbursements"];

// Interface for Confirm Modal State
interface ConfirmModalState {
  isOpen: boolean;
  id: string | null;
  name: string;
  tab: string;
}

const SalaryComponents: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Local State
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "Earnings");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<string | number | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    id: null,
    name: "",
    tab: "",
  });

  // Local State for placeholder tabs (properly typed)
  const [benefits, setBenefits] = useState<SalaryComponentItem[]>([
    {
      id: "b1",
      name: "Voluntary Provident Fund",
      type: "Voluntary Provident Fund",
      frequency: "Recurring",
      status: "Active",
    },
  ]);

  const [reimbursements, setReimbursements] = useState<SalaryComponentItem[]>([
    {
      id: "r1",
      name: "Fuel Reimbursement",
      type: "Fuel Reimbursement",
      amount: "0 per month",
      status: "Inactive",
    },
    {
      id: "r2",
      name: "Driver Reimbursement",
      type: "Driver Reimbursement",
      amount: "0 per month",
      status: "Inactive",
    },
    {
      id: "r3",
      name: "Telephone Reimbursement",
      type: "Telephone Reimbursement",
      amount: "0 per month",
      status: "Inactive",
    },
    {
      id: "r4",
      name: "Leave Travel Allowance",
      type: "Leave Travel Allowance",
      amount: "0 per month",
      status: "Inactive",
    },
    {
      id: "r5",
      name: "Vehicle Maintenance Reimbursement",
      type: "Vehicle Maintenance Reimbursement",
      amount: "0 per month",
      status: "Inactive",
    },
  ]);

  // Redux Selectors
  const deductionList = useSelector((state: RootState) => state.deduction.deductionList);
  const salaryCategory = useSelector(
    (state: RootState) => state.salaryComponent.salaryCategories,
  );
  const earnings = useSelector((state: RootState) => state.earning.earnings);
  const earning = useSelector((state: RootState) => state.earning.earning);
  const isLoading = useSelector((state: RootState) => state.earning.isLoading);
  const earningTotalPages = useSelector(
    (state: RootState) => state.earning.totalPages,
  );
  const earningTotal = useSelector((state: RootState) => state.earning.total);
  const deductionTotalPages = useSelector(
    (state: RootState) => state.deduction.totalPages,
  );
  const deductionTotal = useSelector(
    (state: RootState) => state.deduction.total,
  );
  const earningSuccessMessage = useSelector(
    (state: RootState) => state.earning.successMessage,
  );
  const earningErrorMessage = useSelector(
    (state: RootState) => state.earning.errorMessage,
  );
  const deductionSuccessMessage = useSelector(
    (state: RootState) => state.deduction.successMessage,
  );
  const deductionErrorMessage = useSelector(
    (state: RootState) => state.deduction.errorMessage,
  );

  const isDeductionLoading = useSelector((state: RootState) => state.deduction.loading);
  // Effects
  useEffect(() => {

    if (earningSuccessMessage) {
      toast.success(earningSuccessMessage);
      dispatch(resetEarningFlags());
    }
    if (earningErrorMessage) {
      toast.error(earningErrorMessage);
      dispatch(resetEarningFlags());
    }
    if (deductionSuccessMessage) {
      toast.success(deductionSuccessMessage);
      dispatch(clearDeductionMessages());
    }
    if (deductionErrorMessage) {
      toast.error(deductionErrorMessage);
      dispatch(clearDeductionMessages());
    }
  }, [earningSuccessMessage, earningErrorMessage, deductionSuccessMessage, deductionErrorMessage, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "Earnings") {
        dispatch(fetchEarningsRequest({ search: searchTerm, page, limit }));
      } else if (activeTab === "Deductions") {
        dispatch(deductionListRequest({ search: searchTerm, page, limit }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, activeTab, searchTerm, page, limit]);

  // Initial fetch for categories
  useEffect(() => {
    dispatch(fetchSalaryCategoryRequest({}));
  }, [dispatch]);

  // Initial Setup Steps Check
  useEffect(() => {
    const saved = localStorage.getItem("payroll_setup_steps");
    const completed = saved ? JSON.parse(saved) : {};
    if (!completed[5]) {
      completed[5] = true;
      localStorage.setItem("payroll_setup_steps", JSON.stringify(completed));
    }
  }, []);

  // Fetch single earning for editing
  const editId = searchParams.get("edit");
  useEffect(() => {
    if (editId && activeTab === "Earnings") {
      dispatch(fetchEarningByIdRequest(editId));
    }
  }, [dispatch, editId, activeTab]);

  // Handlers - Navigation & UI
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleBack = useCallback(() => {
    navigate(ROUTES.SETTINGS);
  }, [navigate]);

  const handleAddDropdownToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId((prev) =>
      prev === "addComponent" ? null : "addComponent",
    );
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("tab", tab);
      return newParams;
    });
    setSearchTerm("");
    setPage(1);
  }, [setSearchParams]);

  const handleCancelForm = useCallback(() => {
    const nextTab = activeTab === "NewDeduction" ? "Deductions" : "Earnings";
    setActiveTab(nextTab);
    setSearchParams({ tab: nextTab });
  }, [activeTab, setSearchParams]);

  const handleSaveForm = useCallback(() => {
    const nextTab = activeTab === "NewDeduction" ? "Deductions" : "Earnings";
    setActiveTab(nextTab);
    setSearchParams({ tab: nextTab });
    // Trigger refetch
    if (activeTab === "NewDeduction") {
      dispatch(deductionListRequest({ search: searchTerm, page, limit }));
    } else {
      dispatch(fetchEarningsRequest({ search: searchTerm, page, limit }));
    }
  }, [activeTab, dispatch, searchTerm, page, limit]);

  const handleCancelEdit = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const handleEdit = useCallback(
    (id: string | number) => {
      setSearchParams({ edit: id.toString() });
    },
    [setSearchParams],
  );

  // Handlers - Actions
  const handleDelete = useCallback(
    (id: string | number, name: string) => {
      setActiveDropdownId(null);
      setConfirmModal({
        isOpen: true,
        id: id.toString(),
        name,
        tab: activeTab,
      });
    },
    [activeTab],
  );

  const handleCloseConfirmModal = useCallback(() => {
    setConfirmModal({ isOpen: false, id: null, name: "", tab: "" });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!confirmModal.id) return;

    if (confirmModal.tab === "Earnings") {
      dispatch(deleteEarningRequest(confirmModal.id));
    } else if (confirmModal.tab === "Deductions") {
      dispatch(deleteDeductionRequest(confirmModal.id));
    } else {
      // Local state deletions for placeholder tabs
      const updater = (prev: SalaryComponentItem[]) =>
        prev.filter((item) => item.id !== confirmModal.id);

      if (confirmModal.tab === "Benefits") setBenefits(updater);
      else if (confirmModal.tab === "Reimbursements")
        setReimbursements(updater);

      toast.success(`${confirmModal.name} has been deleted.`);
    }
    handleCloseConfirmModal();
  }, [confirmModal, dispatch, handleCloseConfirmModal]);
  const handleSalaryClick = useCallback(
    (itemName: string) => {
      setActiveDropdownId(null);
      if (itemName === "Earning") {
        setActiveTab("NewEarning");
        setSearchParams({ tab: "NewEarning" });
      } else if (itemName === "Deduction") {
        setActiveTab("NewDeduction");
        setSearchParams({ tab: "NewDeduction" });
      }
    },
    [setActiveDropdownId, setActiveTab, setSearchParams], // dependencies
  );
  const handleToggleStatus = useCallback(
    (id: string | number) => {
      if (activeTab === "Earnings") {
        const item = earnings.find((e) => e._id === id);
        if (item) {
          dispatch(
            updateEarningStatusRequest({
              id: id.toString(),
              data: { isActive: !item.isActive },
            }),
          );
        }
      } else if (activeTab === "Deductions") {
        const item = deductionList.find((d) => d._id === id);
        if (item) {
          dispatch(
            updateDeductionStatusRequest({
              id: id.toString(),
              isActive: !item.isActive,
            }),
          );
        }
      } else {
        // Local state toggles
        const toggler = (items: SalaryComponentItem[]) =>
          items.map((item) =>
            item.id === id
              ? {
                ...item,
                status: item.status === "Active" ? "Inactive" : "Active",
              }
              : item,
          );

        if (activeTab === "Benefits") setBenefits(toggler);
        else if (activeTab === "Reimbursements") setReimbursements(toggler);
      }
      setActiveDropdownId(null);
    },
    [activeTab, dispatch, earnings],
  );

  // Derived Data
  const filteredData = useMemo((): SalaryComponentItem[] => {
    if (activeTab === "Earnings") {
      if (!Array.isArray(earnings)) return [];

      return earnings?.map((e: Earning): SalaryComponentItem => {
        const earningIdName =
          e.earningId && typeof e.earningId === "object" ? e.earningId.name : e.earningName || e.name || "";
        return {
          id: e._id,
          name: e.earningName || e.name || "Unnamed Earning",
          type: e.earningType || earningIdName || "Fixed Pay",
          calculation: e.isFlatAmount
            ? `Fixed; ₹${e.amount}`
            : `Percentage; ${e.amount}%`,
          epf: e.isActive ? "Yes" : "No",
          esi: e.isActive ? "Yes" : "No",
          status: e.isActive ? "Active" : "Inactive",
        };
      });
    }

    if (activeTab === "Deductions") {
      if (!Array.isArray(deductionList)) return [];
      return deductionList
        ?.filter((d) => d.slipName?.toLowerCase().includes(searchTerm.toLowerCase()))
        ?.map((d): SalaryComponentItem => ({
          id: d._id,
          name: d.slipName,
          type: "Deduction",
          frequency: d.deductionFrequency === "recurring" ? "Recurring" : "One-time",
          status: d.isActive ? "Active" : "Inactive",
        }));
    }

    // Local Data Filtering
    let sourceData: SalaryComponentItem[] = [];
    if (activeTab === "Benefits") sourceData = benefits;
    else if (activeTab === "Reimbursements") sourceData = reimbursements;

    return sourceData.filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [activeTab, earnings, deductionList, benefits, reimbursements, searchTerm]);

  const editingItem = useMemo(() => {
    if (!editId) return null;

    if (activeTab === "Earnings") return earning;
    if (activeTab === "Deductions") {
      return Array.isArray(deductionList) ? (deductionList.find(d => d._id === editId) || null) : null;
    }

    let sourceData: SalaryComponentItem[] = [];
    if (activeTab === "Benefits") sourceData = benefits;
    else if (activeTab === "Reimbursements") sourceData = reimbursements;

    return sourceData.find((item) => item.id === editId) || null;
  }, [editId, activeTab, earning, deductionList, benefits, reimbursements]);
  // Render - Forms
  if (editingItem || activeTab === "NewEarning" || activeTab === "NewDeduction") {
    return (
      <div className="max-w-7xl mx-auto pb-20">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          {activeTab === "NewEarning" ? (
            <NewEarningForm
              onCancel={handleCancelForm}
              onSave={handleSaveForm}
            />
          ) : activeTab === "NewDeduction" ? (
            <NewDeductionForm
              onCancel={handleCancelForm}
              onSave={handleSaveForm}
            />
          ) : (
            <>
              {activeTab === "Earnings" && editingItem && (
                <EditEarningForm
                  item={editingItem as Earning}
                  onCancel={handleCancelEdit}
                  onSave={handleCancelEdit}
                />
              )}
              {activeTab === "Deductions" && editingItem && (
                <EditDeductionForm
                  item={editingItem as SalaryComponentItem}
                  onCancel={handleCancelEdit}
                  onSave={handleCancelEdit}
                />
              )}
              {activeTab === "Benefits" && editingItem && (
                <EditBenefitForm
                  item={editingItem as SalaryComponentItem}
                  onCancel={handleCancelEdit}
                  onSave={handleCancelEdit}
                />
              )}
              {activeTab === "Reimbursements" && editingItem && (
                <EditReimbursementForm
                  item={editingItem as SalaryComponentItem}
                  onCancel={handleCancelEdit}
                  onSave={handleCancelEdit}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Render - Main Table View
  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="sticky top-0 z-30 bg-[#f8fafc]/95 backdrop-blur-sm pt-8 pb-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <CustomButton
              variant="ghost"
              className="p-0 hover:bg-transparent"
              onClick={handleBack}
            >
              <ArrowLeft className="w-6 h-6 text-slate-400 hover:text-slate-700 transition-colors" />
            </CustomButton>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Salary Components
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage earning types, deductions, and benefits structure.
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto relative">
            <div className="relative">
              <CustomButton
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleAddDropdownToggle}
              >
                Add Component
              </CustomButton>

              <AnimatePresence>
                {activeDropdownId === "addComponent" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2  bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="py-1">
                      {salaryCategory?.map((item: SalaryCategory) => (
                        <CustomButton
                          key={item._id || item.name}
                          variant="none"
                          className="w-full text-center px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-primary transition-colors block"
                          onClick={() => handleSalaryClick(item.name)}
                        >
                          {item.name}
                        </CustomButton>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-b-0 rounded-t-xl">
          <div className="border-b border-slate-200 px-6 pt-2 flex gap-8 horizontal-scrollbar overflow-x-auto">
            {TABS.map((tab) => (
              <CustomButton
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={clsx(
                  "pb-4 text-sm font-medium transition-colors relative whitespace-nowrap m-2",
                  activeTab === tab
                    ? "text-primary"
                    : "text-slate-500 hover:text-slate-700",
                )}
                variant="none"
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="border-solid border-black rounded-2xl"
                  />
                )}
              </CustomButton>
            ))}
          </div>

          {activeTab === "Reimbursements" && (
            <div className="px-6 py-3 bg-orange-50/50 border-b border-orange-100/50 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-400 text-white flex items-center justify-center text-[10px] font-bold">
                i
              </div>
              <p className="text-xs text-orange-800">
                With these reimbursement components, employees can claim
                reimbursements for the components which are part of the payroll
                and not for other expenses reimbursements.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 border-t-0 rounded-b-xl shadow-sm min-h-[600px] flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <CustomInput
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>
        </div>

        {isLoading || isDeductionLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredData.length > 0 ? (
          <SalaryComponentTable
            data={filteredData}
            activeTab={activeTab}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium">No {activeTab} Found</p>
            <p className="text-sm">
              Get started by creating a new{" "}
              {activeTab.slice(0, -1).toLowerCase()}.
            </p>
          </div>
        )}

        {((activeTab === "Earnings" && !isLoading) || (activeTab === "Deductions" && !isDeductionLoading)) &&
          filteredData.length > 0 && (
            <div className="p-4 border-t border-slate-100">
              <CustomPagination
                currentPage={page}
                totalPages={activeTab === "Earnings" ? earningTotalPages : deductionTotalPages}
                onPageChange={handlePageChange}
                totalItems={activeTab === "Earnings" ? earningTotal : deductionTotal}
                itemsPerPage={limit}
              />
            </div>
          )}
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Delete Component"
        message={`Are you sure you want to delete ${confirmModal.name}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isLoading}
      />
    </div>
  );
};

export default React.memo(SalaryComponents);
