import React, { useState, useEffect, useRef } from "react";
import { X, Edit2, Save } from "lucide-react";
import TiptapEditor from "./QuillEditor";

export default function ModifyQuestion({ question, onClose }) {
  const [editTitle, setEditTitle] = useState(question.title);
  const [editContent, setEditContent] = useState(question.content);
  const [editTags, setEditTags] = useState(question.tags || []);
  const [editImages, setEditImages] = useState(question.images || []);
  const [newTag, setNewTag] = useState("");
  const [editingField, setEditingField] = useState(null); // 'title', 'content', 'tags', 'images'

  const imageInputRef = useRef(null);

  // Handlers for Title
  const handleSaveTitle = () => {
    console.log(`PATCH /edit-title/${question._id}`, { title: editTitle });
    setEditingField(null);
  };

  // Handlers for Content
  const handleSaveContent = () => {
    console.log(`PATCH /edit-content/${question._id}`, { content: editContent });
    setEditingField(null);
  };

  // Handlers for Tags
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !editTags.includes(tag) && editTags.length < 10) {
      console.log(`PATCH /add-tag/${question._id}`, { tag });
      setEditTags((prev) => [...prev, tag]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (idx) => {
    const tagToDelete = editTags[idx];
    console.log(`PATCH /delete-tag/${question._id}`, { tag: tagToDelete });
    setEditTags((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveTags = () => {
    // Generally you could batch save tags here if needed
    setEditingField(null);
  };

  // Handlers for Images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...editImages, ...files].slice(0, 5);
    setEditImages(combined);
  };

  const handleDeleteImage = (idx) => {
    const imageToDelete = editImages[idx];
    // Here just log delete — you can adjust if backend expects URLs or identifiers
    console.log(`PATCH /delete-image/${question._id}`, { image: imageToDelete });
    setEditImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveImages = () => {
    console.log(`PATCH /edit-images/${question._id}`, { images: editImages });
    setEditingField(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-3xl bg-[#2E236C] rounded-xl p-6 shadow-2xl border-2 border-[#433D8B]/40 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-[#433D8B] rounded-full p-2 hover:bg-[#2E236C] transition-colors"
          aria-label="Close modify question"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <section className="mb-6">
          <h2 className="text-white text-xl font-semibold mb-2 flex items-center justify-between">
            Question Title
            {editingField !== "title" && (
              <button
                onClick={() => setEditingField("title")}
                className="text-[#C8ACD6] hover:text-white"
                aria-label="Edit title"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </h2>

          {editingField === "title" ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-grow px-3 py-2 rounded-lg bg-[#2E236C]/70 text-white border border-[#433D8B]"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="bg-[#433D8B] px-4 py-2 rounded-lg text-white hover:bg-[#2E236C]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditTitle(question.title);
                  setEditingField(null);
                }}
                className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="text-white/90">{editTitle}</p>
          )}
        </section>

        {/* Content */}
        <section className="mb-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white text-xl font-semibold">Content</h2>
            {editingField !== "content" && (
              <button
                onClick={() => setEditingField("content")}
                className="text-[#C8ACD6] hover:text-white"
                aria-label="Edit content"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
          {editingField === "content" ? (
            <>
              <div className="flex-grow min-h-[160px] bg-[#2E236C]/70 rounded-lg p-2 mb-2 border border-[#433D8B] overflow-auto">
                <TiptapEditor value={editContent} setValue={setEditContent} />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveContent}
                  className="bg-[#433D8B] px-4 py-2 rounded-lg text-white hover:bg-[#2E236C]"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditContent(question.content);
                    setEditingField(null);
                  }}
                  className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div
              className="prose prose-invert max-w-none text-white overflow-auto max-h-[150px]"
              dangerouslySetInnerHTML={{ __html: editContent }}
            />
          )}
        </section>

        {/* Tags */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white text-xl font-semibold">Tags</h2>
            {editingField !== "tags" && (
              <button
                onClick={() => setEditingField("tags")}
                className="text-[#C8ACD6] hover:text-white"
                aria-label="Edit tags"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
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
                      className="text-white/70 hover:text-red-400 transition-colors duration-200"
                      aria-label={`Delete tag ${tag}`}
                    >
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
                  className="bg-[#433D8B] px-4 py-2 rounded-lg text-white hover:bg-[#2E236C]"
                >
                  Add
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveTags}
                  className="bg-[#433D8B] px-4 py-2 rounded-lg text-white hover:bg-[#2E236C]"
                >
                  Save Tags
                </button>
                <button
                  onClick={() => {
                    setEditTags(question.tags || []);
                    setNewTag("");
                    setEditingField(null);
                  }}
                  className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2 max-w-full">
              {editTags.length === 0 ? (
                <p className="text-white/70">No tags assigned</p>
              ) : (
                editTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#C8ACD6]/20 text-[#C8ACD6] px-3 py-1 rounded-full text-sm border border-[#C8ACD6]/30"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>
          )}
        </section>

        {/* Images */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white text-xl font-semibold">Images</h2>
            {editingField !== "images" && (
              <button
                onClick={() => setEditingField("images")}
                className="text-[#C8ACD6] hover:text-white"
                aria-label="Edit images"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
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
                <button
                  onClick={handleSaveImages}
                  className="bg-[#433D8B] px-4 py-2 rounded-lg text-white hover:bg-[#2E236C]"
                >
                  Save Images
                </button>
                <button
                  onClick={() => {
                    setEditImages(question.images || []);
                    setEditingField(null);
                  }}
                  className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
                >
                  Cancel
                </button>
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
        </section>
      </div>
    </div>
  );
}
