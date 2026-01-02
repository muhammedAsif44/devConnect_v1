// import React from "react";
// export default function PremiumPlansModal({ onClose }) {
//   // Example plan data
//   const plans = [
//     { name: "Monthly", price: 499, duration: "1 Month" },
//     { name: "Quarterly", price: 1299, duration: "3 Months" },
//     { name: "Yearly", price: 3999, duration: "12 Months" }
//   ];
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg p-8 w-[400px]">
//         <h2 className="text-lg font-bold mb-4 text-gray-800">Choose Your Premium Plan</h2>
//         <ul className="space-y-4">
//           {plans.map(plan => (
//             <li key={plan.name} className="flex justify-between items-center border-b pb-2">
//               <div>
//                 <div className="font-semibold">{plan.name}</div>
//                 <div className="text-gray-500 text-xs">{plan.duration}</div>
//               </div>
//               <button
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded"
//                 onClick={() => handlePayment(plan)}
//               >
//                 Buy ₹{plan.price}
//               </button>
//             </li>
//           ))}
//         </ul>
//         <button onClick={onClose} className="mt-6 w-full text-gray-600 border border-gray-300 rounded py-2">Close</button>
//       </div>
//     </div>
//   );
//   // Define handlePayment to trigger your Razorpay/Stripe payment flow.
// }
