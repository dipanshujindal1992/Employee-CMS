import React, { useState, useCallback, useEffect, useMemo } from "react";
import Card from "../components/common/Card";
import CustomButton from "../components/common/CustomButton";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ROUTES } from "../constant/routes";
import type { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartmentsRequest } from "../redux/services/departmentSlice";
import { fetchDesignationsRequest } from "../redux/services/designationSlice";
import { fetchWorkLocationsRequest } from "../redux/services/workLocationSlice";
import { employeeAddRequest, employeeDetailsRequest, employeeReset } from "../redux/services/employeeSlice";
import DepartmentModal from "../components/modals/DepartmentModal";
import DesignationModal from "../components/modals/DesignationModal";
import {
  firstNameValidation,
  employeeIdValidation,
  dateOfJoiningValidation,
  emailValidation,
  genderValidation,
  locationValidation,
  designationValidation,
  departmentValidation,
  phoneValidation,
  dobValidation,
  fatherNameValidation,
  panValidation,
  adharValidation,
  optionalEmailValidation,
} from "../utils/validation";
import Step1BasicDetails from "../components/employee-form/Step1BasicDetails";
import Step2SalaryDetails from "../components/employee-form/Step2SalaryDetails";
import type { EmployeeFormData, EarningItem } from "../components/employee-form/Step2SalaryDetails";
import Step2SalaryReview from "../components/employee-form/Step2SalaryReview";
import Step3PersonalDetails from "../components/employee-form/Step3PersonalDetails";
import Step4PaymentInfo from "../components/employee-form/Step4PaymentInfo";
import {  CheckCircle, ChevronRight } from "lucide-react";
import { fetchSalaryEarningListRequest, type Earning } from "../redux/services/earningSlice";
import { formatDateToInput } from "../utils/commonFunctions";

const steps = [
  { id: 1, label: "Basic Details" },
  { id: 2, label: "Salary Details" },
  { id: 3, label: "Personal Details" },
  { id: 4, label: "Payment Information" },
];

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step");
  const isWizard = searchParams.get("wizard") === "true";
  const isEditMode = !!id && !isWizard;

  const today = new Date().toISOString().split("T")[0];
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(stepParam ? parseInt(stepParam) : 1);
  const [isSalaryReview, setIsSalaryReview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeptModalOpen, setDeptModalOpen] = useState(false);
  const [isDesigModalOpen, setDesigModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStepDisabled, setIsStepDisabled] = useState(false);
  const dispatch = useDispatch();
  const employeeId = useSelector(
    (state: RootState) => state?.employee?.employeeId,
  );

  const isEmployeeAddSuccess = useSelector(
    (state: RootState) => state?.employee?.isEmployeeAddSuccess,
  );
  const isEmployeeAddFailure = useSelector(
    (state: RootState) => state?.employee?.isEmployeeAddFailure,
  );
  const successMessage = useSelector(
    (state: RootState) => state?.employee?.successMessage,
  );
  const errorMessage = useSelector(
    (state: RootState) => state?.employee?.errorMessage,
  );

  const employeeDetail = useSelector(
    (state: RootState) => state?.employee?.employeeDetails
  );

  // Form State
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    employeeId: "",
    dateofJoining: "",
    workEmail: "",
    phone: "",
    gender: "",
    locationId: "",
    designationId: "",
    departmentId: "",
    annualCTC: "",
    basicSalary: "",
    fixedAllowance: "",
    earnings: [{ id: "basic", name: "Basic", type: "% of CTC", value: "50" }],
    email: "",
    dob: "",
    fatherName: "",
    pan: "",
    adharNumber: "",
    addressLine1: "",
    addressLine2: "",
    country: "India",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    reAccountNumber: "",
    ifscCode: "",
    accountType: "savings",

  });

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(employeeDetailsRequest(id));
    }
  }, [isEditMode, id, dispatch]);

  useEffect(() => {
    if (isEmployeeAddSuccess && isLoading) {
      toast.success(successMessage || "Employee saved successfully");
      setIsLoading(false);

      if (!isEditMode && isSubmitting) {
        if (currentStep < 4) {
          setCurrentStep((prev) => Math.min(prev + 1, 4));
        } else {
          setIsSubmitted(true);
          navigate(ROUTES.EMPLOYEES);
        }
        setIsSubmitting(false);
      }
    }
  }, [isEmployeeAddSuccess, successMessage, isLoading, isEditMode, isSubmitting, currentStep, navigate]);

  useEffect(() => {
    if (isEmployeeAddFailure && isLoading) {
      toast.error(errorMessage || "Something went wrong");
      setIsLoading(false);
      setIsSubmitting(false); // Enable the save button again so the user can fix the error
    }
  }, [isEmployeeAddFailure, errorMessage, isLoading]);

  useEffect(() => {
    if (isEditMode && isEmployeeAddSuccess && isSubmitting && id) {
      setIsSubmitting(false);
      setIsLoading(false);
      navigate(`/employees/edit/${id}`);
    }
  }, [isEmployeeAddSuccess, isEditMode, id, navigate, isSubmitting]);

  const departmentList = useSelector(
    (state: RootState) => state.department?.departments || [],
  );
  const designationList = useSelector(
    (state: RootState) => state.designation?.designations || [],
  );
  const workLocations = useSelector(
    (state: RootState) => state.workLocation?.workLocations || [],
  );
  const salaryEarningList = useSelector((state: RootState) => state?.earning?.salaryEarningList || []);

  useEffect(() => {
    if (isEditMode && employeeDetail) {
      setFormData({
        firstName: employeeDetail.employee?.firstName || "",
        middleName: employeeDetail.employee?.middleName || "",
        lastName: employeeDetail.employee?.lastName || "",
        employeeId: employeeDetail.employee?.employeeId || "",
        dateofJoining: employeeDetail.employee?.dateofJoining ? new Date(employeeDetail.employee.dateofJoining).toISOString().split('T')[0] : "",
        workEmail: employeeDetail.employee?.workEmail || "",
        phone: employeeDetail.employee?.phone || "",
        gender: employeeDetail.employee?.gender || "",
        locationId: employeeDetail.employee?.locationId?._id || "",
        designationId: employeeDetail.employee?.designationId?._id || "",
        departmentId: employeeDetail.employee?.departmentId?._id || "",
        annualCTC: employeeDetail.employee?.ctc?.toString() || "",
        basicSalary: employeeDetail.salaryDetails?.basicSalary || "",
        fixedAllowance: employeeDetail.salaryDetails?.fixedAllowance || "",
        earnings: [
          {
            id: "basic",
            name: (typeof employeeDetail.earningDetails?.basicId === 'object' ? employeeDetail.earningDetails.basicId?._id : employeeDetail.earningDetails?.basicId) || "Basic",
            type: "% of CTC",
            value: employeeDetail.earningDetails?.basicAmount?.toString() || "50"
          },
          ...(employeeDetail.earningDetails?.hraId ? [{
            id: "hra_group",
            name: (typeof employeeDetail.earningDetails.hraId === 'object' ? employeeDetail.earningDetails.hraId?._id : employeeDetail.earningDetails.hraId) || "",
            type: (typeof employeeDetail.earningDetails.hraId === 'object' ? (employeeDetail.earningDetails.hraId?.isFlatAmount ? "Fixed amount" : "% of Basic") : "% of Basic"),
            value: employeeDetail.earningDetails.hraAmount?.toString() || "0",
            componentId: (typeof employeeDetail.earningDetails.hraId === 'object' ? employeeDetail.earningDetails.hraId?._id : employeeDetail.earningDetails.hraId) || ""
          }] : []),
          ...(employeeDetail.earningDetails?.conveyanceId ? [{
            id: "conveyance_group",
            name: (typeof employeeDetail.earningDetails.conveyanceId === 'object' ? employeeDetail.earningDetails.conveyanceId?._id : employeeDetail.earningDetails.conveyanceId) || "",
            type: (typeof employeeDetail.earningDetails.conveyanceId === 'object' ? (employeeDetail.earningDetails.conveyanceId?.isFlatAmount ? "Fixed amount" : "% of Basic") : "Fixed amount"),
            value: employeeDetail.earningDetails.conveyanceAmount?.toString() || "0",
            componentId: (typeof employeeDetail.earningDetails.conveyanceId === 'object' ? employeeDetail.earningDetails.conveyanceId?._id : employeeDetail.earningDetails.conveyanceId) || ""
          }] : []),
          ...(employeeDetail.earningDetails?.customAllowances?.map((ca: any) => {
            const caId = typeof ca.customAllowanceId === 'object' ? ca.customAllowanceId?._id : ca.customAllowanceId;
            const caLabel = typeof ca.customAllowanceId === 'object'
              ? ca.customAllowanceId?.earningName
              : (salaryEarningList?.find((item: any) => item?._id === caId)?.earningName || caId || "Custom Allowance");

            return {
              id: `custom_${caId}`,
              name: caLabel,
              type: (typeof ca.customAllowanceId === 'object' ? (ca.customAllowanceId?.isFlatAmount ? "Fixed amount" : "% of Basic") : "Fixed amount"),
              value: ca.customAllowanceAmount?.toString() || "0",
              componentId: caId || ""
            };
          }) || []),
        ],
        email: employeeDetail.personalDetail?.email || "",
        dob: formatDateToInput(employeeDetail.personalDetail?.dob),
        fatherName: employeeDetail.personalDetail?.fatherName || "",
        pan: employeeDetail.personalDetail?.pan || "",
        adharNumber: employeeDetail.personalDetail?.adhaar || "",
        addressLine1: employeeDetail.personalDetail?.address1 || "",
        addressLine2: employeeDetail.personalDetail?.address2 || "",
        country: "India",
        city: employeeDetail.personalDetail?.city || "",
        state: employeeDetail.personalDetail?.state || "",
        zipCode: employeeDetail.personalDetail?.pincode || "",
        paymentMethod: employeeDetail.employee?.paymentType === "bank" ? "bank_transfer" : (employeeDetail.employee?.paymentType || ""),
        accountHolderName: employeeDetail.bankDetails?.name || "",
        bankName: employeeDetail.bankDetails?.bankName || "",
        accountNumber: employeeDetail.bankDetails?.accountNumber || "",
        reAccountNumber: employeeDetail.bankDetails?.accountNumber || "",
        ifscCode: employeeDetail.bankDetails?.ifsc || "",
        accountType: employeeDetail.bankDetails?.type || "savings",
      });
    }
  }, [employeeDetail, isEditMode, salaryEarningList]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchSalaryEarningListRequest())
    dispatch(fetchDepartmentsRequest({ page: 1, limit: 1000 }));
    dispatch(fetchDesignationsRequest({ page: 1, limit: 1000 }));
    dispatch(fetchWorkLocationsRequest({ page: 1, limit: 1000 }));
    dispatch(employeeReset());
  }, [dispatch]);

  const validationSchema = useMemo(() => {
    if (currentStep === 1) {
      return Yup.object({
        firstName: firstNameValidation(),
        employeeId: employeeIdValidation(),
        dateofJoining: dateOfJoiningValidation(),
        workEmail: emailValidation(),
        phone: phoneValidation(),
        gender: genderValidation(),
        locationId: locationValidation(),
        designationId: designationValidation(),
        departmentId: departmentValidation(),
      });
    }
    if (currentStep === 2 && !isSalaryReview) {
      return Yup.object({
        annualCTC: Yup.string()
          .required("Annual CTC is required")
          .test(
            "is-positive",
            "CTC must be greater than 0",
            (value) => !!value && parseFloat(value) > 0
          ),
      });
    }
    if (currentStep === 3) {
      return Yup.object({
        dob: dobValidation(),
        fatherName: fatherNameValidation(),
        pan: panValidation(),
        adharNumber: adharValidation(),
        email: optionalEmailValidation(),
      });
    }
    if (currentStep === 4) {
      if (formData.paymentMethod === "bank_transfer") {
        return Yup.object({
          accountHolderName: Yup.string().required(
            "Account Holder Name is required",
          ),
          bankName: Yup.string().required("Bank Name is required"),
          accountNumber: Yup.string().required("Account Number is required"),
          reAccountNumber: Yup.string()
            .oneOf([Yup.ref("accountNumber")], "Account Numbers must match")
            .required("Re-enter Account Number is required"),
          ifscCode: Yup.string().required("IFSC Code is required"),
          accountType: Yup.string().required("Account Type is required"),
        });
      }
    }
    return Yup.object({});
  }, [currentStep, formData.paymentMethod]);

  const handleNext = useCallback(async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      if (currentStep === 1) {
        const payload = {
          dateofJoining: formData.dateofJoining,
          departmentId: formData.departmentId,
          designationId: formData.designationId,
          employeeId: formData.employeeId,
          firstName: formData.firstName,
          gender: formData.gender,
          lastName: formData.lastName,
          locationId: formData.locationId,
          middleName: formData.middleName,
          phone: formData.phone,
          step: 1,
          workEmail: formData.workEmail,
          ...(isEditMode && { id: id, mode: "edit" }),
        };
        setIsSubmitting(true);
        setIsLoading(true)
        dispatch(employeeAddRequest(payload));
        if (isEditMode) return;
      }
      if (currentStep === 2) {
        if (!isSalaryReview) {
          setIsSalaryReview(true);
          return;
        } else {
          const ctc = Number(formData.annualCTC) || 0;
          const monthlyCtc = ctc / 12;

          let monthlyBasicAmount = 0;
          const basicEarning = formData.earnings?.find((e: EarningItem) => e.id === "basic");
          if (basicEarning) {
            let basicType = "% of CTC";
            const basicOpt = salaryEarningList?.find((opt: Earning) => opt._id === basicEarning.name);
            if (basicOpt) basicType = basicOpt.isFlatAmount ? "Fixed amount" : "% of CTC";

            const val = Number(basicEarning.value) || 0;
            if (basicType === "% of CTC") {
              monthlyBasicAmount = Math.round(monthlyCtc * (val / 100));
            } else {
              monthlyBasicAmount = val;
            }
          }

          let monthlyHraAmount = 0;
          const hraEarning = formData.earnings?.find((e: EarningItem) => e.id === "hra_group");
          if (hraEarning) {
            const hraOpt = salaryEarningList?.find((opt: Earning) => opt._id === hraEarning.name);
            const isHraFlat = hraOpt?.isFlatAmount ?? false;
            const val = Number(hraEarning.value) || 0;
            if (isHraFlat) {
              monthlyHraAmount = val;
            } else {
              monthlyHraAmount = Math.round(monthlyBasicAmount * (val / 100));
            }
          }

          let monthlyConveyanceAmount = 0;
          const conveyanceEarning = formData.earnings?.find((e: EarningItem) => e.id === "conveyance_group");
          if (conveyanceEarning) {
            const convOpt = salaryEarningList?.find((opt: Earning) => opt._id === conveyanceEarning.name);
            const isConvFlat = convOpt?.isFlatAmount ?? true; // Default to flat as it was before
            const val = Number(conveyanceEarning.value) || 0;
            if (isConvFlat) {
              monthlyConveyanceAmount = val;
            } else {
              monthlyConveyanceAmount = Math.round(monthlyBasicAmount * (val / 100));
            }
          }

          const customAllowancesArray = (formData.earnings || [])
            .filter((e: EarningItem) => e.id.startsWith("custom_"))
            .map((ca: EarningItem) => {
              const caValue = Number(ca.value) || 0;
              const caOpt = salaryEarningList?.find((opt: Earning) => opt._id === ca.componentId);
              const isCaFlat = caOpt?.isFlatAmount ?? true;
              let caMonthly = 0;
              if (isCaFlat) {
                caMonthly = caValue;
              } else {
                caMonthly = Math.round(monthlyBasicAmount * (caValue / 100));
              }

              return {
                customAllowanceId: ca.componentId,
                customAllowanceAmount: caValue,
                customAllowanceAmountMonthly: caMonthly
              };
            });

          const totalMonthlyCustomAllowance = customAllowancesArray.reduce((sum: number, ca: any) => sum + Number(ca.customAllowanceAmountMonthly || 0), 0);

          const sumOtherMonthly = monthlyBasicAmount + monthlyHraAmount + monthlyConveyanceAmount + totalMonthlyCustomAllowance;
          const roundedMonthlyCtc = Math.round(ctc / 12);
          const fixedAllowanceMonthly = roundedMonthlyCtc - sumOtherMonthly;

          const payload = {
            step: 2,
            employeeId: (isEditMode || isWizard) ? id : employeeId,
            ...(isEditMode && { id: id, mode: "edit" }),
            ctc: formData.annualCTC,
            basicId: basicEarning?.name,
            basicAmount: Number(basicEarning?.value) || 0,
            basicAmountMonthly: monthlyBasicAmount,
            hraId: hraEarning?.name,
            hraAmount: Number(hraEarning?.value) || 0,
            hraAmountMonthly: monthlyHraAmount,
            conveyanceId: conveyanceEarning?.name,
            conveyanceAmount: Number(conveyanceEarning?.value) || 0,
            conveyanceAmountMonthly: monthlyConveyanceAmount,
            fixedAmountMonthly: fixedAllowanceMonthly,
            customAllowances: customAllowancesArray
          };
          setIsSubmitting(true);
          setIsLoading(true)
          dispatch(employeeAddRequest(payload));
          if (isEditMode) return;
        }
      }

      if (currentStep === 3) {
        const payload = {
          step: 3,
          employeeId: (isEditMode || isWizard) ? id : employeeId,
          ...(isEditMode && { id: id, mode: "edit" }),
          email: formData.email,
          dob: formData.dob,
          fatherName: formData.fatherName,
          pan: formData.pan,
          adhaar: formData.adharNumber,
          address1: formData.addressLine1,
          address2: formData.addressLine2,
          country: formData.country,
          city: formData.city,
          state: formData.state,
          pincode: formData.zipCode,
        };
        setIsSubmitting(true);
        setIsLoading(true)
        dispatch(employeeAddRequest(payload));
        if (isEditMode) return;
      }
      if (currentStep === 4) {
        const payload = {
          step: 4,
          employeeId: (isEditMode || isWizard) ? id : employeeId,
          ...(isEditMode && { id: id, mode: "edit" }),
          paymentType:
            formData.paymentMethod === "bank_transfer"
              ? "bank"
              : formData.paymentMethod,
          ...(formData.paymentMethod === "bank_transfer" && {
            name: formData.accountHolderName,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifsc: formData.ifscCode,
            type: formData.accountType,
          }),
        };
        setIsLoading(true);
        setIsSubmitting(true);
        dispatch(employeeAddRequest(payload));
        if (isEditMode) return;
        // Navigation and submit state will be handled by the useEffect after successful API callback
      }
    } catch (validationErr: any) {
      const newErrors: Record<string, string> = {};
      if (validationErr.inner) {
        validationErr.inner.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
      }
      setErrors(newErrors);
    }
  }, [
    currentStep,
    validationSchema,
    formData,
    dispatch,
    navigate,
    employeeId,
    isSalaryReview,
    isEditMode,
    id,
    salaryEarningList,
    isWizard
  ]);


  const handleChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (field === "pan") {
        setErrors((prev) => {
          const newErrors = { ...prev };
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

          if (value && value.length > 0) {
            if (value.length < 10) {
              newErrors.pan = "Invalid PAN Number (e.g., ABCDE1234F)";
            } else if (!panRegex.test(value)) {
              newErrors.pan = "Invalid PAN Number (e.g., ABCDE1234F)";
            } else {
              delete newErrors.pan;
            }
          } else {
            delete newErrors.pan;
          }
          return newErrors;
        });
      } else if (errors[field]) {
        // Clear error for this field
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const handleDeptAdded = useCallback(() => {
    // The new department is added to the beginning of the list
    if (departmentList && departmentList.length > 0) {
      handleChange("departmentId", departmentList[0]._id);
    }
  }, [departmentList, handleChange]);

  const handleDesigAdded = useCallback(() => {
    // The new designation is added to the beginning of the list
    if (designationList && designationList.length > 0) {
      handleChange("designationId", designationList[0]._id);
    }
  }, [designationList, handleChange]);

  // Salary Calculation Effect
  useEffect(() => {
    if (formData.annualCTC) {
      const ctc = parseFloat(formData.annualCTC) || 0;
      const basic = ctc * 0.5; // 50% of CTC
      const fixed = ctc - basic;

      setFormData((prev) => {
        // Only update if changed to avoid loops
        if (prev.basicSalary !== basic.toString() || prev.fixedAllowance !== fixed.toString()) {
          return {
            ...prev,
            basicSalary: basic.toString(),
            fixedAllowance: fixed.toString(),
          };
        }
        return prev;
      });
    }
  }, [formData.annualCTC]);

  // Set default basic earning if salaryEarningList loads and nothing is explicitly selected
  useEffect(() => {
    if (salaryEarningList && salaryEarningList.length > 0) {
      setFormData((prev) => {
        const basicEarning = prev.earnings.find((e: EarningItem) => e.id === "basic");
        if (basicEarning && basicEarning.name === "Basic") {
          const defaultBasic = salaryEarningList.find((item: any) => item?.earningId?.name === "Basic");
          if (defaultBasic) {
            const updatedEarnings = prev.earnings?.map((e: EarningItem) =>
              e.id === "basic" ? { ...e, name: defaultBasic._id, value: defaultBasic.amount?.toString() || e.value } : e
            );
            return { ...prev, earnings: updatedEarnings };
          }
        }
        return prev;
      });
    }

  }, [salaryEarningList]);

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-800">
          Reviewing & Saving...
        </h2>
      </div>
    );
  }
  const departmentOptions = useMemo(
    () =>
      departmentList?.map((item) => ({
        label: item.name,
        value: item._id,
      })),
    [departmentList],
  );

  const designationOptions = useMemo(
    () =>
      designationList?.map((item) => ({
        label: item.name,
        value: item._id,
      })),
    [designationList],
  );

  const workLocationOptions = useMemo(
    () =>
      workLocations?.map((item) => ({
        label: item.name,
        value: item._id,
      })),
    [workLocations],
  );

  const genderOptions = useMemo(
    () => [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Others", value: "other" },
    ],
    [],
  );



  const handleOpenDeptModal = useCallback(() => {
    setDeptModalOpen(true);
  }, []);

  const handleOpenDesigModal = useCallback(() => {
    setDesigModalOpen(true);
  }, []);

  const handleCloseDeptModal = useCallback(() => {
    setDeptModalOpen(false);
  }, []);

  const handleCloseDesigModal = useCallback(() => {
    setDesigModalOpen(false);
  }, []);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;

      let finalValue = value;

      // Prevent spaces in employeeId
      if (name === "employeeId") {
        finalValue = value.replace(/\s/g, "");
      }

      // PAN → Uppercase
      if (name === "pan") {
        finalValue = value.toUpperCase();
      }

      // Allow only numbers (and leading '+' for phone)
      if (
        name === "phone" ||
        name === "adharNumber" ||
        name === "zipCode" ||
        name === "annualCTC" ||
        name === "basicSalary" ||
        name === "accountNumber" ||
        name === "reAccountNumber"
      ) {
        if (name === "phone") {
          // Allow leading '+', digits and spaces
          const cleanValue = value.replace(/[^\d+ ]/g, "");
          const plusCount = (cleanValue.match(/\+/g) || []).length;

          if (
            value !== cleanValue ||
            plusCount > 1 ||
            (plusCount === 1 && cleanValue.indexOf("+") !== 0)
          ) {
            return;
          }
          finalValue = cleanValue;
        } else {
          const numericValue = value.replace(/\D/g, "");
          if (value !== numericValue) {
            return;
          }
          finalValue = numericValue;
        }
      }

      // ❌ Prevent numbers in name-related fields
      if (
        name === "firstName" ||
        name === "middleName" ||
        name === "lastName" ||
        name === "fatherName" ||
        name === "accountHolderName" ||
        name === "bankName"
      ) {
        const noNumberValue = value.replace(/[0-9]/g, "");
        if (value !== noNumberValue) {
          return;
        }
        finalValue = noNumberValue;
      }

      if (type === "checkbox") {
        // Handle checkbox if needed
      } else {
        handleChange(name, finalValue);
      }
    },
    [handleChange],
  );

  const handleDesignationChange = useCallback(
    (val: string | number) => {
      handleChange("designationId", String(val));
    },
    [handleChange],
  );

  const handleDepartmentChange = useCallback(
    (val: string | number) => {
      handleChange("departmentId", String(val));
    },
    [handleChange],
  );

 

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          {isEditMode ? "Edit Employee" : "Add New Employee"}
        </h1>
        <p className="text-slate-500 mt-2">
          {isEditMode
            ? "Update employee details and information."
            : "Enter the details to onboard a new employee."}
        </p>
      </motion.div>

      {/* Stepper */}
      <div className="mb-8 md:mb-12 px-4 md:px-10">
        <div className="relative">
          <div className="absolute left-0 top-4 md:top-5 w-full h-1 bg-slate-100 rounded-full -z-10 overflow-hidden">
            <motion.div
              className="h-full bg-primary/20"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex justify-between w-full" >
            
          </div>
        </div>
      </div>

      {/* Form Content */}
      <Card className="min-h-[500px] overflow-visible relative">
        <div className="relative overflow-visible min-h-[400px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {currentStep === 1 && (
                <Step1BasicDetails
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  departmentOptions={departmentOptions}
                  designationOptions={designationOptions}
                  workLocationOptions={workLocationOptions}
                  genderOptions={genderOptions}
                  handleDesignationChange={handleDesignationChange}
                  handleDepartmentChange={handleDepartmentChange}
                  handleOpenDeptModal={handleOpenDeptModal}
                  handleOpenDesigModal={handleOpenDesigModal}
                  today={today}
                />
              )}

              {currentStep === 2 && !isSalaryReview && (
                <Step2SalaryDetails
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setFormData={setFormData}
                  setIsDisabled={setIsStepDisabled}
                  errors={errors}
                />
              )}

              {currentStep === 2 && isSalaryReview && (
                <Step2SalaryReview
                  formData={formData}
                  setIsSalaryReview={setIsSalaryReview}
                />
              )}

              {currentStep === 3 && (
                <Step3PersonalDetails
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  today={today}
                />
              )}

              {currentStep === 4 && (
                <Step4PaymentInfo
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleChange={handleChange}
                  errors={errors}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between">
          <div className="flex gap-3">
            <CustomButton
              onClick={handleNext}
              disabled={isStepDisabled || isLoading || isSubmitting}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {isEditMode
                ? "Save"
                : currentStep === 4
                  ? "Submit"
                  : "Save & Continue"}
            </CustomButton>
          </div>
        </div>
        <DepartmentModal
          isOpen={isDeptModalOpen}
          onClose={handleCloseDeptModal}
          onSuccess={handleDeptAdded}
        />
        <DesignationModal
          isOpen={isDesigModalOpen}
          onClose={handleCloseDesigModal}
          onSuccess={handleDesigAdded}
        />
      </Card>
    </div>
  );
};
export default React.memo(AddEmployee);
