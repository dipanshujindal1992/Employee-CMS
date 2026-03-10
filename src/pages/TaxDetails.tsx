import React, { useState } from "react";
import CustomInput from "../components/common/CustomInput";
import CustomButton from "../components/common/CustomButton";
import CustomRadioInput from "../components/common/CustomRadioInput";

// Define a type for your form data
interface FormData {
  pan: string;
  tan: string;
  paymentFre: string;
  deductorName: string;
  deductorFName: string;
  deductorDesignation: string;
  employeeType: string;
}

// Define type for errors
interface FormErrors {
  pan?: string;
  [key: string]: string | undefined;
}

const TaxDetails: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    pan: "",
    tan: "",
    paymentFre: "",
    deductorName: "",
    deductorFName: "",
    deductorDesignation: "",
    employeeType: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validatePAN = (value: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    return panRegex.test(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!formData.pan) newErrors.pan = "PAN is required";
    else if (!validatePAN(formData.pan)) newErrors.pan = "Invalid PAN format";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
    }
  };

  return (
    <div className="container my-4">
      <div>
        <h1>Tax Details</h1>
      </div>
      <h4 className="mb-3">Organisation Tax Details</h4>

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <CustomInput
              label="PAN"
              requiredIndicator={true}
              type="text"
              id="tax-pan"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, pan: e.target.value })
              }
              value={formData.pan}
            />
            {errors.pan && <div className="text-danger mt-1">{errors.pan}</div>}
          </div>

          <div className="col-md-6">
            <CustomInput
              label="TAN"
              type="text"
              id="tax-tan"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, tan: e.target.value })
              }
              value={formData.tan}
            />
          </div>

          <div className="col-md-6">
            <CustomInput
              label={"Tax Payment Frequency"}
              type="text"
              id="tax-frequency"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, paymentFre: e.target.value })
              }
              value={formData.paymentFre}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold mr-1">Employee Type</label>
          <div className="form-check form-check-inline">
            <CustomRadioInput
              id="employee"
              name="employeeType"
              value="employee"
              label="Employee"
              checked={formData.employeeType === "employee"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, employeeType: e.target.value })
              }
            />
          </div>

          <div className="form-check form-check-inline">
            <CustomRadioInput
              id="nonEmployee"
              name="employeeType"
              value="nonEmployee"
              label="Non-Employee"
              checked={formData.employeeType === "nonEmployee"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, employeeType: e.target.value })
              }
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <CustomInput
              label={"Deductor's Name"}
              type="text"
              id="deductorName"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, deductorName: e.target.value })
              }
              value={formData.deductorName}
            />
          </div>

          {formData.employeeType === "nonEmployee" && (
            <>
              <div className="col-md-6">
                <CustomInput
                  label="Deductor's Father's Name"
                  type="text"
                  id="deductorFName"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, deductorFName: e.target.value })
                  }
                  value={formData.deductorFName}
                />
              </div>

              <div className="col-md-6">
                <CustomInput
                  label="Deductor's Designation"
                  type="text"
                  id="deductorDesignation"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      deductorDesignation: e.target.value,
                    })
                  }
                  value={formData.deductorDesignation}
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-4">
          <CustomButton
            type="submit"
            label="Save"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default React.memo(TaxDetails);
