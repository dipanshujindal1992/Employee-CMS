export interface PersonalDetailFormData {
  dob: string;
  age: string | number;
  fatherName: string;
  pan: string;
  differentlyAbled: string;
  email: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  pinCode: string;

  professionalTax: 
  boolean;
  portalAccess: boolean;
  department: string;
  designation: string;
  workLocation: string;
  gender: string;
  isDirector: boolean;
  mobileNumber: string;
  workEmail: string;
  dateOfJoining: string;
  employeeId: string;

  firstName: string;
  middleName?: string;
  lastName: string;
}

 export interface SalaryDetailFormData {
  fixedAllowance?: number;
  bonus?: number;
  commission?: number;
  leaveEncashment?: number;
  gratuity?: number;
  overtimeAllowance?: number;
  noticePay?: number;
  holdSalary?: number;
  amount?: string;
  percentage?: string; 
  namePaySlip:string,
  earningName:string,
  earningType:string,
   scheduledEarning?:boolean
   active?:boolean
   calculationType?:string
}

export interface FormDataError{
    namePaySlipError: string
    earningNameError:string
    amountError: string
    percentageError:string
}

export interface Designation {
  _id: string;
  name: string;
  email?: string;
  employeeCount?: number;
}
