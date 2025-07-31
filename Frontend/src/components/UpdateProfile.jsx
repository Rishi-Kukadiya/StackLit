







// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Edit2, Save, X, Upload, Trash2 } from "lucide-react";

// import axios from "axios";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
// import TiptapEditor from "./QuillEditor";
// import ModifyQuestion from "./ModifyQuestion";
// import { useUser } from "./UserContext";

// // --- Stubs for pieces not shown ---
// function ProfileSection() {
//   return null;
// }
// function DeleteModal({ type, onConfirm, onCancel }) {
//   return (
//     <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
//       <div className="bg-[#2E236C] rounded-xl p-6 max-w-md w-full border border-[#433D8B]/50">
//         <h3 className="text-white text-xl font-semibold mb-4">
//           Confirm Delete
//         </h3>
//         <p className="text-[#C8ACD6] mb-6">
//           Are you sure you want to delete this {type}? This action cannot be undone.
//         </p>
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 rounded-lg bg-[#433D8B] text-white hover:bg-[#2E236C] transition-colors"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function UpdateProfile() {
//   const { user } = useUser();
//   const userId = user?.user?._id;
//   const navigate = useNavigate();

//   // State
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState({
//     profile: false,
//     answerId: null,
//   });
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     avatar: null,
//     previewAvatar: "",
//   });
//   const [editAnswer, setEditAnswer] = useState({
//     content: "",
//     images: [],
//   });
//   const [showDeleteModal, setShowDeleteModal] = useState({
//     show: false,
//     type: null, // 'profile', 'question', 'answer'
//     id: null,
//   });
//   const [questionToModify, setQuestionToModify] = useState(null);
//   const fileInputRef = useRef(null);

//   // Fetch user profile data
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_SERVER}/users/get-userProfile/${userId}`,
//           { withCredentials: true }
//         );
//         setUserData(response.data);
//         setFormData({
//           fullName: response.data.user.fullName,
//           email: response.data.user.email,
//           previewAvatar: response.data.user.avatar,
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setLoading(false);
//       }
//     };
//     if (userId) fetchUserProfile();
//   }, [userId]);

//   // Profile update handler (placeholder)
//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     console.log("Profile update requested with data:", {
//       fullName: formData.fullName,
//       email: formData.email,
//       avatar: formData.avatar,
//     });
//     // Close edit mode
//     setEditMode((m) => ({ ...m, profile: false }));
//   };

//   // Answer edit handlers
//   const handleAnswerEdit = (answer) => {
//     setEditAnswer({
//       content: answer.content,
//       images: answer.images || [],
//     });
//     setEditMode((m) => ({ ...m, answerId: answer._id }));
//   };
//   const handleAnswerUpdate = async (answerId) => {
//     console.log("Answer update requested:", { id: answerId, data: editAnswer });
//     setEditMode((m) => ({ ...m, answerId: null }));
//   };

//   // Delete handler (placeholder)
//   const handleDelete = () => {
//     console.log(`Delete requested for ${showDeleteModal.type} with id:`, showDeleteModal.id);
//     if (showDeleteModal.type === "profile") {
//       // Clear user data and redirect (placeholder)
//       setUserData(null);
//       navigate("/");
//     } else if (showDeleteModal.type === "question") {
//       setUserData((prev) => ({
//         ...prev,
//         questions: prev.questions.filter((q) => q._id !== showDeleteModal.id),
//       }));
//     } else if (showDeleteModal.type === "answer") {
//       setUserData((prev) => ({
//         ...prev,
//         answers: prev.answers.filter((a) => a._id !== showDeleteModal.id),
//       }));
//     }
//     setShowDeleteModal({ show: false, type: null, id: null });
//   };

//   // Redirect if no user is logged in
//   useEffect(() => {
//     if (!userId) navigate("/signin");
//   }, [userId, navigate]);

//   if (loading || !userData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <div className="fixed top-0 w-full z-50">
//         <Navbar />
//       </div>
//       <Sidebar />
//       <div
//         className="pt-16 min-h-screen overflow-y-auto relative z-10
//                   transition-all duration-300 mx-auto w-full
//                   lg:ml-64 lg:w-[calc(100%-16rem)]"
//       >
//         <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

//           {/* Profile Section */}
//           <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
//             {editMode.profile ? (
//               <form onSubmit={handleProfileUpdate} className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={formData.previewAvatar}
//                     alt="Profile"
//                     className="w-24 h-24 rounded-full object-cover border-4 border-[#C8ACD6]"
//                   />
//                   <div>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) {
//                           setFormData({
//                             ...formData,
//                             avatar: file,
//                             previewAvatar: URL.createObjectURL(file),
//                           });
//                         }
//                       }}
//                       className="hidden"
//                       accept="image/*"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => fileInputRef.current && fileInputRef.current.click()}
//                       className="text-[#C8ACD6] hover:text-white transition-colors flex items-center gap-2"
//                     >
//                       <Upload className="w-4 h-4" />
//                       Change Avatar
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[#C8ACD6]">Full Name</label>
//                   <input
//                     type="text"
//                     value={formData.fullName}
//                     onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                     className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-[#C8ACD6]">Email</label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
//                   />
//                 </div>

//                 <div className="flex gap-4 justify-end">
//                   <button
//                     type="submit"
//                     className="bg-[#433D8B] text-white px-4 py-2 rounded-lg hover:bg-[#2E236C] transition-colors"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     type="button"
//                     className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
//                     onClick={() => setEditMode((m) => ({ ...m, profile: false }))}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={userData.user.avatar}
//                     alt={userData.user.fullName}
//                     className="w-24 h-24 rounded-full object-cover border-4 border-[#C8ACD6]"
//                   />
//                   <div>
//                     <h3 className="text-xl text-white font-medium">{userData.user.fullName}</h3>
//                     <p className="text-[#C8ACD6]">{userData.user.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-4 mt-3">
//                   <button
//                     className="bg-[#433D8B] text-white px-4 py-2 rounded-lg hover:bg-[#2E236C] transition-colors"
//                     onClick={() => setEditMode((m) => ({ ...m, profile: true }))}
//                   >
//                     Edit Profile
//                   </button>
//                   <button
//                     className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//                     onClick={() =>
//                       setShowDeleteModal({ show: true, type: "profile", id: userId })
//                     }
//                   >
//                     Delete Profile
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Questions Section */}
//           <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
//             <h2 className="text-2xl font-bold text-white mb-6">Your Questions</h2>
//             <div className="space-y-4">
//               {userData.questions &&
//                 userData.questions.map((question) => (
//                   <div key={question._id}>
//                     <QuestionCard
//                       question={question}
//                       onDelete={(id) =>
//                         setShowDeleteModal({ show: true, type: "question", id })
//                       }
//                       onModify={() => setQuestionToModify(question)}
//                     />
//                   </div>
//                 ))}
//             </div>
//           </div>

//           {/* Answers Section */}
//           <div className="bg-[#2E236C]/20 rounded-xl p-6 border-2 border-[#C8ACD6]/30">
//             <h2 className="text-2xl font-bold text-white mb-6">Your Answers</h2>
//             <div className="space-y-4">
//               {userData.answers &&
//                 userData.answers.map((answer) => (
//                   <AnswerCard
//                     key={answer._id}
//                     answer={answer}
//                     onDelete={(id) => setShowDeleteModal({ show: true, type: "answer", id })}
//                     onEdit={() => handleAnswerEdit(answer)}
//                     editMode={editMode}
//                     setEditMode={setEditMode}
//                     editAnswer={editAnswer}
//                     setEditAnswer={setEditAnswer}
//                     handleAnswerUpdate={handleAnswerUpdate}
//                   />
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal.show && (
//         <DeleteModal
//           type={showDeleteModal.type}
//           onConfirm={handleDelete}
//           onCancel={() => setShowDeleteModal({ show: false, type: null, id: null })}
//         />
//       )}

//       {/* Modify Question Modal */}
//       {questionToModify && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
//           <div className="w-full max-w-3xl rounded-xl shadow-2xl border-2 border-[#433D8B]/40 bg-[#1a133a] h-[90vh] flex flex-col overflow-hidden">
//             <button
//               onClick={() => setQuestionToModify(null)}
//               className="absolute top-4 right-4 z-10 text-white bg-[#433D8B] rounded-full p-2 hover:bg-[#2E236C] transition-colors"
//               aria-label="Close modify question"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <ModifyQuestion question={questionToModify} onClose={() => setQuestionToModify(null)} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // QuestionCard Component
// function QuestionCard({ question, onDelete, onModify }) {
//   return (
//     <div
//       className="bg-[#2E236C]/40 border border-[#433D8B]/30 rounded-xl p-4 flex flex-col gap-3 shadow-md transition-all duration-300 hover:shadow-lg w-full cursor-pointer hover:bg-[#433D8B]/10"
//       onClick={onModify}
//     >
//       <div className="flex items-center justify-between gap-2">
//         <div className="flex flex-col gap-1">
//           <h3 className="text-lg text-white font-semibold line-clamp-2">{question.title}</h3>
//           <div className="flex flex-wrap gap-2 mt-1">
//             {question.tags &&
//               question.tags.map((tag, idx) => (
//                 <span
//                   key={idx}
//                   className="bg-[#C8ACD6]/10 text-[#C8ACD6] px-3 py-1 rounded-full text-xs font-medium border border-[#C8ACD6]/20"
//                 >
//                   {tag}
//                 </span>
//               ))}
//           </div>
//         </div>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onDelete(question._id);
//           }}
//           className="ml-auto text-red-400 hover:text-red-500 transition-colors"
//           aria-label="Delete question"
//         >
//           <Trash2 className="w-5 h-5" />
//         </button>
//       </div>
//       <div className="mt-2 text-[#C8ACD6] text-sm line-clamp-3">
//         {/* Strip HTML tags and show a snippet */}
//         {question.content.replace(/<[^>]+>/g, "").slice(0, 120)}
//       </div>
//       {question.images && question.images.length > 0 && (
//         <div className="flex flex-wrap gap-2 mt-2">
//           {question.images.map((img, idx) => (
//             <img
//               key={idx}
//               src={typeof img === "string" ? img : URL.createObjectURL(img)}
//               alt={`img-${idx}`}
//               className="w-14 h-14 object-cover rounded-lg border border-[#C8ACD6]/30"
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // AnswerCard Component
// function AnswerCard({
//   answer,
//   onDelete,
//   onEdit,
//   editMode,
//   setEditMode,
//   editAnswer,
//   setEditAnswer,
//   handleAnswerUpdate,
// }) {
//   return (
//     <div className="border-b border-[#433D8B]/30 pb-4">
//       {editMode.answerId === answer._id ? (
//         <div className="space-y-4">
//           <TiptapEditor
//             value={editAnswer.content}
//             setValue={(val) => setEditAnswer((prev) => ({ ...prev, content: val }))}
//           />
//           <div className="flex gap-2">
//             <button
//               onClick={() => handleAnswerUpdate(answer._id)}
//               className="flex items-center gap-2 px-3 py-1 bg-[#433D8B] text-white rounded-lg hover:bg-[#2E236C] transition-colors"
//               aria-label="Save answer"
//             >
//               <Save className="w-4 h-4" />
//               Save
//             </button>
//             <button
//               onClick={() => setEditMode((m) => ({ ...m, answerId: null }))}
//               className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
//               aria-label="Cancel edit answer"
//             >
//               <X className="w-4 h-4" />
//               Cancel
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="flex justify-between items-start w-full">
//           <div>
//             <p className="text-sm text-[#C8ACD6] mb-2">
//               {answer.questionId ? `On: ${answer.questionId.title}` : "Question not available"}
//             </p>
//             <div
//               className="text-white prose prose-invert max-w-none"
//               dangerouslySetInnerHTML={{ __html: answer.content }}
//             />
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => onEdit(answer)}
//               className="text-[#C8ACD6] hover:text-white transition-colors"
//               aria-label="Edit answer"
//             >
//               <Edit2 className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => onDelete(answer._id)}
//               className="text-red-400 hover:text-red-500 transition-colors"
//               aria-label="Delete answer"
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Save, X, Upload, Trash2 } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import TiptapEditor from "./QuillEditor";
import ModifyQuestion from "./ModifyQuestion";
import ModifyAnswer from "./ModifyAnswer";
import { useUser } from "./UserContext";

function DeleteModal({ type, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
      <div className="bg-[#2E236C] rounded-xl p-6 max-w-md w-full border border-[#433D8B]/50">
        <h3 className="text-white text-xl font-semibold mb-4">
          Confirm Delete
        </h3>
        <p className="text-[#C8ACD6] mb-6">
          Are you sure you want to delete this {type}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-[#433D8B] text-white hover:bg-[#2E236C]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UpdateProfile() {
  const { user } = useUser();
  const userId = user?.user?._id;
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    profile: false,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatar: null,
    previewAvatar: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    type: null,
    id: null,
  });
  const [questionToModify, setQuestionToModify] = useState(null);
  const [answerToModify, setAnswerToModify] = useState(null);

  const fileInputRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // comment this if you want, this is a frontend placeholder anyway
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/users/get-userProfile/${userId}`,
          { withCredentials: true }
        );
        setUserData(response.data);
        setFormData({
          fullName: response.data.user.fullName,
          email: response.data.user.email,
          previewAvatar: response.data.user.avatar,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    if (userId) fetchUserProfile();
  }, [userId]);

  // Profile update handler (placeholder)
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // TODO: call backend PATCH route
    console.log("Profile updated!", {
      fullName: formData.fullName,
      email: formData.email,
      avatar: formData.avatar,
    });
    setEditMode((m) => ({ ...m, profile: false }));
  };

  // Delete handler (placeholder)
  const handleDelete = () => {
    console.log(`DELETE ${showDeleteModal.type} id=`, showDeleteModal.id);
    if (showDeleteModal.type === "profile") {
      setUserData(null);
      navigate("/");
    } else if (showDeleteModal.type === "question") {
      setUserData((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q._id !== showDeleteModal.id),
      }));
    } else if (showDeleteModal.type === "answer") {
      setUserData((prev) => ({
        ...prev,
        answers: prev.answers.filter((a) => a._id !== showDeleteModal.id),
      }));
    }
    setShowDeleteModal({ show: false, type: null, id: null });
  };

  useEffect(() => {
    if (!userId) navigate("/signin");
  }, [userId, navigate]);

  if (loading || !userData) return <div>Loading...</div>;

  return (
    <>
      <div className="fixed top-0 w-full z-50"><Navbar /></div>
      <Sidebar />

      <div className="pt-16 min-h-screen overflow-y-auto relative z-10 transition-all duration-300 mx-auto w-full lg:ml-64 lg:w-[calc(100%-16rem)]">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

          {/* Profile Section */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
            {editMode.profile ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={formData.previewAvatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#C8ACD6]"
                  />
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            avatar: file,
                            previewAvatar: URL.createObjectURL(file),
                          });
                        }
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="text-[#C8ACD6] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Change Avatar
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[#C8ACD6]">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[#C8ACD6]">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="submit"
                    className="bg-[#433D8B] text-white px-4 py-2 rounded-lg hover:bg-[#2E236C] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    onClick={() => setEditMode((m) => ({ ...m, profile: false }))}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={userData.user.avatar}
                    alt={userData.user.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#C8ACD6]"
                  />
                  <div>
                    <h3 className="text-xl text-white font-medium">{userData.user.fullName}</h3>
                    <p className="text-[#C8ACD6]">{userData.user.email}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-3">
                  <button
                    className="bg-[#433D8B] text-white px-4 py-2 rounded-lg hover:bg-[#2E236C] transition-colors"
                    onClick={() => setEditMode((m) => ({ ...m, profile: true }))}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() =>
                      setShowDeleteModal({ show: true, type: "profile", id: userId })
                    }
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Questions Section */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
            <h2 className="text-2xl font-bold text-white mb-6">Your Questions</h2>
            <div className="space-y-4">
              {userData.questions?.map((question) => (
                <div key={question._id}>
                  <div
                    className="bg-[#2E236C]/40 border border-[#433D8B]/30 rounded-xl p-4 flex flex-col gap-3 shadow-md transition-all duration-300 hover:shadow-lg w-full cursor-pointer hover:bg-[#433D8B]/10"
                    onClick={() => setQuestionToModify(question)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg text-white font-semibold line-clamp-2">{question.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {question.tags?.map((tag, idx) => (
                            <span key={idx} className="bg-[#C8ACD6]/10 text-[#C8ACD6] px-3 py-1 rounded-full text-xs font-medium border border-[#C8ACD6]/20">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setShowDeleteModal({ show: true, type: "question", id: question._id });
                        }}
                        className="ml-auto text-red-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-2 text-[#C8ACD6] text-sm line-clamp-3">
                      {question.content.replace(/<[^>]+>/g, '').slice(0, 120)}
                    </div>
                    {question.images && question.images.length > 0 &&
                      <div className="flex flex-wrap gap-2 mt-2">
                        {question.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={typeof img === "string" ? img : URL.createObjectURL(img)}
                            alt={`img-${idx}`}
                            className="w-14 h-14 object-cover rounded-lg border border-[#C8ACD6]/30"
                          />
                        ))}
                      </div>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Answers Section */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 border-2 border-[#C8ACD6]/30">
            <h2 className="text-2xl font-bold text-white mb-6">Your Answers</h2>
            <div className="space-y-4">
              {userData.answers?.map((answer) => (
                <div key={answer._id}>
                  <div className="flex justify-between border-b border-[#433D8B]/30 pb-4">
                    <div>
                      <p className="text-sm text-[#C8ACD6] mb-2">
                        {answer.questionId ? `On: ${answer.questionId.title}` : "Question not available"}
                      </p>
                      <div
                        className="text-white prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: answer.content }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAnswerToModify(answer)}
                        className="text-[#C8ACD6] hover:text-white transition-colors"
                        aria-label="Edit answer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal({ show: true, type: "answer", id: answer._id })}
                        className="text-red-400 hover:text-red-500 transition-colors"
                        aria-label="Delete answer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal.show && (
        <DeleteModal
          type={showDeleteModal.type}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal({ show: false, type: null, id: null })}
        />
      )}

      {/* Modify Question Modal */}
      {questionToModify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-3xl rounded-xl shadow-2xl border-2 border-[#433D8B]/40 bg-[#1a133a] h-[90vh] flex flex-col overflow-hidden">
            <button
              onClick={() => setQuestionToModify(null)}
              className="absolute top-4 right-4 z-10 text-white bg-[#433D8B] rounded-full p-2 hover:bg-[#2E236C] transition-colors"
              aria-label="Close modify question"
            >
              <X className="w-6 h-6" />
            </button>
            <ModifyQuestion question={questionToModify} onClose={() => setQuestionToModify(null)} />
          </div>
        </div>
      )}

      {/* Modify Answer Modal */}
      {answerToModify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-2xl rounded-xl shadow-2xl border-2 border-[#433D8B]/40 bg-[#1a133a] max-h-[90vh] flex flex-col overflow-hidden">
            <button
              onClick={() => setAnswerToModify(null)}
              className="absolute top-4 right-4 z-10 text-white bg-[#433D8B] rounded-full p-2 hover:bg-[#2E236C] transition-colors"
              aria-label="Close modify answer"
            >
              <X className="w-6 h-6" />
            </button>
            <ModifyAnswer answer={answerToModify} onClose={() => setAnswerToModify(null)} />
          </div>
        </div>
      )}
    </>
  );
}
