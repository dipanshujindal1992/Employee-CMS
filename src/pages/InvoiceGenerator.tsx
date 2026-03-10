
// We can use this file later in the project

// import React, { useState, useRef, useMemo, useCallback } from "react";
// import { motion } from "framer-motion";
// import { Upload, ChevronDown, Download, Send, Monitor } from "lucide-react";
// import { InvoiceTable } from "../components/invoice/InvoiceTable";
// import type { InvoiceItem } from "../components/invoice/InvoiceTable";
// import { Input } from "../components/common/Input";

// import { currencies } from "../utils/commonData";
// const AutoExpandingTextarea: React.FC<
//   React.TextareaHTMLAttributes<HTMLTextAreaElement>
// > = ({ className, ...props }) => {
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const adjustHeight = () => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = `${textarea.scrollHeight}px`;
//     }
//   };

//   React.useEffect(() => {
//     adjustHeight();
//   }, [props.value, props.defaultValue]);

//   return (
//     <textarea
//       ref={textareaRef}
//       rows={1}
//       onChange={(e) => {
//         adjustHeight();
//         props.onChange?.(e);
//       }}
//       className={`resize-none overflow-hidden ${className}`}
//       {...props}
//     />
//   );
// };

// export const InvoiceGenerator: React.FC = () => {
//   const [logo, setLogo] = useState<{ preview: string; file: File } | null>(
//     null,
//   );
//   const [qrCode, setQrCode] = useState<{ preview: string; file: File } | null>(
//     null,
//   );
//   const [items, setItems] = useState<InvoiceItem[]>([
//     {
//       id: "1",
//       description: "Brochure Design",
//       hsnSac: "",
//       qty: 2,
//       rate: 100,
//       sgst: 6,
//       cgst: 6,
//       cess: 0,
//       amount: 224,
//     },
//   ]);

//   const [formData, setFormData] = useState({
//     companyName: "",
//     senderName: "",
//     senderGstin: "",
//     senderAddress: "",
//     senderCity: "",
//     invoiceTitle: "Tax Invoice",
//     invoiceNumber: "INV-12",
//     invoiceDate: new Date().toISOString().split("T")[0],
//     dueDate: new Date().toISOString().split("T")[0],
//     clientCompany: "",
//     clientGstin: "",
//     clientAddress: "",
//     clientCity: "",
//     placeOfSupply: "State",
//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     beneficiaryName: "",
//     notes: "It was great doing business with you.",
//     terms: "Please make the payment by the due date.",
//     invoiceNumberLabel: "Invoice#",
//     invoiceDateLabel: "Invoice Date",
//     dueDateLabel: "Due Date",
//     currency: "INR",
//     headerDescription: "Item Description",
//     headerQty: "Qty",
//     headerRate: "Rate",
//     headerSgst: "SGST",
//     headerCgst: "CGST",
//     headerCess: "Cess",
//     headerAmount: "Amount",
//     hsnSacLabel: "HSN/SAC",
//   });

  

//   const currentCurrency = useMemo(
//     () => currencies.find((c) => c.code === formData.currency) || currencies[0],
//     [formData.currency],
//   );

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const validateFields = useCallback(() => {
//     const newErrors: { [key: string]: string } = {};
//     if (!formData.companyName)
//       newErrors.companyName = "Please fill in your company's name";
//     if (!formData.clientCompany)
//       newErrors.clientCompany =
//         "Please fill in your client's name or their company name";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData.companyName, formData.clientCompany]);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const qrInputRef = useRef<HTMLInputElement>(null);

//   const handleInputChange = useCallback(
//     (field: keyof typeof formData, value: string) => {
//       setFormData((prev) => ({ ...prev, [field]: value }));
//     },
//     [],
//   );

//   const handleImageUpload = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "qr") => {
//       const file = e.target.files?.[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const imageData = {
//             preview: reader.result as string,
//             file: file,
//           };
//           if (type === "logo") setLogo(imageData);
//           else setQrCode(imageData);
//         };
//         reader.readAsDataURL(file);
//       }
//     },
//     [],
//   );

//   const subTotal = useMemo(
//     () => items.reduce((sum, item) => sum + item.qty * item.rate, 0),
//     [items],
//   );

//   const totalSGST = useMemo(
//     () =>
//       items.reduce(
//         (sum, item) => sum + (item.qty * item.rate * item.sgst) / 100,
//         0,
//       ),
//     [items],
//   );

//   const totalCGST = useMemo(
//     () =>
//       items.reduce(
//         (sum, item) => sum + (item.qty * item.rate * item.cgst) / 100,
//         0,
//       ),
//     [items],
//   );

//   const totalCess = useMemo(
//     () =>
//       items.reduce(
//         (sum, item) => sum + (item.qty * item.rate * item.cess) / 100,
//         0,
//       ),
//     [items],
//   );

//   const total = useMemo(
//     () => subTotal + totalSGST + totalCGST + totalCess,
//     [subTotal, totalSGST, totalCGST, totalCess],
//   );

//   const handleSaveAndSend = useCallback(() => {
//     if (!validateFields()) {
//       return;
//     }

//     const payload = {
//       title: formData.invoiceTitle,
//       company_name: formData.companyName,
//       user_name: formData.senderName,
//       company_address_1: formData.senderAddress,
//       company_address_2: formData.senderCity,
//       company_state: "", // Could be parsed from address/city if needed
//       company_country: "India",
//       bill_to_label: "Bill To",
//       customer_name: formData.clientCompany,
//       customer_billing_address_1: formData.clientAddress,
//       customer_billing_address_2: formData.clientCity,
//       customer_billing_state: "",
//       customer_billing_country: "India",
//       invoice_number_label: formData.invoiceNumberLabel,
//       invoice_number: formData.invoiceNumber,
//       invoice_date_label: formData.invoiceDateLabel,
//       invoice_date: formData.invoiceDate,
//       due_date_label: formData.dueDateLabel,
//       due_date: formData.dueDate,
//       place_of_supply: formData.placeOfSupply,
//       template_type: "excel",
//       item_table_color: "000",
//       line_items_header: {
//         name: formData.headerDescription,
//         hsn_sac_label: formData.hsnSacLabel,
//         quantity: formData.headerQty,
//         rate: formData.headerRate,
//         tax1_name: formData.headerSgst,
//         tax2_name: formData.headerCgst,
//         tax3_name: formData.headerCess,
//         amount: formData.headerAmount,
//       },
//       line_items: items.map((item) => ({
//         name: item.description,
//         hsn_sac_value: item.hsnSac,
//         quantity: item.qty.toString(),
//         rate: item.rate.toFixed(2),
//         tax1: item.sgst.toString(),
//         tax1_amount: ((item.qty * item.rate * item.sgst) / 100).toFixed(2),
//         tax2: item.cgst.toString(),
//         tax2_amount: ((item.qty * item.rate * item.cgst) / 100).toFixed(2),
//         tax3: item.cess.toString(),
//         tax3_amount: ((item.qty * item.rate * item.cess) / 100).toFixed(2),
//         amount: (item.qty * item.rate).toFixed(2),
//       })),
//       sub_total_label: "Sub Total",
//       taxes: [
//         { tax_name: `SGST (6%)`, tax: totalSGST.toFixed(2) },
//         { tax_name: `CGST (6%)`, tax: totalCGST.toFixed(2) },
//       ],
//       total_label: "TOTAL",
//       currency_code: "INR",
//       currency_symbol: "Rs.",
//       notes_label: "Notes",
//       notes: formData.notes,
//       terms_and_conditions_label: "Terms & Conditions",
//       terms_and_conditions: formData.terms,
//       sub_total: subTotal.toFixed(2),
//       total: total.toFixed(2),
//       total_formatted: total.toFixed(2),
//     };

//     const data = new FormData();
//     data.append("payload", JSON.stringify(payload));

//     // Append raw binary files if available
//     if (logo?.file) data.append("logo", logo.file);
//     if (qrCode?.file) data.append("qrCode", qrCode.file);

//     // Demonstration: Log entries to verify binary files
//     for (let [key, value] of data.entries()) {
//       console.log(key, value);
//     }

//     // Reset form fields after generation
//     setLogo(null);
//     setQrCode(null);
//     setItems([
//       {
//         id: "1",
//         description: "",
//         hsnSac: "",
//         qty: 1,
//         rate: 0,
//         sgst: 0,
//         cgst: 0,
//         cess: 0,
//         amount: 0,
//       },
//     ]);
//     setFormData({
//       companyName: "",
//       senderName: "",
//       senderGstin: "",
//       senderAddress: "",
//       senderCity: "",
//       invoiceTitle: "Tax Invoice",
//       invoiceNumber: "",
//       invoiceDate: new Date().toISOString().split("T")[0],
//       dueDate: new Date().toISOString().split("T")[0],
//       clientCompany: "",
//       clientGstin: "",
//       clientAddress: "",
//       clientCity: "",
//       placeOfSupply: "State",
//       bankName: "",
//       accountNumber: "",
//       ifscCode: "",
//       beneficiaryName: "",
//       notes: "It was great doing business with you.",
//       terms: "Please make the payment by the due date.",
//       invoiceNumberLabel: "Invoice#",
//       invoiceDateLabel: "Invoice Date",
//       dueDateLabel: "Due Date",
//       currency: "INR",
//       headerDescription: "Item Description",
//       headerQty: "Qty",
//       headerRate: "Rate",
//       headerSgst: "SGST",
//       headerCgst: "CGST",
//       headerCess: "Cess",
//       headerAmount: "Amount",
//       hsnSacLabel: "HSN/SAC",
//     });
//     setErrors({});

//     return data;
//   }, [
//     validateFields,
//     formData,
//     items,
//     totalSGST,
//     totalCGST,
//     subTotal,
//     total,
//     logo,
//     qrCode,
//   ]);

//   return (
//     <div className="w-full max-w-7xl mx-auto pb-12">
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-2 text-slate-500">
//           <Monitor size={18} />
//           <span className="text-lg font-medium">Invoice Generator</span>
//           <span className="text-sm text-slate-400 ml-2">
//             by Try Digital Invoice
//           </span>
//         </div>
//       </div>

//       <div className="flex flex-col xl:flex-row gap-8">
//         {/* Main Invoice Document */}
//         <div className="flex-1">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
//           >
//             <div className="p-8 lg:p-12">
//               {/* Invoice Header */}
//               <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
//                 <div className="w-full md:w-1/2">
//                   <div
//                     onClick={() => fileInputRef.current?.click()}
//                     className="w-48 h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#008df1] hover:bg-blue-50 transition-all group overflow-hidden relative"
//                   >
//                     {logo ? (
//                       <img
//                         src={logo.preview}
//                         alt="Logo"
//                         className="w-full h-full object-contain p-2"
//                       />
//                     ) : (
//                       <>
//                         <div className="p-3 bg-blue-50 text-[#008df1] rounded-full mb-2 group-hover:scale-110 transition-transform">
//                           <Upload size={20} />
//                         </div>
//                         <span className="text-sm font-semibold text-[#008df1]">
//                           Upload Logo
//                         </span>
//                         <span className="text-[10px] text-slate-400 mt-1">
//                           240 x 240 pixels @ 72 DPI
//                         </span>
//                         <span className="text-[10px] text-slate-400">
//                           Maximum size of 1MB
//                         </span>
//                       </>
//                     )}
//                     <CustomInput
//                       type="file"
//                       ref={fileInputRef}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={(e) => handleImageUpload(e, "logo")}
//                     />
//                   </div>

//                   <div className="mt-8 space-y-3">
//                     <AutoExpandingTextarea
//                       className={`block w-full text-sm font-medium border-none p-0 focus:ring-0 placeholder:text-slate-300 ${errors.companyName ? "text-red-500" : ""}`}
//                       placeholder="Your Company"
//                       value={formData.companyName}
//                       onChange={(e) =>
//                         handleInputChange("companyName", e.target.value)
//                       }
//                     />
//                     {errors.companyName && (
//                       <span className="text-xs text-red-500 block -mt-1">
//                         {errors.companyName}
//                       </span>
//                     )}
//                     <AutoExpandingTextarea
//                       className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                       placeholder="Your Name"
//                       value={formData.senderName}
//                       onChange={(e) =>
//                         handleInputChange("senderName", e.target.value)
//                       }
//                     />
//                     <AutoExpandingTextarea
//                       className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                       placeholder="Company's GSTIN"
//                       value={formData.senderGstin}
//                       onChange={(e) =>
//                         handleInputChange("senderGstin", e.target.value)
//                       }
//                     />
//                     <AutoExpandingTextarea
//                       className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                       placeholder="Company's Address"
//                       value={formData.senderAddress}
//                       onChange={(e) =>
//                         handleInputChange("senderAddress", e.target.value)
//                       }
//                     />
//                     <AutoExpandingTextarea
//                       className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                       placeholder="City, State, India"
//                       value={formData.senderCity}
//                       onChange={(e) =>
//                         handleInputChange("senderCity", e.target.value)
//                       }
//                     />
//                   </div>
//                 </div>

//                 <div className="w-full md:text-right">
//                   <AutoExpandingTextarea
//                     className="text-3xl lg:text-5xl font-light text-slate-400 uppercase tracking-widest mb-8 md:mb-12 text-right w-full block border-none p-0 focus:ring-0 bg-transparent"
//                     value={formData.invoiceTitle}
//                     onChange={(e) =>
//                       handleInputChange("invoiceTitle", e.target.value)
//                     }
//                   />
//                   <div className="space-y-4 inline-block text-left w-full md:w-64">
//                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
//                       <AutoExpandingTextarea
//                         className="text-xs text-slate-400 font-semibold uppercase border-none p-0 focus:ring-0 bg-transparent w-24"
//                         value={formData.invoiceNumberLabel}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "invoiceNumberLabel",
//                             e.target.value,
//                           )
//                         }
//                       />
//                       <AutoExpandingTextarea
//                         className="text-sm font-medium border-none p-0 focus:ring-0 text-right w-32"
//                         value={formData.invoiceNumber}
//                         onChange={(e) =>
//                           handleInputChange("invoiceNumber", e.target.value)
//                         }
//                       />
//                     </div>
//                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
//                       <AutoExpandingTextarea
//                         className="text-xs text-slate-400 font-semibold uppercase border-none p-0 focus:ring-0 bg-transparent w-28"
//                         value={formData.invoiceDateLabel}
//                         onChange={(e) =>
//                           handleInputChange("invoiceDateLabel", e.target.value)
//                         }
//                       />
//                       <CustomInput
//                         type="date"
//                         className="text-sm border-none p-0 focus:ring-0 text-right w-36"
//                         value={formData.invoiceDate}
//                         onChange={(e) =>
//                           handleInputChange("invoiceDate", e.target.value)
//                         }
//                       />
//                     </div>
//                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
//                       <AutoExpandingTextarea
//                         className="text-xs text-slate-400 font-semibold uppercase border-none p-0 focus:ring-0 bg-transparent w-24"
//                         value={formData.dueDateLabel}
//                         onChange={(e) =>
//                           handleInputChange("dueDateLabel", e.target.value)
//                         }
//                       />
//                       <CustomInput
//                         type="date"
//                         className="text-sm border-none p-0 focus:ring-0 text-right w-36"
//                         value={formData.dueDate}
//                         onChange={(e) =>
//                           handleInputChange("dueDate", e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Client Details */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
//                 <div className="space-y-3">
//                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
//                     Bill To
//                   </div>
//                   <AutoExpandingTextarea
//                     className={`block w-full text-sm font-medium border-none p-0 focus:ring-0 placeholder:text-slate-300 ${errors.clientCompany ? "text-red-500" : ""}`}
//                     placeholder="Your Client's Company"
//                     value={formData.clientCompany}
//                     onChange={(e) =>
//                       handleInputChange("clientCompany", e.target.value)
//                     }
//                   />
//                   {errors.clientCompany && (
//                     <span className="text-xs text-red-500 block -mt-1">
//                       {errors.clientCompany}
//                     </span>
//                   )}
//                   <AutoExpandingTextarea
//                     className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                     placeholder="Client's GSTIN"
//                     value={formData.clientGstin}
//                     onChange={(e) =>
//                       handleInputChange("clientGstin", e.target.value)
//                     }
//                   />
//                   <AutoExpandingTextarea
//                     className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                     placeholder="Client's Address"
//                     value={formData.clientAddress}
//                     onChange={(e) =>
//                       handleInputChange("clientAddress", e.target.value)
//                     }
//                   />
//                   <AutoExpandingTextarea
//                     className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                     placeholder="City, State, India"
//                     value={formData.clientCity}
//                     onChange={(e) =>
//                       handleInputChange("clientCity", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="flex flex-col justify-end">
//                   <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
//                     <span className="text-xs text-slate-400 font-semibold uppercase">
//                       Place Of Supply:
//                     </span>
//                     <AutoExpandingTextarea
//                       className="text-sm border-none p-0 focus:ring-0 text-slate-500 font-medium"
//                       value={formData.placeOfSupply}
//                       onChange={(e) =>
//                         handleInputChange("placeOfSupply", e.target.value)
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Item Table */}
//               <InvoiceTable
//                 items={items}
//                 onItemsChange={setItems}
//                 headers={{
//                   description: formData.headerDescription,
//                   qty: formData.headerQty,
//                   rate: formData.headerRate,
//                   sgst: formData.headerSgst,
//                   cgst: formData.headerCgst,
//                   cess: formData.headerCess,
//                   amount: formData.headerAmount,
//                   hsnSac: formData.hsnSacLabel,
//                 }}
//                 onHeaderChange={(field: string, value: string) => {
//                   const mapping: { [key: string]: keyof typeof formData } = {
//                     description: "headerDescription",
//                     qty: "headerQty",
//                     rate: "headerRate",
//                     sgst: "headerSgst",
//                     cgst: "headerCgst",
//                     cess: "headerCess",
//                     amount: "headerAmount",
//                     hsnSac: "hsnSacLabel",
//                   };
//                   handleInputChange(mapping[field], value);
//                 }}
//               />

//               {/* Totals Section */}
//               <div className="mt-12 flex justify-end">
//                 <div className="w-full md:w-80 space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
//                   <div className="flex justify-between text-sm text-slate-500">
//                     <span>Sub Total</span>
//                     <span>{subTotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-slate-500">
//                     <span>SGST (6%)</span>
//                     <span>{totalSGST.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-slate-500 border-b border-slate-200 pb-3">
//                     <span>CGST (6%)</span>
//                     <span>{totalCGST.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-slate-100">
//                     <span className="font-bold text-slate-700 uppercase tracking-wider text-xs">
//                       Total
//                     </span>
//                     <div className="flex items-center gap-2">
//                       <CustomSelectbox
//                         value={formData.currency}
//                         onChange={(e) =>
//                           handleInputChange("currency", e.target.value)
//                         }
//                         className="text-xs border-none bg-transparent focus:ring-0 p-0 text-slate-500 font-medium cursor-pointer"
//                       >
//                         {currencies.map((c) => (
//                           <option key={c.code} value={c.code}>
//                             {c.code} - {c.symbol}
//                           </option>
//                         ))}
//                       </CustomSelectbox>
//                       <span className="text-xl font-bold text-slate-900">
//                         {currentCurrency.symbol} {total.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12 mt-8">
//                 <div className="w-full md:w-1/2 space-y-3">
//                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
//                     Bank Details
//                   </div>
//                   <AutoExpandingTextarea
//                     className="block w-full text-sm font-medium border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                     placeholder="Bank Name"
//                     value={formData.bankName}
//                     onChange={(e) =>
//                       handleInputChange("bankName", e.target.value)
//                     }
//                   />
//                   <AutoExpandingTextarea
//                     className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                     placeholder="Bank Account Number"
//                     value={formData.accountNumber}
//                     onChange={(e) =>
//                       handleInputChange("accountNumber", e.target.value)
//                     }
//                   />
//                   <AutoExpandingTextarea
//                     className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                     placeholder="IFSC Code"
//                     value={formData.ifscCode}
//                     onChange={(e) =>
//                       handleInputChange("ifscCode", e.target.value)
//                     }
//                   />
//                   <AutoExpandingTextarea
//                     className="block w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                     placeholder="Beneficary Name"
//                     value={formData.beneficiaryName}
//                     onChange={(e) =>
//                       handleInputChange("beneficiaryName", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="w-full md:w-80 flex flex-col items-end">
//                   <div
//                     onClick={() => qrInputRef.current?.click()}
//                     className="w-48 h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#008df1] hover:bg-blue-50 transition-all group overflow-hidden relative"
//                   >
//                     {qrCode ? (
//                       <img
//                         src={qrCode.preview}
//                         alt="QR Code"
//                         className="w-full h-full object-contain p-2"
//                       />
//                     ) : (
//                       <>
//                         <div className="p-3 bg-blue-50 text-[#008df1] rounded-full mb-2 group-hover:scale-110 transition-transform">
//                           <Upload size={20} />
//                         </div>
//                         <span className="text-sm font-semibold text-[#008df1]">
//                           Upload QR Code
//                         </span>
//                         <span className="text-[10px] text-slate-400 mt-1">
//                           240 x 240 pixels @ 72 DPI
//                         </span>
//                         <span className="text-[10px] text-slate-400">
//                           Maximum size of 1MB
//                         </span>
//                       </>
//                     )}
//                     <CustomInput
//                       type="file"
//                       ref={qrInputRef}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={(e) => handleImageUpload(e, "qr")}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Notes and Terms */}
//               <div className="mt-12 grid grid-cols-1 gap-8">
//                 <div>
//                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
//                     Notes
//                   </div>
//                   <AutoExpandingTextarea
//                     className="w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                     placeholder="It was great doing business with you."
//                     value={formData.notes}
//                     onChange={(e) => handleInputChange("notes", e.target.value)}
//                   />
//                 </div>
//                 <div>
//                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
//                     Terms & Conditions
//                   </div>
//                   <AutoExpandingTextarea
//                     className="w-full text-sm border-none p-0 focus:ring-0 placeholder:text-slate-300"
//                     placeholder="Please make the payment by the due date."
//                     value={formData.terms}
//                     onChange={(e) => handleInputChange("terms", e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Right Controls Panel */}
//         <aside className="w-full xl:w-80 space-y-8">
//           <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
//             <h2 className="text-xl font-bold text-slate-800 mb-8">
//               Download Invoice
//             </h2>

//             <div className="space-y-8">
//               {/* <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">
//                   Theme
//                 </label>
//                 <div className="flex flex-wrap gap-3">
//                   {["#f97316", "#22c55e", "#3b82f6", "#0f172a", "#ef4444"].map(
//                     (color) => (
//                       <CustomButton
//                         key={color}
//                         className={`w-6 h-6 rounded-full transition-transform hover:scale-125 ${theme === color ? "ring-2 ring-offset-2 ring-slate-400" : ""}`}
//                         style={{ backgroundColor: color }}
//                         onClick={() => setTheme(color)}
//                       />
//                     ),
//                   )}
//                 </div>
//               </div> */}

//               {/* <div>
//                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Template</label>
//                 <div className="grid grid-cols-2 gap-4">
//                   {[
//                     { id: 'standard', label: 'Standard' },
//                     { id: 'spreadsheet', label: 'Spreadsheet' },
//                     { id: 'compact', label: 'Compact' },
//                     { id: 'custom', label: '+80 more templates' },
//                   ].map((temp) => (
//                     <div 
//                       key={temp.id}
//                       onClick={() => setTemplate(temp.id)}
//                       className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex flex-col items-center gap-2 ${template === temp.id ? 'border-[#008df1] bg-blue-50/50 shadow-inner' : 'border-slate-100 hover:border-slate-200'}`}
//                     >
//                       <div className="w-12 h-16 bg-white border border-slate-200 rounded flex flex-col gap-1 p-1">
//                         <div className="w-3 h-1 bg-slate-100" />
//                         <div className="w-full flex-1 bg-slate-50" />
//                       </div>
//                       <span className="text-[10px] font-semibold text-slate-600 truncate w-full text-center">{temp.label}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div> */}

//               {/* <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
//                 <div className="flex gap-2 text-[#008df1]">
//                   <FileText size={16} />
//                   <p className="text-[11px] leading-relaxed">
//                     Save your invoices securely on the cloud. <a href="#" className="font-bold underline">Try it now</a>
//                   </p>
//                 </div>
//               </div> */}

//               <div className="space-y-3 pt-4 border-t border-slate-100">
//                 {/* <CustomButton
//                   onClick={handleSaveAndSend}
//                   className="w-full py-4 bg-[#008df1] hover:bg-[#0070c0] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
//                 >
//                   <Send size={18} />
//                   Save and Send
//                 </CustomButton> */}
//                 <div className="flex gap-2">
//                   <CustomButton 
//                   onClick={handleSaveAndSend}
//                   className="flex-1 py-4 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
//                     <Download size={18} />
//                     Download
//                   </CustomButton>
//                   {/* <CustomButton className="p-4 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all active:scale-95">
//                     <ChevronDown size={18} />
//                   </CustomButton> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// };
