import React, { useCallback, useEffect, useState } from "react";
import CustomButton from "../components/common/CustomButton";
import Card from "../components/common/Card";
import { Plus, Search, Download, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomInput from "../components/common/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  employeeListRequest,
  employeeDeleteRequest,
  employeeReset,
} from "../redux/services/employeeSlice";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { EMPLOYEE_LIST_API } from "../constant/api";
import { ExcelDownloadCom } from "../components/common/ExcelDownloadCom";
import { toast } from "react-toastify";
import { ROUTES } from "../constant/routes";
import { formatJoiningDate, getInitials } from "../utils/commonFunctions";

const Employees: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const employeeList = useSelector(
    (state: RootState) => state?.employee?.employeeList || []
  );

  const isEmployeeDeleteLoading = useSelector(
    (state: RootState) => state?.employee?.isEmployeeDeleteLoading
  );
  const isEmployeeDeleteSuccess = useSelector(
    (state: RootState) => state?.employee?.isEmployeeDeleteSuccess
  );
  const isEmployeeDeleteFailure = useSelector(
    (state: RootState) => state?.employee?.isEmployeeDeleteFailure
  );
  const isEmployeeListLoading = useSelector(
    (state: RootState) => state?.employee?.isEmployeeListLoading
  );
  const successMessage = useSelector(
    (state: RootState) => state?.employee?.successMessage
  );
  const errorMessage = useSelector(
    (state: RootState) => state?.employee?.errorMessage
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const { totalCount, totalPages } = useSelector(
    (state: RootState) => state?.employee || { totalCount: 0, totalPages: 0 }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Auto-complete setup step 6 for demonstration when landing on this page
  useEffect(() => {
    const saved = localStorage.getItem("payroll_setup_steps");
    const completed = saved ? JSON.parse(saved) : {};
    if (!completed[6]) {
      completed[6] = true;
      localStorage.setItem("payroll_setup_steps", JSON.stringify(completed));
    }
  }, []);

  useEffect(() => {
    dispatch(employeeReset()); // Clear any previous states
  }, [dispatch]);

  useEffect(() => {
    // set a 800ms timeout for debounced search
    const timeoutId = setTimeout(() => {
      dispatch(employeeListRequest({ page, limit, search }));
    }, 800);

    // cleanup function clears timeout if dependencies change before 800ms
    return () => clearTimeout(timeoutId);
  }, [dispatch, page, limit, search]);

  const handleDelete = useCallback((id: string, name: string) => {
    setEmployeeToDelete({ id, name });
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (employeeToDelete) {
      dispatch(employeeDeleteRequest(employeeToDelete.id));
    }
  }, [employeeToDelete, dispatch]);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setEmployeeToDelete(null);
  }, []);

  const handleAddEmployee = useCallback(() => {
    navigate(ROUTES.ADD_EMPLOYEE);
  }, [navigate]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleDownloadExcel = useCallback(() => {
    ExcelDownloadCom({
      api: EMPLOYEE_LIST_API,
      search,
      name: "Employee List"
    });
  }, [search]);

  const handleRowClick = useCallback((id: string) => {
    navigate(`/employees/edit/${id}`);
  }, [navigate]);

  const handlePrevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isEmployeeDeleteSuccess) {
      handleCloseDeleteModal();
      toast.success(successMessage || "Employee deleted successfully");
      dispatch(employeeReset());
    }
  }, [isEmployeeDeleteSuccess, handleCloseDeleteModal, dispatch, successMessage]);

  useEffect(() => {
    if (isEmployeeDeleteFailure) {
      toast.error(errorMessage || "Something went wrong");
    }
  }, [isEmployeeDeleteFailure, errorMessage]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Employees
            </h1>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
              {employeeList.length} Active
            </span>
          </div>
          <p className="text-slate-500 mt-1 font-medium">
            Manage your organization's workforce and roles.
          </p>
        </motion.div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <CustomButton
            onClick={handleAddEmployee}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-xl shadow-primary/20"
          >
            Add Employee
          </CustomButton>

        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 p-1 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            <CustomInput
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 focus:outline-none w-full md:w-72 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        {employeeList.length > 0 && (
          <div className="flex items-center gap-2 pr-2">
            <CustomButton
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              onClick={handleDownloadExcel}
            >
              <Download className="w-4 h-4" />
            </CustomButton>
          </div>)}
      </motion.div>
      {/* Filters & Search */}



      <Card noPadding className="overflow-visible min-h-[400px]">


        {employeeList.length === 0 && !isEmployeeListLoading ? (
          <div className="flex flex-col items-center justify-center h-96 text-center p-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50/50">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Employees Found</h3>
            <p className="text-slate-500 max-w-sm mb-8">
              {search ? "No employees match your search criteria." : "Get started by adding your first employee to the system."}
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 backdrop-blur text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Employee Name</th>
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Work Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {employeeList?.map((emp: any, index: number) => (
                  <motion.tr
                    key={emp?._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                    className="group transition-colors cursor-pointer"
                    onClick={() => handleRowClick(emp?._id)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-primary flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm group-hover:scale-110 transition-transform">
                          {getInitials(emp?.firstName)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {emp?.firstName} {emp?.lastName}
                          </div>
                          <div className="text-xs text-slate-400 font-normal">
                            {formatJoiningDate(emp?.dateofJoining)}
                          </div>
                        </div>
                      </div>
                    </td>
                    {(!emp?.step3 || !emp?.step4) && (
                      <td colSpan={5} className="px-6 py-4">
                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-2 rounded-lg w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                          <span className="text-sm font-medium">This employee's profile is incomplete.</span>
                          <Link
                            to={`/employees/edit/${emp?._id}`}
                            className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-semibold ml-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Complete now
                          </Link>
                        </div>
                      </td>
                    )}
                    {(emp?.step3 && emp?.step4) && (
                      <>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                          {emp?.employeeId}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{emp?.workEmail}</td>
                        <td className="px-6 py-4 text-slate-600">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">
                            {emp?.designationId?.name || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {emp?.departmentId?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          Active

                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Link to={`/employees/edit/${emp?._id}`} onClick={(e) => e.stopPropagation()}>
                          <CustomButton className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors " variant="none">
                            <span className="sr-only">Edit</span>
                            <svg
                              className="w-4 h-4 cursor-pointer"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </CustomButton>
                        </Link>
                        <CustomButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(emp?._id, emp?.firstName);
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors "
                          variant="none"
                        >
                          <span className="sr-only ">Delete</span>
                          <svg
                            className="w-4 h-4 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </CustomButton>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination Placeholder */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 px-2">
        <span>
          {totalCount > 0
            ? `Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, totalCount)} of ${totalCount} entries`
            : "Showing 0 entries"}
        </span>
        <div className="flex gap-2">
          <CustomButton
            className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            Previous
          </CustomButton>
          <CustomButton
            className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={handleNextPage}
          >
            Next
          </CustomButton>
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isEmployeeDeleteLoading}
        variant="danger"
      />
    </div>
  );
};
export default React.memo(Employees);
