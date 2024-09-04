// import React, { useState } from 'react';
// import maintenanceData from '../../maintenanceData.json'; // Adjust the path if necessary

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value.toLowerCase());
//   };

//   const filteredResults = maintenanceData.maintenanceTypes
//     .map((category) => {
//       const matchingTasks = category.tasks.filter((task) =>
//         task.toLowerCase().includes(searchTerm)
//       );

//       if (matchingTasks.length > 0) {
//         return {
//           category: category.category,
//           tasks: matchingTasks,
//         };
//       }
//       return null;
//     })
//     .filter((result) => result !== null);

//   return (
//     <div className="">
//       <input
//         type="text"
//         placeholder="Search maintenance tasks..."
//         onChange={handleSearch}
//         className="border p-2 rounded w-full"
//       />
//       <div className="mt-4 ">
//         {filteredResults.length > 0 ? (
//           filteredResults.map((result, index) => (
//             <div key={index} className="mb-4">
//               <h3 className="text-lg font-bold">{result.category}</h3>
//               <ul className="list-disc pl-5">
//                 {result.tasks.map((task, idx) => (
//                   <li key={idx} className="text-gray-700">
//                     {task}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         ) : (
//           <p>No results found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchBar;
