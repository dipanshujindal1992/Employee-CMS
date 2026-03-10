import * as Yup from "yup";

export const firstNameValidation = () =>
  Yup.string()
    .trim()
    .required("First Name is required.");

export const employeeIdValidation = () =>
  Yup.string()
    .trim()
    .required("Employee ID is required.");

export const dateOfJoiningValidation = () =>
  Yup.string()
    .required("Date of Joining is required.");

export const emailValidation = () =>
  Yup.string()
    .trim()
    .required("Email is required.")
    .email("Invalid email format");

export const genderValidation = () =>
  Yup.string()
    .required("Gender is required.");

export const locationValidation = () =>
  Yup.string()
    .required("Location is required.");

export const designationValidation = () =>
  Yup.string()
    .required("Designation is required.");

export const departmentValidation = () =>
  Yup.string()
    .required("Department is required.");

export const phoneValidation = () =>
  Yup.string()
    .required("Mobile Number is required.");

export const dobValidation = () =>
  Yup.string()
    .required("Date of Birth is required.")
    .test(
      "is-adult",
      "Employee must be at least 18 years old.",
      (value) => {
        if (!value) return false;
        const dob = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        return age >= 18;
      }
    );

export const fatherNameValidation = () =>
  Yup.string().required("Father's Name is required.");

export const panValidation = () =>
  Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Card Number (ABCDE1234F)")
    .required("PAN Number is required.");

export const adharValidation = () =>
  Yup.string()
    .matches(/^\d{12}$/, "Aadhar Number must be 12 digits")
    .required("Aadhar Number is required.");

export const optionalEmailValidation = () =>
  Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .email("Invalid email format");
