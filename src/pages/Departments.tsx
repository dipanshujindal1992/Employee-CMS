import React, { useState, useCallback, useEffect } from "react";
import CustomButton from "../components/common/CustomButton";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import CustomPagination from "../components/common/CustomPagination";
import CustomInput from "../components/common/CustomInput";
import { Plus, Search, Pencil, Trash2, Building2, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  fetchDepartmentsRequest,
  addDepartmentRequest,
  updateDepartmentRequest,
  deleteDepartmentRequest,
} from "../redux/services/departmentSlice";
import type { Department } from "../redux/services/departmentSlice";
import CustomTextArea from "../components/common/CustomTextArea";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/common/ConfirmationModal";

const Departments: React.FC = () => {
  const dispatch = useDispatch();
  const departments = useSelector(
    (state: RootState) => state.department.departments,
  );
  const  totalPages  = useSelector(
    (state: RootState) => state.department.totalPages,
  );
  const totalCount = useSelector(
    (state: RootState) => state.department.totalCount,
  );

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [errors, setErrors] = useState({ name: "", code: "" });

  const successMessage = useSelector(
    (state: RootState) => state.department.successMessage,
  );
  const errorMessage = useSelector(
    (state: RootState) => state.department.errorMessage,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (successMessage && isLoading) {
      setIsLoading(false);
      toast.success(successMessage);
    }
    if (errorMessage && isLoading) {
      setIsLoading(false);
      toast.error(errorMessage);
    }
  }, [isLoading, errorMessage, successMessage]);
  // ---------------- FETCH LIST ----------------
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchDepartmentsRequest({ search: searchTerm, page, limit }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, page, limit, dispatch]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleOpenModal = useCallback((dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        code: dept.code || "",
        description: dept.description || "",
      });
    } else {
      setEditingDept(null);
      setFormData({ name: "", code: "", description: "" });
    }
    setErrors({ name: "", code: "" });
    setIsModalOpen(true);
  }, []);

  /* Delete Confirmation State */
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const handleDelete = useCallback((id: string) => {
    setConfirmModal({ isOpen: true, id });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmModal.id) {
      dispatch(deleteDepartmentRequest(confirmModal.id));
      setIsLoading(true);
      setConfirmModal({ isOpen: false, id: null });
    }
  }, [confirmModal.id, dispatch]);

  const validate = useCallback(() => {
    let isValid = true;
    const newErrors = { name: "", code: "" };

    const name = formData.name.trim();
    const code = formData.code.trim();

    if (!name) {
      newErrors.name = "Department Name is required.";
      isValid = false;
    } else if (/\d/.test(name)) {
      newErrors.name = "Department Name cannot contain numbers.";
      isValid = false;
    }
    const formattedCode = code.replace(/\s+/g, "");

    if (!formattedCode) {
      newErrors.code = "Department Code is required.";
      isValid = false;
    } else if (!/^[A-Za-z0-9]+$/.test(formattedCode)) {
      newErrors.code =
        "Department Code can contain only alphabets and numbers (no spaces or special characters).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleSave = useCallback(() => {
    if (!validate()) return;
    setIsLoading(true);

    const trimmedData = {
      ...formData,
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description.trim(),
    };

    if (editingDept) {
      // Edit
      dispatch(
        updateDepartmentRequest({
          id: editingDept._id,
          data: trimmedData,
        }),
      );
    } else {
      // Add
      dispatch(addDepartmentRequest(trimmedData));
    }
    setIsModalOpen(false);
  }, [formData, editingDept, dispatch, isLoading, validate]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setPage(1); 
    },
    [],
  );
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      let newValue = value;
      if (name === "name") {
        newValue = value.replace(/[0-9]/g, "");
      }

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Clear error when user types
      if (name === "name" && errors.name) {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
      if (name === "code" && errors.code) {
        setErrors((prev) => ({ ...prev, code: "" }));
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSave();
    },
    [handleSave],
  );

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg text-white shadow-lg shadow-blue-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Departments
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Manage organization structure
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <CustomButton
            onClick={() => handleOpenModal()}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-xl shadow-primary/20"
          >
            New Department
          </CustomButton>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative group w-full sm:max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            <CustomInput
              type="text"
              placeholder="Search departments..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 focus:outline-none w-full transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={handleSearchChange}
              maxLength={30}
            />
          </div>
          <div className="text-sm text-slate-500 px-3 font-medium">
            Total:
            <span className="text-slate-800">{totalCount || 0}</span>
          </div>
        </div>

        {departments?.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No Departments Found
            </h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">
              Get started by creating a new department to organize your employee
              structure.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {departments?.map((dept, index) => (
                <motion.div
                  key={dept?._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    noPadding
                    className="group hover:border-primary/30 transition-colors"
                  >
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                            {dept?.name}
                          </h3>
                          {dept.code && (
                            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded border border-slate-200 font-mono">
                              {dept?.code}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-sm truncate pr-4">
                          {dept.description || "No description provided"}
                        </p>

                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">
                            <Users className="w-3.5 h-3.5 mr-1.5" />
                            {dept?.employeeCount || 0} Employees
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(dept)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </CustomButton>
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(dept?._id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </CustomButton>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={departments.length}
          itemsPerPage={limit}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? "Edit Department" : "New Department"}
        size="md"
        footer={
          <>
            <CustomButton
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </CustomButton>
            <CustomButton onClick={handleSave}>
              {editingDept ? "Update" : "Add"}
            </CustomButton>
          </>
        }
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div className="col-span-1">
              <CustomInput
                name="name"
                label="Department Name"
                requiredIndicator
                value={formData.name}
                onChange={handleInputChange}
                autoFocus
                maxLength={30}
                error={errors.name}
              />
            </div>

            <div className="col-span-1">
              <CustomInput
                name="code"
                label="Department Code"
                value={formData.code}
                onChange={handleInputChange}
                maxLength={20}
                requiredIndicator
                error={errors.code}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-600 mb-1.5">
              Description
            </label>
            <CustomTextArea
              name="description"
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm transition-all shadow-sm focus:outline-none focus:border-primary/50 w-full min-h-[100px] resize-none"
              placeholder="Max 250 characters"
              maxLength={250}
              value={formData.description}
              onChange={handleInputChange}
            ></CustomTextArea>
          </div>
          <CustomButton type="submit" className="hidden" variant="none" />
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department? This action cannot be undone."
        confirmText="Delete"
        isLoading={isLoading}
      />
    </div>
  );
};
export default React.memo(Departments);
