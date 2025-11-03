// import React from "react";
// import { Grid, List, ChevronDown } from "lucide-react";

// interface EnhancedSortProps {
//   sortBy: string;
//   onSortChange: (value: string) => void;
//   viewMode: "grid" | "list";
//   onViewModeChange: (mode: "grid" | "list") => void;
//   productCount?: number;
// }

// const Sort: React.FC<EnhancedSortProps> = ({
//   sortBy,
//   onSortChange,
//   viewMode,
//   onViewModeChange,
//   productCount,
// }) => {
//   const sortOptions = [
//     { value: "featured", label: "Featured" },
//     { value: "newest", label: "Newest First" },
//     { value: "price-low", label: "Price: Low to High" },
//     { value: "price-high", label: "Price: High to Low" },
//     { value: "rating", label: "Highest Rated" },
//     { value: "name-asc", label: "Name: A to Z" },
//     { value: "name-desc", label: "Name: Z to A" },
//   ];

//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white border border-gray-200 rounded-lg gap-4">
//       {/* Left Section - Product Count */}
//       {productCount !== undefined && (
//         <div className="text-sm text-gray-600">
//           <span className="font-medium">{productCount}</span> products found
//         </div>
//       )}

//       {/* Right Section - Controls */}
//       <div className="flex items-center gap-4">
//         {/* View Mode Toggle */}
//         <div className="flex border border-gray-300 rounded-md overflow-hidden">
//           <button
//             onClick={() => onViewModeChange("grid")}
//             className={`p-2 ${
//               viewMode === "grid"
//                 ? "bg-blue-600 text-white"
//                 : "bg-white text-gray-600 hover:bg-gray-50"
//             }`}
//           >
//             <Grid size={18} />
//           </button>
//           <button
//             onClick={() => onViewModeChange("list")}
//             className={`p-2 ${
//               viewMode === "list"
//                 ? "bg-blue-600 text-white"
//                 : "bg-white text-gray-600 hover:bg-gray-50"
//             }`}
//           >
//             <List size={18} />
//           </button>
//         </div>

//         {/* Sort Dropdown */}
//         <div className="relative">
//           <label className="text-sm font-medium text-gray-700 whitespace-nowrap mr-2">
//             Sort by:
//           </label>
//           <div className="relative">
//             <select
//               value={sortBy}
//               onChange={(e) => onSortChange(e.target.value)}
//               className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white cursor-pointer"
//             >
//               {sortOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown
//               size={16}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sort;

import React from "react";
import { Grid, List, ChevronDown } from "lucide-react";

interface EnhancedSortProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  productCount?: number;
}

const Sort: React.FC<EnhancedSortProps> = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  productCount,
}) => {
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white border border-gray-200 rounded-lg gap-4 mb-6">
      {/* Product Count */}
      {productCount !== undefined && (
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{productCount}</span>{" "}
          products found
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* View Mode Toggle */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 transition-colors duration-200 ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            title="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 transition-colors duration-200 ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            title="List view"
          >
            <List size={18} />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sort by:
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white cursor-pointer min-w-40"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sort;
