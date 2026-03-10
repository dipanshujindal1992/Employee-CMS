import React, { useState, useCallback, useEffect } from "react";
import CustomButton from "../components/common/CustomButton";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import CustomPagination from "../components/common/CustomPagination";
import CustomInput from "../components/common/CustomInput";
import { Plus, Search, Pencil, Trash2, Briefcase, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  fetchDesignationsRequest,
  deleteDesignationRequest,
  addDesignationRequest,
  updateDesignationRequest,
} from "../redux/services/designationSlice";
import type { Designation } from "../utils/interfaces";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/common/ConfirmationModal";

const Designations: React.FC = () => {
  const dispatch = useDispatch();
  const designations = useSelector(
    (state: RootState) => state.designation?.designations,
  );

  const totalPages = useSelector(
    (state: RootState) => state.designation.totalPages,
  );
  const totalCount = useSelector(
    (state: RootState) => state.designation.totalCount,
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const successMessage = useSelector(
    (state: RootState) => state.designation.successMessage,
  );
  const errorMessage = useSelector(
    (state: RootState) => state.designation.errorMessage,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Designation | null>(null);
  const [formData, setFormData] = useState({ name: "", mailAlias: "" });
  const [errors, setErrors] = useState({ name: "", mailAlias: "" });
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

  useEffect(() => {
    // Debounced fetch for search or initial load
    const timer = setTimeout(() => {
      dispatch(fetchDesignationsRequest({ search: searchTerm, page, limit }));
    }, 800);
    return () => clearTimeout(timer);
  }, [searchTerm, page, limit, dispatch]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleOpenModal = useCallback((item?: Designation) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        mailAlias: item.email || "",
      });
    } else {
      setEditingItem(null);
      setFormData({ name: "", mailAlias: "" });
    }
    setErrors({ name: "", mailAlias: "" });
    setIsModalOpen(true);
  }, []);

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
      dispatch(deleteDesignationRequest(confirmModal.id));
      setIsLoading(true);
      setConfirmModal({ isOpen: false, id: null });
    }
  }, [confirmModal.id, dispatch]);

  const validate = useCallback(() => {
    let isValid = true;
    const newErrors = { name: "", mailAlias: "" };

    const name = formData.name.trim();
    const email = formData.mailAlias.trim();

    if (!name) {
      newErrors.name = "Designation Name is required";
      isValid = false;
    } else if (/\d/.test(name)) {
      newErrors.name = "Designation Name cannot contain numbers";
      isValid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.mailAlias = "Invalid email format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleSave = useCallback(() => {
    if (!validate()) return;
    setIsLoading(true);

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.mailAlias.trim(),
    };

    if (editingItem) {
      dispatch(
        updateDesignationRequest({
          id: editingItem._id,
          data: trimmedData,
        }),
      );
    } else {
      dispatch(addDesignationRequest(trimmedData));
    }

    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: "", mailAlias: "" });
  }, [validate, editingItem, formData, dispatch, isLoading]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[0-9]/g, "");
    setFormData({ ...formData, name: value });
    if (errors.name) setErrors({ ...errors, name: "" });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, mailAlias: e.target.value });
    if (errors.mailAlias) setErrors({ ...errors, mailAlias: "" });
  };

  const nameInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
          nameInputRef.current.select();
        }
      }, 100);
    }
  }, [isModalOpen]);

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
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg text-white shadow-lg shadow-indigo-500/30">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Designations
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Manage job titles and roles
              </p>
            </div>
          </div>
        </motion.div>

        <CustomButton
          onClick={() => handleOpenModal()}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Designation
        </CustomButton>
      </div>

      {/* Search + Total */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative group w-full sm:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <CustomInput
            type="text"
            placeholder="Search designations..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
            maxLength={30}
          />
        </div>

        <div className="text-sm text-slate-500 px-3 font-medium">
          Total:
          <span className="text-slate-800">{totalCount || 0}</span>
        </div>
      </div>

      {/* List */}
      {designations?.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            No Designations Found
          </h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">
            Create job titles and roles to define employee responsibilities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {designations?.map((item, index) => (
              <motion.div
                key={item?._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card noPadding>
                  <div className="p-5 flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-800 mb-1">
                        {item?.name}
                      </h3>

                      <p className="text-slate-500 text-sm mb-3">
                        {item?.email || "No mail alias configured"}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                          <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          {item?.employeeCount || 0} Employees
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <CustomButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(item)}
                      >
                        <Pencil className="w-4 h-4 text-slate-500 hover:text-indigo-600" />
                      </CustomButton>

                      <CustomButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item?._id)}
                      >
                        <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-600" />
                      </CustomButton>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={designations?.length}
            itemsPerPage={limit}
          />
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Designation" : "New Designation"}
        footer={
          <>
            <CustomButton
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </CustomButton>
            <CustomButton onClick={handleSave}>
              {editingItem ? "Update" : "Add"}
            </CustomButton>
          </>
        }
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <CustomInput
            ref={nameInputRef}
            label="Designation Name"
            requiredIndicator
            value={formData.name}
            onChange={handleNameChange}
            error={errors.name}
            maxLength={30}
          />

          <CustomInput
            label="Mail Alias"
            placeholder="e.g. managers@company.com"
            value={formData.mailAlias}
            onChange={handleEmailChange}
            error={errors.mailAlias}
            maxLength={30}
          />
          <CustomButton type="submit" className="hidden" variant="none" />
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Designation"
        message="Are you sure you want to delete this designation? This action cannot be undone."
        confirmText="Delete"
        isLoading={isLoading}
      />
    </div>
  );
};
export default React.memo(Designations);
