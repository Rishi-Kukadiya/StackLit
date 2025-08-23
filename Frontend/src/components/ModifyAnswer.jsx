import React, { useState, useRef } from "react";
import TiptapEditor from "./QuillEditor";
import {
  Edit2,
  Save,
  X,
  ImagePlus,
  Tag as TagIcon,
  Trash2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import ErrorPopup from "./ErrorPopup";
import axios from "axios";
import ShimmerLoader from "./ShimmerLoader";
import SuccessPopup from "./SuccessPopup";

// A reusable section wrapper for consistent styling
const SectionWrapper = ({ title, icon, children, onEdit, isEditing }) => (
  <div className="bg-[#2E236C]/20 p-4 rounded-xl border border-[#433D8B]/30 mb-6 transition-all duration-300 hover:border-[#C8ACD6]/40">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-white text-lg font-semibold flex items-center gap-3">
        {icon}
        {title}
      </h2>
      {!isEditing && (
        <button
          onClick={onEdit}
          className="text-[#C8ACD6] hover:text-white transition-colors p-1 rounded-full hover:bg-[#433D8B]/50"
          aria-label={`Edit ${title}`}
        >
          <Edit2 className="w-5 h-5" />
        </button>
      )}
    </div>
    <div className="pl-8">{children}</div>
  </div>
);

// A reusable button component
const ActionButton = ({ onClick, children, variant = "primary" }) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2";
  const variants = {
    primary: "bg-[#433D8B] text-white hover:bg-[#5a52a5]",
    danger: "bg-red-500 text-white hover:bg-red-600",
    cancel: "bg-gray-500/20 text-gray-300 hover:bg-gray-500/40",
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

export default function ModifyAnswer({ answer, onClose }) {
  if (!answer) {
    return null;
  }

  const [editContent, setEditContent] = useState(answer.content);
  const [editTags, setEditTags] = useState(answer.tags || []);
  const [editImages, setEditImages] = useState(answer.images || []);
  const [retainImages, setRetainImages] = useState(answer.images);

  const [newTag, setNewTag] = useState("");
  const [editingField, setEditingField] = useState(null);
  const imageInputRef = useRef(null);
  const [Error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Handlers ---
  const handleSave = async (field) => {
    switch (field) {
      case "content":
        setLoading(true);
        try {
          const response = await axios.patch(
            `${import.meta.env.VITE_SERVER}/answers/edit-content/${answer._id}`,
            { content: editContent },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (response.data.statusCode != 200) {
            setError(response.data.message || "Network Error!!");
          } else {
            setSuccess(
              response.data.message || "Content Updated successfully!!"
            );
          }
        } catch (err) {
          setError("Something Went Wrong!!");
        } finally {
          setLoading(false);
        }
        break;
      case "images":
        const filteredImages = editImages.filter(
          (img) => !retainImages.includes(img)
        );

        const data = new FormData();
        data.append("retainImages", JSON.stringify(retainImages));
        if (editImages && editImages.length > 0) {
          editImages.forEach((file) => {
            data.append("image", file);
          });
        }
        setEditImages(filteredImages);
        setLoading(true);
        try {
          const response = await axios.patch(
            `${import.meta.env.VITE_SERVER}/answers/edit-images/${answer._id}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true,
            }
          );

          if (!response.data.success) {
            setError(response.data.message || "Network Error!!");
          } else {
            // console.log("Successfull doen");
            setSuccess(response.data.message || "Image Updated successfully!!");
          }
        } catch (err) {
          setError("Somethign went Wrong!!");
        } finally {
          setLoading(false);
        }
        break;
      default:
        break;
    }
    setEditingField(null);
  };

  const handleCancel = (field) => {
    switch (field) {
      case "content":
        setEditContent(editContent);
        break;
      case "tags":
        setEditTags(editTags);
        setNewTag("");
        break;
      case "images":
        setEditImages([...editImages, ...retainImages]);
        break;
      default:
        break;
    }
    setEditingField(null);
  };

  const handleAddTag = async () => {
    const tag = newTag.trim();
    if (!tag) {
      setError("Tag is Required!!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER}/answers/add-tag/${answer._id}`,
        { tag: tag },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.statusCode != 200) {
        setError(response.data.message || "Network Error!!");
      } else {
        setSuccess(response.data.message || "Tag Updated successfully!!");
      }
    } catch (error) {
      setError("Something went Wrong!!");
    } finally {
      setLoading(false);
    }

    if (tag && !editTags.includes(tag) && editTags.length < 10) {
      setEditTags([...editTags, tag]);
      setNewTag("");
    }
  };

  const handleDeleteTag = async (idx, answerId, tag) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER}/answers/delete-tag/${answerId}`,
        { tag: tag },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.statusCode != 200) {
        setError(response.data.message || "Network Error!!");
      } else {
        setSuccess(response.data.message || "Tags deleted successfully!!");
        setEditTags((prev) => prev.filter((_, i) => i !== idx));
      }
    } catch (err) {
      setError("Something went wrong!!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...editImages, ...files].slice(0, 5);
    setEditImages(combined);
  };

  const handleDeleteImage = (idx, url) => {
    setEditImages((prev) => prev.filter((_, i) => i !== idx));
    if (retainImages.includes(url)) {
      const updatedRetainImages = retainImages.filter((img) => img !== url);
      setRetainImages(updatedRetainImages);
    }
  };

  const handleDeleteAnswer = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER}/answers/delete-answer/${answer._id}`,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.statusCode != 200) {
        setError(response.data.message || "Netwrok Error");
      } else {
        setSuccess(response.data.message || "Answer Deleted Successfully!!");

        Object.keys(localStorage).forEach((key) => {
          if (key.includes(`${answer._id}`)) {
            localStorage.removeItem(key);
          }
        });
        
      }
    } catch (err) {
      setError("Something went Wrong!!");
    } finally {
      setLoading(false);
    }
    if (onClose) onClose();
  };

  if (loading) {
    return <ShimmerLoader></ShimmerLoader>;
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-[#1a133a] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#433D8B]/30 sticky top-0 bg-[#1a133a] z-10">
        <div className="flex-grow overflow-hidden">
          <p className="text-sm text-gray-400">Editing Answer for</p>
          <h1
            className="text-xl font-bold text-white truncate"
            title={answer.questionId?.title}
          >
            {answer.questionId?.title || "Question"}
          </h1>
        </div>
        <button
          onClick={onClose}
          className="text-white bg-[#433D8B] rounded-full p-2 hover:bg-[#2E236C] transition-colors ml-4 flex-shrink-0"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="overflow-y-auto p-6 flex-grow">
        {/* Content Section */}
        <SectionWrapper
          title="Content"
          icon={<FileText className="w-6 h-6 text-[#C8ACD6]" />}
          onEdit={() => setEditingField("content")}
          isEditing={editingField === "content"}
        >
          {editingField === "content" ? (
            <div>
              <div className="bg-[#2E236C]/70 rounded-lg p-2 border border-[#433D8B]">
                <TiptapEditor value={editContent} setValue={setEditContent} />
              </div>
              <div className="flex gap-3 mt-3">
                <ActionButton onClick={() => handleSave("content")}>
                  <Save className="w-4 h-4" /> Save
                </ActionButton>
                <ActionButton
                  onClick={() => handleCancel("content")}
                  variant="cancel"
                >
                  <X className="w-4 h-4" /> Cancel
                </ActionButton>
              </div>
            </div>
          ) : (
            <div
              className="prose prose-invert max-w-none text-gray-300 bg-[#2E236C]/30 rounded-lg p-3 line-clamp-4"
              dangerouslySetInnerHTML={{ __html: editContent }}
            />
          )}
        </SectionWrapper>

        {/* Tags Section */}
        <SectionWrapper
          title="Tags"
          icon={<TagIcon className="w-6 h-6 text-[#C8ACD6]" />}
          onEdit={() => setEditingField("tags")}
          isEditing={editingField === "tags"}
        >
          {editingField === "tags" ? (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {editTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 bg-[#C8ACD6]/10 text-[#C8ACD6] pl-3 pr-2 py-1 rounded-full text-sm border border-[#C8ACD6]/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(idx, answer._id, tag)}
                      className="text-white/70 hover:text-red-400 transition-colors rounded-full bg-black/20 w-5 h-5 flex items-center justify-center"
                      aria-label={`Delete tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a new tag..."
                  maxLength={30}
                  className="flex-grow rounded-lg px-3 py-2 bg-[#2E236C]/70 text-white border border-[#433D8B] focus:ring-2 focus:ring-[#C8ACD6] focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  autoFocus
                />
                <ActionButton onClick={handleAddTag}>Add</ActionButton>
              </div>
              <div className="flex gap-3">
                <ActionButton
                  onClick={() => handleCancel("tags")}
                  variant="cancel"
                >
                  <X className="w-4 h-4" /> Cancel
                </ActionButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {editTags.length === 0 ? (
                <p className="text-gray-400">No tags assigned.</p>
              ) : (
                editTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#C8ACD6]/20 text-[#C8ACD6] px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>
          )}
        </SectionWrapper>

        {/* Images Section */}
        <SectionWrapper
          title="Images"
          icon={<ImagePlus className="w-6 h-6 text-[#C8ACD6]" />}
          onEdit={() => setEditingField("images")}
          isEditing={editingField === "images"}
        >
          {editingField === "images" ? (
            <div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                {editImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-[#C8ACD6]/30"
                  >
                    <img
                      src={
                        typeof img === "string" ? img : URL.createObjectURL(img)
                      }
                      alt={`upload-preview-${idx}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      aria-label="Remove image"
                      onClick={() => handleDeleteImage(idx, img)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1  transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {editImages.length < 5 && (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-[#433D8B] text-[#C8ACD6] hover:bg-[#2E236C]/50 hover:border-[#C8ACD6]/70 transition-colors"
                  >
                    <ImagePlus className="w-8 h-8" />
                  </button>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={editImages.length >= 5}
                className="hidden"
              />
              <div className="flex gap-3">
                <ActionButton onClick={() => handleSave("images")}>
                  <Save className="w-4 h-4" /> Save Images
                </ActionButton>
                <ActionButton
                  onClick={() => handleCancel("images")}
                  variant="cancel"
                >
                  <X className="w-4 h-4" /> Cancel
                </ActionButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {editImages.length === 0 ? (
                <p className="text-gray-400">No images uploaded.</p>
              ) : (
                editImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt={`answer-img-${idx}`}
                    className="w-24 h-24 rounded-lg object-cover border border-[#C8ACD6]/30"
                  />
                ))
              )}
            </div>
          )}
        </SectionWrapper>
      </div>

      {/* Footer / Delete Section */}
      <div className="p-4 border-t border-[#433D8B]/30 sticky bottom-0 bg-[#1a133a] z-10">
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-red-300/80 text-sm mt-1">
              Deleting your answer is permanent and cannot be undone.
            </p>
          </div>
          <ActionButton onClick={handleDeleteAnswer} variant="danger">
            <Trash2 className="w-4 h-4" />
            Delete Answer
          </ActionButton>
        </div>
      </div>

      {Error && <ErrorPopup message={Error} onClose={() => setError("")} />}
      {success && (
        <SuccessPopup message={success} onClose={() => setSuccess("")} />
      )}
    </div>
  );
}
