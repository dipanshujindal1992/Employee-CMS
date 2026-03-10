import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import CustomInput from "../common/CustomInput";
import CustomTextArea from "../common/CustomTextArea";
import CustomButton from "../common/CustomButton";
import {
  addDepartmentRequest,
  updateDepartmentRequest,
  resetDepartmentFlags,
  type Department,
} from "../../redux/services/departmentSlice";
import type { RootState } from "../../redux/store";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Department | null;
  onSuccess?: () => void;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [errors, setErrors] = useState({ name: "", code: "" });
  const [isLoading, setIsLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const isAddSuccess = useSelector(
    (state: RootState) => state.department.isAddDepartmentSuccess
  );
  const isUpdateSuccess = useSelector(
    (state: RootState) => state.department.isUpdateDepartmentSuccess
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({ name: "", code: "", description: "" });
    }
    setErrors({ name: "", code: "" });
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      dispatch(resetDepartmentFlags());
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
          nameInputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, dispatch]);


  useEffect(() => {
    if (isAddSuccess || isUpdateSuccess) {
      setIsLoading(false);
      if (isOpen) {
        if (onSuccess) onSuccess();
        onClose();
      }
    }
  }, [isAddSuccess, isUpdateSuccess, onSuccess, onClose, isOpen]);

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
    [errors]
  );

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

    if (initialData) {
      // Edit
      dispatch(
        updateDepartmentRequest({
          id: initialData._id,
          data: trimmedData,
        })
      );
    } else {
      // Add
      dispatch(addDepartmentRequest(trimmedData));
    }
  }, [formData, initialData, dispatch, validate]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSave();
    },
    [handleSave]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Department" : "New Department"}
      size="md"
      footer={
        <>
          <CustomButton variant="outline" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton onClick={handleSave} isLoading={isLoading}>
            {initialData ? "Update" : "Save"}
          </CustomButton>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1">
            <CustomInput
              ref={nameInputRef}
              name="name"
              label="Department Name"
              requiredIndicator
              value={formData.name}
              onChange={handleInputChange}
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
  );
};

export default React.memo(DepartmentModal);
