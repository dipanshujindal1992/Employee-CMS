
// We can use this file later in the project
// import React from 'react';
// import { Plus, X } from 'lucide-react';

// export interface InvoiceItem {
//   id: string;
//   description: string;
//   hsnSac: string;
//   qty: number;
//   rate: number;
//   sgst: number;
//   cgst: number;
//   cess: number;
//   amount: number;
// }

// interface InvoiceTableProps {
//   items: InvoiceItem[];
//   onItemsChange: (items: InvoiceItem[]) => void;
//   headers: {
//     description: string;
//     qty: string;
//     rate: string;
//     sgst: string;
//     cgst: string;
//     cess: string;
//     amount: string;
//     hsnSac: string;
//   };
//   onHeaderChange: (field: string, value: string) => void;
// }

// export const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
//   items, 
//   onItemsChange,
//   headers,
//   onHeaderChange
// }) => {
//   const calculateAmount = (item: Omit<InvoiceItem, 'amount'>) => {
//     const base = item.qty * item.rate;
//     const sgstAmt = (base * item.sgst) / 100;
//     const cgstAmt = (base * item.cgst) / 100;
//     const cessAmt = (base * item.cess) / 100;
//     return base + sgstAmt + cgstAmt + cessAmt;
//   };

//   const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
//     const newItems = items.map((item) => {
//       if (item.id === id) {
//         const updatedItem = { ...item, ...updates };
//         updatedItem.amount = calculateAmount(updatedItem);
//         return updatedItem;
//       }
//       return item;
//     });
//     onItemsChange(newItems);
//   };

//   const addItem = () => {
//     const newItem: InvoiceItem = {
//       id: Math.random().toString(36).substr(2, 9),
//       description: '',
//       hsnSac: '',
//       qty: 1,
//       rate: 0,
//       sgst: 0,
//       cgst: 0,
//       cess: 0,
//       amount: 0,
//     };
//     onItemsChange([...items, newItem]);
//   };

//   const removeItem = (id: string) => {
//     onItemsChange(items.filter((item) => item.id !== id));
//   };

//   return (
//     <div className="w-full">
//       <div className="overflow-x-auto pb-4 -mr-8 pr-8">
//         <table className="w-full text-left border-collapse min-w-[800px]">
//         <thead>
//           <tr className="bg-slate-900 text-white text-sm">
//             <th className="p-3 font-medium rounded-tl-lg">
//               <CustomInput
//                 className="bg-transparent border-none focus:ring-0 p-0 text-white font-medium w-full"
//                 value={headers.description}
//                 onChange={(e) => onHeaderChange("description", e.target.value)}
//               />
//             </th>
//             <th className="p-3 font-medium">
//               <CustomInput
//                 className="bg-transparent border-none focus:ring-0 p-0 text-white font-medium w-full"
//                 value={headers.qty}
//                 onChange={(e) => onHeaderChange("qty", e.target.value)}
//               />
//             </th>
//             <th className="p-3 font-medium">
//               <CustomInput
//                 className="bg-transparent border-none focus:ring-0 p-0 text-white font-medium w-full"
//                 value={headers.rate}
//                 onChange={(e) => onHeaderChange("rate", e.target.value)}
//               />
//             </th>
//             <th className="p-3 font-medium">
//               <CustomInput
//                 className="bg-transparent border-none focus:ring-0 p-0 text-white font-medium w-full"
//                 value={headers.sgst}
//                 onChange={(e) => onHeaderChange("sgst", e.target.value)}
//               />
//             </th>
//             <th className="p-3 font-medium">
//               <CustomInput
//                 className="bg-transparent border-none focus:ring-0 p-0 text-white font-medium w-full"
//                 value={headers.cgst}
//                 onChange={(e) => onHeaderChange("cgst", e.target.value)}
//               />
//             </th>
//             <th className="p-3 font-medium">
//               <CustomInput
//                 className="bg-transparent border-none focus:ring-0 p-0 text-white font-medium w-full"
//                 value={headers.cess}
//                 onChange={(e) => onHeaderChange("cess", e.target.value)}
//               />
//             </th>
//             <th className="p-3 font-medium rounded-tr-lg">
//               <CustomInput
//                 className="bg-transparent border-none focus:ring-0 p-0 text-white font-medium w-full"
//                 value={headers.amount}
//                 onChange={(e) => onHeaderChange("amount", e.target.value)}
//               />
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-200">
//           {items.map((item) => (
//             <tr key={item.id} className="group hover:bg-slate-50 transition-colors text-slate-800">
//               <td className="p-3 align-top min-w-[200px]">
//                 <textarea
//                   className="w-full bg-transparent border-none focus:ring-0 resize-none p-0 text-slate-800 placeholder:text-slate-400 overflow-hidden"
//                   placeholder="Enter item name/description"
//                   rows={1}
//                   value={item.description}
//                   onFocus={(e) => {
//                     e.target.style.height = 'auto';
//                     e.target.style.height = `${e.target.scrollHeight}px`;
//                   }}
//                   onChange={(e) => {
//                     e.target.style.height = 'auto';
//                     e.target.style.height = `${e.target.scrollHeight}px`;
//                     updateItem(item.id, { description: e.target.value });
//                   }}
//                 />
//                 <div className="mt-1 flex items-center gap-2">
//                   <CustomInput
//                     className="text-[10px] font-bold text-slate-400 uppercase bg-transparent border-none focus:ring-0 p-0 w-16"
//                     value={headers.hsnSac}
//                     onChange={(e) => onHeaderChange("hsnSac", e.target.value)}
//                   />
//                   <CustomInput
//                     className="text-xs bg-transparent border-none focus:ring-0 p-0 text-slate-500 w-24"
//                     placeholder="Enter HSN/SAC"
//                     value={item.hsnSac}
//                     onChange={(e) => updateItem(item.id, { hsnSac: e.target.value })}
//                   />
//                 </div>
//               </td>
//               <td className="p-3 align-top w-20">
//                 <CustomInput
//                   type="number"
//                   className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800"
//                   value={item.qty}
//                   onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
//                 />
//               </td>
//               <td className="p-3 align-top w-28">
//                 <CustomInput
//                   type="number"
//                   className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800"
//                   value={item.rate}
//                   onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
//                 />
//               </td>
//               <td className="p-3 align-top w-20">
//                 <div className="flex items-center gap-1">
//                   <CustomInput
//                     type="number"
//                     className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800"
//                     value={item.sgst}
//                     onChange={(e) => updateItem(item.id, { sgst: Number(e.target.value) })}
//                   />
//                   <span className="text-slate-400 text-xs">%</span>
//                 </div>
//               </td>
//               <td className="p-3 align-top w-20">
//                 <div className="flex items-center gap-1">
//                   <CustomInput
//                     type="number"
//                     className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800"
//                     value={item.cgst}
//                     onChange={(e) => updateItem(item.id, { cgst: Number(e.target.value) })}
//                   />
//                   <span className="text-slate-400 text-xs">%</span>
//                 </div>
//               </td>
//               <td className="p-3 align-top w-20">
//                 <div className="flex items-center gap-1">
//                   <CustomInput
//                     type="number"
//                     className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800"
//                     value={item.cess}
//                     onChange={(e) => updateItem(item.id, { cess: Number(e.target.value) })}
//                   />
//                   <span className="text-slate-400 text-xs">%</span>
//                 </div>
//               </td>
//               <td className="p-3 align-top w-32 relative">
//                 <div className="flex items-center justify-between">
//                   <span className="text-slate-800 font-medium">{item.amount.toFixed(2)}</span>
//                   <CustomButton
//                     onClick={() => removeItem(item.id)}
//                     className="opacity-0 group-hover:opacity-100 p-1.5 bg-white text-red-500 hover:bg-red-50 transition-all absolute -right-4 top-1/2 -translate-y-1/2 rounded-full shadow-md border border-red-100 z-10"
//                   >
//                     <X size={14} />
//                   </CustomButton>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//       <CustomButton
//         onClick={addItem}
//         className="mt-4 flex items-center gap-2 text-[#008df1] hover:text-[#0070c0] font-medium text-sm transition-colors py-2 px-3 rounded-lg hover:bg-blue-50"
//       >
//         <Plus size={18} />
//         Add Line Item
//       </CustomButton>
//     </div>
//   );
// };
