import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";
import {
  addDesignationRequest,
  updateDesignationRequest,
  resetDesignationFlags,
  type Designation,
} from "../../redux/services/designationSlice";
import type { RootState } from "../../redux/store";

interface DesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Designation | null;
  onSuccess?: () => void;
}

const DesignationModal: React.FC<DesignationModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", mailAlias: "" });
  const [errors, setErrors] = useState({ name: "", mailAlias: "" });
  const [isLoading, setIsLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const isAddSuccess = useSelector(
    (state: RootState) => state.designation.isAddDesignationSuccess
  );
  const isUpdateSuccess = useSelector(
    (state: RootState) => state.designation.isUpdateDesignationSuccess
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        mailAlias: initialData.email || "",
      });
    } else {
      setFormData({ name: "", mailAlias: "" });
    }
    setErrors({ name: "", mailAlias: "" });
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      dispatch(resetDesignationFlags());
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
      // Only trigger success if the modal is currently open to avoid side effects
      if (isOpen) {
        if (onSuccess) onSuccess();
        onClose();
      }
    }
  }, [isAddSuccess, isUpdateSuccess, onSuccess, onClose, isOpen]);

  const validate = useCallback(() => {
    let isValid = true;
    const newErrors = { name: "", mailAlias: "" };

    const name = formData.name.trim();
    const email = formData.mailAlias.trim();

    if (!name) {
      newErrors.name = "Designation Name is required.";
      isValid = false;
    } else if (/\d/.test(name)) {
      newErrors.name = "Designation Name cannot contain numbers.";
      isValid = false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.mailAlias = "Invalid email format.";
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

    if (initialData) {
      dispatch(
        updateDesignationRequest({
          id: initialData._id,
          data: trimmedData,
        })
      );
    } else {
      dispatch(addDesignationRequest(trimmedData));
    }
  }, [validate, initialData, formData, dispatch]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[0-9]/g, "");
    setFormData((prev) => ({ ...prev, name: value }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  }, [errors]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, mailAlias: value }));
    if (errors.mailAlias) setErrors((prev) => ({ ...prev, mailAlias: "" }));
  }, [errors]);

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
      title={initialData ? "Edit Designation" : "New Designation"}
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
  );
};

export default React.memo(DesignationModal);
