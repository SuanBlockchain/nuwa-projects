// 'use client';
// import { useState, useEffect } from 'react';
// import { Button } from "@/app/components/ui/button"

// export default function SimulateParamsForm({
//   projects,
// }: {
//     projects: string[];
// }) {
//   const [selectedProject, setSelectedProject] = useState<string[]>([]); // Array to hold multiple selections
//   const [projectOptions, setProjectOptions] = useState<string[]>([]);
// //   const [selectedYear, setSelectedYear] = useState<number>(5); // Default to 5 years
//   const [error, setError] = useState<string | null>(null); // State to hold error message

//   // Fetch species options from the database
//   useEffect(() => {
//     async function fetchSpecies() {
//       try {
//         const response = await fetch('/api/getSpecies');
//         if (!response.ok) {
//           throw new Error('Failed to fetch projects');
//         }

//         const projectList = await response.json();
//         setProjectOptions(projectList);
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       }
//     }

//     fetchSpecies();
//   }, []);

// const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedProject([event.target.value]);
// };

// //   const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
// //     setSelectedYear(Number(event.target.value)); // Update state with selected year
// //   };

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!selectedProject) {
//       setError('Please select at least one species.');
//       return;
//     }
//     // if (!selectedYear) {
//     //   setError('Please select a year.');
//     //   return;
//     // }
//     setError(null);
//     onSubmit(selectedProject, selectedYear);
//   };

//   return (
//     <div className="grid gap-6 p-4">
//       <div className="grid gap-6 p-4 rounded-md border bg-gray-50 dark:bg-zinc-900">
//         <form onSubmit={handleSubmit} className="mb-8">
//           <div className="rounded-md bg-gray-50 p-4 md:p-6 dark:bg-zinc-900">
//             <div className="mb-4">
//               <label htmlFor="species" className="mb-2 block text-sm font-medium">
//                 Select Project
//               </label>
//               <select
//                 id="species"
//                 name="species"
//                 className="block w-full rounded-md border py-2 pl-3 pr-10 text-sm focus:ring-2"
//                 value={selectedProject} // Bind to array state
//                 onChange={handleProjectChange} // Update state on selection
//               >
//                 {speciesOptions.map((species) => (
//                   <option key={species} value={species}>
//                     {species}
//                   </option>
//                 ))}
//               </select>
//               <p className="mt-2 text-sm text-gray-500">Hold CTRL (or CMD) to select multiple options.</p>
//             </div>

//             <div className="mb-4">
//               <label htmlFor="year" className="mb-2 block text-sm font-medium">
//                 Select Year
//               </label>
//               <select
//                 id="year"
//                 name="year"
//                 className="block w-full rounded-md border py-2 pl-3 pr-10 text-sm focus:ring-2"
//                 value={selectedYear} // Bind to state
//                 onChange={handleYearChange} // Update state on selection
//               >
//                 {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((year) => (
//                   <option key={year} value={year}>
//                     {year} years
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message if any */}
//             <div className="mt-6 flex justify-end gap-4">
//               <Button variant="destructive" type="submit"
//                 className="bg-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white rounded-md border px-3 py-2 text-sm font-medium"
//               >
//                 Generate trend
//               </Button>
//             </div>
//           </div>
//         </form>

//       </div>

//     </div>
//   );
// }
