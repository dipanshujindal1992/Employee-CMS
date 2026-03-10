export const Data = [
  {
    id: 1,
    year: 2016,
    userGain: 80000,
    userLost: 823,
  },
  {
    id: 2,
    year: 2017,
    userGain: 45677,
    userLost: 345,
  },
  {
    id: 3,
    year: 2018,
    userGain: 78888,
    userLost: 555,
  },
  {
    id: 4,
    year: 2019,
    userGain: 90000,
    userLost: 4555,
  },
  {
    id: 5,
    year: 2020,
    userGain: 4300,
    userLost: 234,
  },
];


export const SALARY_CHECKBOX_OPTIONS = [
  {
    label:
      "Make this earning a part of the employee's salary structure",
    checked: true,
  },
  {
    label: "This is a taxable earning",
    subText:
      "The income tax amount will be divided equally and deducted every month across the financial year.",
    checked: true,
  },
  {
    label: "Calculate on pro-rata basis",
    subText:
      "Pay will be adjusted based on employee working days.",
    checked: true,
  },
];

export const EXTRA_OPTIONS = [
  { label: "Consider for ESI Contribution", checked: true },
  { label: "Show this component in payslip", checked: true },
];


export const SALARY_CHECKBOX_CONFIG = [
  {
    label:
      "Make this earning a part of the employee's salary structure",
    name: "isPartOfSalary",
  },
  {
    label: "This is a taxable earning",
    name: "isTaxable",
    subText:
      "The income tax amount will be divided equally and deducted every month across the financial year.",
  },
  {
    label: "Calculate on pro-rata basis",
    name: "isProrata",
    subText:
      "Pay will be adjusted based on employee working days.",
  },
];
