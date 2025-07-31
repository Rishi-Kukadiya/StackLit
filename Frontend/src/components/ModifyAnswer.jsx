import React, { useState, useRef } from "react";
import TiptapEditor from "./QuillEditor";
import { Edit2, Save, X, ImagePlus, Tag as TagIcon, Trash2 } from "lucide-react";

export default function ModifyAnswer({ answer, onClose }) {
  const [editContent, setEditContent] = useState(answer.content);
  const [editTags, setEditTags] = useState(answer.tags || []);
  const [editImages, setEditImages] = useState(answer.images || []);
  const [newTag, setNewTag] = useState("");
  const [editingField, setEditingField] = useState(null); // 'content', 'tags', 'images'
  const imageInputRef = useRef(null);

  // --- Content section ---
  const handleSaveContent = () => {
    // TODO: PATCH /edit-content/:answerId (body: {content})
    console.log(`PATCH /edit-content/${answer._id}`, { content: editContent });
    setEditingField(null);
  };

  // --- Tags section ---
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !editTags.includes(tag) && editTags.length < 10) {
      // TODO: PATCH /add-tag/:answerId (body: {tag})
      console.log(`PATCH /add-tag/${answer._id}`, { tag });
      setEditTags([...editTags, tag]);
      setNewTag("");
    }
  };
  const handleDeleteTag = (idx) => {
    const tagToDelete = editTags[idx];
    // TODO: PATCH /delete-tag/:answerId (body: {tag})
    console.log(`PATCH /delete-tag/${answer._id}`, { tag: tagToDelete });
    setEditTags((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleSaveTags = () => setEditingField(null);

  // --- Images section ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...editImages, ...files].slice(0, 5);
    setEditImages(combined);
  };
  const handleDeleteImage = (idx) => {
    const imgToDelete = editImages[idx];
    // TODO: PATCH /edit-images/:answerId (delete img)
    console.log(`PATCH /edit-images/${answer._id}`, { remove: imgToDelete });
    setEditImages(editImages.filter((_, i) => i !== idx));
  };
  const handleSaveImages = () => {
    // TODO: PATCH /edit-images/:answerId (body: images[])
    console.log(`PATCH /edit-images/${answer._id}`, { images: editImages });
    setEditingField(null);
  };

  // --- Delete answer ---
  const handleDeleteAnswer = () => {
    // TODO: DELETE /delete-answer/:answerId
    console.log(`DELETE /delete-answer/${answer._id}`);
    if (onClose) onClose();
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-auto p-6 max-h-[90vh]">
        <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white bg-[#433D8B] rounded-full p-2 hover:bg-[#2E236C] transition-colors"
                  aria-label="Close modify question"
                >
                  <X className="w-6 h-6" />
                </button>
      {/* Content Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white text-lg font-semibold">Answer Details</h2>
          {editingField !== "content" &&
            <button onClick={() => setEditingField("content")} className="text-[#C8ACD6] hover:text-white"><Edit2 className="w-5 h-5" /></button>}
        </div>
        {editingField === "content" ? (
          <>
            <div className="bg-[#2E236C]/70 rounded-lg p-2 mb-2 border border-[#433D8B]">
              <TiptapEditor value={editContent} setValue={setEditContent} />
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={handleSaveContent} className="px-4 py-2 rounded-lg bg-[#433D8B] text-white hover:bg-[#2E236C]">Save</button>
              <button onClick={() => {
                setEditContent(answer.content);
                setEditingField(null);
              }} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Cancel</button>
            </div>
          </>
        ) : (
          <div
            className="prose prose-invert max-w-none text-white bg-[#2E236C]/30 rounded-lg p-2"
            dangerouslySetInnerHTML={{ __html: editContent }}
          />
        )}
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white text-lg font-semibold flex gap-2 items-center"><TagIcon className="w-5 h-5" />Tags</h2>
          {editingField !== "tags" &&
            <button onClick={() => setEditingField("tags")} className="text-[#C8ACD6] hover:text-white"><Edit2 className="w-5 h-5" /></button>}
        </div>
        {editingField === "tags" ? (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {editTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-[#C8ACD6]/10 text-[#C8ACD6] px-3 py-1 rounded-full text-sm border border-[#C8ACD6]/20 cursor-default"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleDeleteTag(idx)}
                    className="text-white/70 hover:text-red-400 transition-colors"
                    aria-label={`Delete tag ${tag}`}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                maxLength={30}
                className="flex-grow rounded-lg px-3 py-2 bg-[#2E236C]/70 text-white border border-[#433D8B]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleAddTag}
                className="bg-[#433D8B] px-4 py-2 rounded-lg text-white hover:bg-[#2E236C]">
                Add
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSaveTags} className="bg-[#433D8B] px-4 py-2 rounded-lg text-white hover:bg-[#2E236C]">Save</button>
              <button onClick={() => {
                setEditTags(answer.tags || []);
                setNewTag("");
                setEditingField(null);
              }} className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600">Cancel</button>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-2 max-w-full">
            {editTags.length === 0 ?
              <p className="text-white/70">No tags assigned</p> :
              editTags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-[#C8ACD6]/20 text-[#C8ACD6] px-3 py-1 rounded-full text-sm border border-[#C8ACD6]/30">{tag}</span>
              ))}
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white text-lg font-semibold flex gap-2 items-center"><ImagePlus className="w-5 h-5" />Images</h2>
          {editingField !== "images" &&
            <button onClick={() => setEditingField("images")} className="text-[#C8ACD6] hover:text-white"><Edit2 className="w-5 h-5" /></button>}
        </div>
        {editingField === "images" ? (
          <>
            <div className="flex flex-wrap gap-3 mb-3 max-h-40 overflow-y-auto">
              {editImages.map((img, idx) => (
                <div key={idx} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-[#C8ACD6]/30">
                  <img
                    src={typeof img === "string" ? img : URL.createObjectURL(img)}
                    alt={`img-${idx}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    aria-label="Remove image"
                    onClick={() => handleDeleteImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={editImages.length >= 5}
              className="mb-3"
            />
            <div className="flex gap-3">
              <button onClick={handleSaveImages} className="bg-[#433D8B] px-4 py-2 rounded-lg text-white hover:bg-[#2E236C]">Save</button>
              <button onClick={() => {
                setEditImages(answer.images || []);
                setEditingField(null);
              }} className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600">Cancel</button>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-3 max-h-40 overflow-auto">
            {editImages.length === 0 ? (
              <p className="text-white/70">No images uploaded</p>
            ) : (
              editImages.map((img, idx) => (
                <img
                  key={idx}
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  alt={`img-${idx}`}
                  className="w-24 h-24 rounded-lg object-cover border border-[#C8ACD6]/30"
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Section */}
      <div className="flex justify-end gap-2 pt-3 border-t border-[#433D8B]/30">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-[#433D8B] text-white hover:bg-[#2E236C]"
        >Close</button>
        <button
          onClick={handleDeleteAnswer}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700 flex gap-2 items-center"
        ><Trash2 className="w-4 h-4" /> Delete Answer</button>
      </div>
    </div>
  );
}
