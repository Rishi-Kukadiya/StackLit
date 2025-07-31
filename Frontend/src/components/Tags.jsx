// import React, { useState, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTags, resetTags } from "../redux/Tags";
// import { Search, Hash, MessageSquare, Loader } from "lucide-react";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
// import debounce from "lodash/debounce";

// export default function Tags() {
//     const dispatch = useDispatch();
//     const { tags, loading, totalTags } = useSelector((state) => state.tags);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filteredTags, setFilteredTags] = useState([]);

//     useEffect(() => {
//         dispatch(fetchTags({ page: 1, limit: 50 }));
//         return () => {
//             dispatch(resetTags());
//         };
//     }, [dispatch]);

//     useEffect(() => {
//         if (tags) {
//             setFilteredTags(
//                 tags.filter((tag) =>
//                     tag.tagName.toLowerCase().includes(searchQuery.toLowerCase())
//                 )
//             );
//         }
//     }, [tags, searchQuery]);

//     const debouncedSearch = useCallback(
//         debounce((query) => {
//             setSearchQuery(query);
//         }, 300),
//         []
//     );

//     return (
//         <div className="min-h-screen bg-transparent">
//             <div className="fixed top-0 w-full z-50">
//                 <Navbar />
//             </div>
//             <Sidebar />

//             <main className="pt-24 sm:pt-20 pb-12 lg:ml-64">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     {/* Header Section */}
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                         <div>
//                             <h1 className="text-2xl sm:text-3xl font-bold text-white">Tags</h1>
//                             <p className="text-[#C8ACD6] mt-1">
//                                 {totalTags} tags available
//                             </p>
//                         </div>

//                         {/* Search Bar */}
//                         <div className="relative w-full sm:w-64">
//                             <input
//                                 type="text"
//                                 placeholder="Search tags..."
//                                 onChange={(e) => debouncedSearch(e.target.value)}
//                                 className="w-full px-4 py-2 pl-10 bg-[#2E236C]/30 border border-[#433D8B]/30 
//                                          rounded-lg text-white placeholder-[#C8ACD6]/50
//                                          focus:outline-none focus:border-[#C8ACD6]/50 
//                                          transition-all duration-300"
//                             />
//                             <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#C8ACD6]" />
//                         </div>
//                     </div>

//                     {/* Tags Grid */}
//                     {loading ? (
//                         <div className="flex justify-center items-center min-h-[400px]">
//                             <Loader className="w-8 h-8 text-[#C8ACD6] animate-spin" />
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {filteredTags.map((tag) => (
//                                 <div
//                                     key={tag.tagName}
//                                     className="group bg-[#2E236C]/20 rounded-lg p-6 
//                                              border-2 border-[#433D8B]/30 hover:border-[#C8ACD6]/30
//                                              transition-all duration-300"
//                                 >
//                                     <div className="flex items-start justify-between">
//                                         <div className="flex items-center gap-2">
//                                             <Hash className="w-5 h-5 text-[#C8ACD6]" />
//                                             <h3 className="text-lg font-semibold text-white group-hover:text-[#C8ACD6] transition-colors">
//                                                 {tag.tagName}
//                                             </h3>
//                                         </div>
//                                         <span className="flex items-center gap-1 text-sm text-[#C8ACD6]">
//                                             <MessageSquare className="w-4 h-4" />
//                                             {tag.totalQuestionsAsked}
//                                         </span>
//                                     </div>

//                                     <p className="mt-4 text-[#C8ACD6] text-sm line-clamp-4">
//                                         {tag.description}
//                                     </p>

//                                     <button 
//                                         className="mt-4 text-sm text-[#C8ACD6] hover:text-white transition-colors"
//                                         onClick={() => {
//                                             // Handle view questions with this tag
//                                             console.log(`View questions with tag: ${tag.tagName}`);
//                                         }}
//                                     >
//                                         View questions →
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {/* No Results */}
//                     {!loading && filteredTags.length === 0 && (
//                         <div className="text-center py-12">
//                             <p className="text-[#C8ACD6] text-lg">
//                                 No tags found matching your search.
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// }
//   const dispatch = useDispatch();
//   const { tags, loading, totalTags } = useSelector((state) => state.tags);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredTags, setFilteredTags] = useState([]);

//   useEffect(() => {
//     dispatch(fetchTags({ page: 1, limit: 50 }));
//     return () => {
//       dispatch(resetTags());
//     };
//   }, [dispatch]);

//   useEffect(() => {
//     if (tags) {
//       setFilteredTags(
//         tags.filter((tag) =>
//           tag.tagName.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     }
//   }, [tags, searchQuery]);

//   const debouncedSearch = useCallback(
//     debounce((query) => {
//       setSearchQuery(query);
//     }, 300),
//     []
//   );

//   return (
//     <div className="min-h-screen bg-transparent">
//       <div className="fixed top-0 w-full z-50">
//         <Navbar />
//       </div>
//       <Sidebar />

//       <main className="pt-24 sm:pt-20 pb-12 lg:ml-64">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header Section */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-white">
//                 Tags
//               </h1>
//               <p className="text-[#C8ACD6] mt-1">{totalTags} tags available</p>
//             </div>

//             {/* Search Bar */}
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search tags..."
//                 onChange={(e) => debouncedSearch(e.target.value)}
//                 className="w-full px-4 py-2 pl-10 bg-[#2E236C]/30 border border-[#433D8B]/30 
//                                          rounded-lg text-white placeholder-[#C8ACD6]/50
//                                          focus:outline-none focus:border-[#C8ACD6]/50 
//                                          transition-all duration-300"
//               />
//               <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#C8ACD6]" />
//             </div>
//           </div>

//           {/* Tags Grid */}
//           {loading ? (
//             <div className="flex justify-center items-center min-h-[400px]">
//               <Loader className="w-8 h-8 text-[#C8ACD6] animate-spin" />
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredTags.map((tag) => (
//                 <div
//                   key={tag.tagName}
//                   className="group bg-[#2E236C]/20 rounded-lg p-6 
//                                              border-2 border-[#433D8B]/30 hover:border-[#C8ACD6]/30
//                                              transition-all duration-300"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-2">
//                       <Hash className="w-5 h-5 text-[#C8ACD6]" />
//                       <h3 className="text-lg font-semibold text-white group-hover:text-[#C8ACD6] transition-colors">
//                         {tag.tagName}
//                       </h3>
//                     </div>
//                     <span className="flex items-center gap-1 text-sm text-[#C8ACD6]">
//                       <MessageSquare className="w-4 h-4" />
//                       {tag.totalQuestionsAsked}
//                     </span>
//                   </div>

//                   <p className="mt-4 text-[#C8ACD6] text-sm line-clamp-4">
//                     {tag.description}
//                   </p>

//                   <button
//                     className="mt-4 text-sm text-[#C8ACD6] hover:text-white transition-colors"
//                     onClick={() => {
//                       // Handle view questions with this tag
//                       console.log(`View questions with tag: ${tag.tagName}`);
//                     }}
//                   >
//                     View questions →
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* No Results */}
//           {!loading && filteredTags.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-[#C8ACD6] text-lg">
//                 No tags found matching your search.
//               </p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
