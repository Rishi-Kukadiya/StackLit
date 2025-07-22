// // import React, { useEffect } from "react";
// // import { useEditor, EditorContent } from "@tiptap/react";
// // import StarterKit from "@tiptap/starter-kit";
// // import Bold from "@tiptap/extension-bold";
// // import Italic from "@tiptap/extension-italic";
// // import Underline from "@tiptap/extension-underline";
// // import Link from "@tiptap/extension-link";
// // import Image from "@tiptap/extension-image";

// // const TiptapEditor = ({ value, setValue }) => {
// //   const editor = useEditor({
// //     extensions: [
// //       StarterKit,
// //       Bold,
// //       Italic,
// //       Underline,
// //       Link,
// //       Image,
// //     ],
// //     content: value,
// //     onUpdate: ({ editor }) => {
// //       setValue(editor.getHTML());
// //     },
// //     editorProps: {
// //       attributes: {
// //         class: "bg-none rounded-lg border border-[#433D8B] min-h-[180px] p-3 focus:outline-none",
// //       },
// //     },
// //   });

// //   useEffect(() => {
// //     if (editor && value !== editor.getHTML()) {
// //       editor.commands.setContent(value);
// //     }
// //   }, [value]);

// //   return (
// //     <div>
// //       {/* Basic toolbar */}
// //       <div className="flex flex-wrap gap-2 mb-2">
// //         <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'font-bold text-[#433D8B]' : ''}>B</button>
// //         <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'italic text-[#433D8B]' : ''}>I</button>
// //         <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? 'underline text-[#433D8B]' : ''}>U</button>
// //         <button type="button" onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
// //         <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
// //         <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
// //         <button type="button" onClick={() => {
// //           const url = prompt('Enter image URL');
// //           if (url) editor.chain().focus().setImage({ src: url }).run();
// //         }}>Img</button>
// //         <button type="button" onClick={() => {
// //           const url = prompt('Enter link URL');
// //           if (url) editor.chain().focus().setLink({ href: url }).run();
// //         }}>Link</button>
// //       </div>
// //       <EditorContent editor={editor} />
// //     </div>
// //   );
// // };

// // export default TiptapEditor;



// import React, { useEffect } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Bold from "@tiptap/extension-bold";
// import Italic from "@tiptap/extension-italic";
// import Underline from "@tiptap/extension-underline";
// import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
// import { 
//   Bold as BoldIcon, 
//   Italic as ItalicIcon, 
//   Underline as UnderlineIcon,
//   List,
//   ListOrdered,
//   Image as ImageIcon,
//   Link as LinkIcon,
//   Heading1,
//   Heading2,
//   Quote,
//   Code,
//   Undo,
//   Redo
// } from "lucide-react";

// const TiptapEditor = ({ value, setValue }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Bold,
//       Italic,
//       Underline,
//       Link.configure({
//         openOnClick: false,
//       }),
//       Image,
//     ],
//     content: value,
//     onUpdate: ({ editor }) => {
//       setValue(editor.getHTML());
//     },
//     editorProps: {
//       attributes: {
//         class: "prose prose-invert max-w-none min-h-[200px] p-4 focus:outline-none text-white placeholder-white/50 bg-transparent",
//         style: "color: white !important;",
//       },
//     },
//   });

//   useEffect(() => {
//     if (editor && value !== editor.getHTML()) {
//       editor.commands.setContent(value);
//     }
//   }, [value, editor]);

//   if (!editor) {
//     return (
//       <div className="min-h-[250px] flex items-center justify-center text-white/50">
//         Loading editor...
//       </div>
//     );
//   }

//   const addImage = () => {
//     const url = window.prompt('Enter image URL:');
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run();
//     }
//   };

//   const addLink = () => {
//     const previousUrl = editor.getAttributes('link').href;
//     const url = window.prompt('Enter link URL:', previousUrl);
    
//     if (url === null) {
//       return;
//     }

//     if (url === '') {
//       editor.chain().focus().extendMarkRange('link').unsetLink().run();
//       return;
//     }

//     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };

//   const toolbarButtons = [
//     {
//       icon: BoldIcon,
//       label: "Bold",
//       action: () => editor.chain().focus().toggleBold().run(),
//       isActive: editor.isActive('bold'),
//       shortcut: "Ctrl+B"
//     },
//     {
//       icon: ItalicIcon,
//       label: "Italic",
//       action: () => editor.chain().focus().toggleItalic().run(),
//       isActive: editor.isActive('italic'),
//       shortcut: "Ctrl+I"
//     },
//     {
//       icon: UnderlineIcon,
//       label: "Underline",
//       action: () => editor.chain().focus().toggleUnderline().run(),
//       isActive: editor.isActive('underline'),
//       shortcut: "Ctrl+U"
//     },
//     {
//       icon: Heading1,
//       label: "Heading 1",
//       action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
//       isActive: editor.isActive('heading', { level: 1 })
//     },
//     {
//       icon: Heading2,
//       label: "Heading 2",
//       action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
//       isActive: editor.isActive('heading', { level: 2 })
//     },
//     {
//       icon: List,
//       label: "Bullet List",
//       action: () => editor.chain().focus().toggleBulletList().run(),
//       isActive: editor.isActive('bulletList')
//     },
//     {
//       icon: ListOrdered,
//       label: "Ordered List",
//       action: () => editor.chain().focus().toggleOrderedList().run(),
//       isActive: editor.isActive('orderedList')
//     },
//     {
//       icon: Quote,
//       label: "Quote",
//       action: () => editor.chain().focus().toggleBlockquote().run(),
//       isActive: editor.isActive('blockquote')
//     },
//     {
//       icon: Code,
//       label: "Code",
//       action: () => editor.chain().focus().toggleCode().run(),
//       isActive: editor.isActive('code')
//     },
//     {
//       icon: LinkIcon,
//       label: "Link",
//       action: addLink,
//       isActive: editor.isActive('link')
//     },
//     {
//       icon: ImageIcon,
//       label: "Image",
//       action: addImage,
//       isActive: false
//     }
//   ];

//   const historyButtons = [
//     {
//       icon: Undo,
//       label: "Undo",
//       action: () => editor.chain().focus().undo().run(),
//       disabled: !editor.can().undo()
//     },
//     {
//       icon: Redo,
//       label: "Redo", 
//       action: () => editor.chain().focus().redo().run(),
//       disabled: !editor.can().redo()
//     }
//   ];

//   return (
//     <div className="bg-transparent">
//       {/* Toolbar */}
//       <div className="border-b border-white/10 p-3 bg-white/5 backdrop-blur-sm">
//         <div className="flex flex-wrap items-center gap-1">
//           {/* Formatting Buttons */}
//           <div className="flex items-center gap-1 mr-3">
//             {toolbarButtons.map((button, index) => {
//               const Icon = button.icon;
//               return (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={button.action}
//                   title={button.label + (button.shortcut ? ` (${button.shortcut})` : '')}
//                   className={`p-2 rounded-lg transition-all duration-200 hover:bg-white/10 ${
//                     button.isActive 
//                       ? 'bg-[#C8ACD6]/20 text-[#C8ACD6] shadow-sm' 
//                       : 'text-white/70 hover:text-white'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                 </button>
//               );
//             })}
//           </div>

//           {/* Divider */}
//           <div className="w-px h-6 bg-white/20 mx-2" />

//           {/* History Buttons */}
//           <div className="flex items-center gap-1">
//             {historyButtons.map((button, index) => {
//               const Icon = button.icon;
//               return (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={button.action}
//                   disabled={button.disabled}
//                   title={button.label}
//                   className={`p-2 rounded-lg transition-all duration-200 ${
//                     button.disabled
//                       ? 'text-white/30 cursor-not-allowed'
//                       : 'text-white/70 hover:text-white hover:bg-white/10'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Editor Content */}
//       <div className="bg-transparent">
//         <EditorContent 
//           editor={editor} 
//           className="min-h-[200px] bg-transparent"
//         />
        
//         {/* Placeholder when empty */}
//         {editor.isEmpty && (
//           <div className="absolute top-16 left-4 text-white/50 pointer-events-none text-sm sm:text-base">
//             Describe your question in detail. Include any code, error messages, or context that would help others understand your problem...
//           </div>
//         )}
//       </div>

//       {/* Editor Styles */}
//       <style jsx global>{`
//         .ProseMirror {
//           background: transparent !important;
//           color: white !important;
//           outline: none !important;
//           padding: 1rem;
//           min-height: 200px;
//           font-size: 14px;
//           line-height: 1.6;
//         }

//         .ProseMirror h1 {
//           color: #C8ACD6 !important;
//           font-size: 1.75rem !important;
//           font-weight: bold !important;
//           margin: 1rem 0 0.5rem 0 !important;
//         }

//         .ProseMirror h2 {
//           color: #C8ACD6 !important;
//           font-size: 1.5rem !important;
//           font-weight: bold !important;
//           margin: 1rem 0 0.5rem 0 !important;
//         }

//         .ProseMirror h3 {
//           color: #C8ACD6 !important;
//           font-size: 1.25rem !important;
//           font-weight: bold !important;
//           margin: 1rem 0 0.5rem 0 !important;
//         }

//         .ProseMirror p {
//           color: white !important;
//           margin: 0.5rem 0 !important;
//         }

//         .ProseMirror ul, .ProseMirror ol {
//           color: white !important;
//           padding-left: 1.5rem !important;
//           margin: 0.5rem 0 !important;
//         }

//         .ProseMirror li {
//           color: white !important;
//           margin: 0.25rem 0 !important;
//         }

//         .ProseMirror blockquote {
//           border-left: 4px solid #C8ACD6 !important;
//           padding-left: 1rem !important;
//           margin: 1rem 0 !important;
//           color: #C8ACD6 !important;
//           font-style: italic !important;
//           background: rgba(200, 172, 214, 0.1) !important;
//           border-radius: 0 8px 8px 0 !important;
//         }

//         .ProseMirror code {
//           background: rgba(255, 255, 255, 0.1) !important;
//           color: #C8ACD6 !important;
//           padding: 0.25rem 0.5rem !important;
//           border-radius: 4px !important;
//           font-family: 'Courier New', monospace !important;
//           font-size: 0.9em !important;
//         }

//         .ProseMirror pre {
//           background: rgba(255, 255, 255, 0.05) !important;
//           color: white !important;
//           padding: 1rem !important;
//           border-radius: 8px !important;
//           margin: 1rem 0 !important;
//           border: 1px solid rgba(255, 255, 255, 0.1) !important;
//         }

//         .ProseMirror pre code {
//           background: transparent !important;
//           padding: 0 !important;
//           color: white !important;
//         }

//         .ProseMirror a {
//           color: #C8ACD6 !important;
//           text-decoration: underline !important;
//         }

//         .ProseMirror a:hover {
//           color: #E8D5E8 !important;
//         }

//         .ProseMirror img {
//           max-width: 100% !important;
//           height: auto !important;
//           border-radius: 8px !important;
//           margin: 1rem 0 !important;
//           border: 1px solid rgba(255, 255, 255, 0.1) !important;
//         }

//         .ProseMirror strong {
//           color: white !important;
//           font-weight: bold !important;
//         }

//         .ProseMirror em {
//           color: white !important;
//           font-style: italic !important;
//         }

//         .ProseMirror u {
//           color: white !important;
//           text-decoration: underline !important;
//         }

//         .ProseMirror:focus {
//           outline: none !important;
//         }

//         /* Mobile responsive styles */
//         @media (max-width: 640px) {
//           .ProseMirror {
//             font-size: 16px;
//             padding: 0.75rem;
//           }
          
//           .ProseMirror h1 {
//             font-size: 1.5rem !important;
//           }
          
//           .ProseMirror h2 {
//             font-size: 1.25rem !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default TiptapEditor;



import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Quote,
  Code,
  Undo,
  Redo
} from "lucide-react";

const TiptapEditor = ({ value, setValue }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'ordered-list',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'custom-blockquote',
          },
        },
      }),
      Bold,
      Italic,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'custom-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'custom-image',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[180px] p-4 focus:outline-none text-white bg-transparent",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[220px] flex items-center justify-center text-white/50">
        Loading editor...
      </div>
    );
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);
    
    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const toolbarButtons = [
    {
      icon: BoldIcon,
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: ItalicIcon,
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: UnderlineIcon,
      label: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 })
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 })
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList')
    },
    {
      icon: ListOrdered,
      label: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList')
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote')
    },
    {
      icon: Code,
      label: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code')
    },
    {
      icon: LinkIcon,
      label: "Link",
      action: addLink,
      isActive: editor.isActive('link')
    },
    {
      icon: ImageIcon,
      label: "Image",
      action: addImage,
      isActive: false
    }
  ];

  const historyButtons = [
    {
      icon: Undo,
      label: "Undo",
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo()
    },
    {
      icon: Redo,
      label: "Redo", 
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo()
    }
  ];

  return (
    <div className="bg-transparent relative">
      {/* Toolbar */}
      <div className="border-b border-white/20 p-3 bg-white/5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-1">
          {/* Formatting Buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            {toolbarButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={button.action}
                  title={button.label}
                  className={`p-2 rounded-lg transition-all duration-200 hover:bg-white/10 ${
                    button.isActive 
                      ? 'bg-[#C8ACD6]/30 text-[#C8ACD6] shadow-sm' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/30 mx-2" />

          {/* History Buttons */}
          <div className="flex items-center gap-1">
            {historyButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={button.action}
                  disabled={button.disabled}
                  title={button.label}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    button.disabled
                      ? 'text-white/30 cursor-not-allowed'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-transparent relative">
        <EditorContent 
          editor={editor} 
          className="min-h-[180px] bg-transparent"
        />
        
        {/* Placeholder when empty */}
        {editor.isEmpty && (
          <div className="absolute top-2 left-4 text-white/50 pointer-events-none">
            Describe your question in detail. Include code, error messages, or context...
          </div>
        )}
      </div>

      {/* Editor Styles */}
      <style jsx global>{`
        .ProseMirror {
          background: transparent !important;
          color: white !important;
          outline: none !important;
          padding: 1rem;
          min-height: 180px;
          font-size: 15px;
          line-height: 1.6;
        }

        .ProseMirror h1 {
          color: #C8ACD6 !important;
          font-size: 1.75rem !important;
          font-weight: bold !important;
          margin: 1rem 0 0.5rem 0 !important;
          line-height: 1.3 !important;
        }

        .ProseMirror h2 {
          color: #C8ACD6 !important;
          font-size: 1.5rem !important;
          font-weight: bold !important;
          margin: 1rem 0 0.5rem 0 !important;
          line-height: 1.3 !important;
        }

        .ProseMirror h3 {
          color: #C8ACD6 !important;
          font-size: 1.25rem !important;
          font-weight: bold !important;
          margin: 1rem 0 0.5rem 0 !important;
          line-height: 1.3 !important;
        }

        .ProseMirror p {
          color: white !important;
          margin: 0.75rem 0 !important;
        }

        /* Fixed bullet lists */
        .ProseMirror .bullet-list {
          color: white !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
          list-style-type: disc !important;
        }

        .ProseMirror .bullet-list li {
          color: white !important;
          margin: 0.5rem 0 !important;
          padding-left: 0.5rem !important;
          position: relative;
        }

        .ProseMirror .bullet-list li::marker {
          color: #C8ACD6 !important;
        }

        /* Fixed ordered lists */
        .ProseMirror .ordered-list {
          color: white !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
          list-style-type: decimal !important;
        }

        .ProseMirror .ordered-list li {
          color: white !important;
          margin: 0.5rem 0 !important;
          padding-left: 0.5rem !important;
        }

        .ProseMirror .ordered-list li::marker {
          color: #C8ACD6 !important;
          font-weight: bold !important;
        }

        /* Fixed blockquotes */
        .ProseMirror .custom-blockquote {
          border-left: 4px solid #C8ACD6 !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          color: #C8ACD6 !important;
          font-style: italic !important;
          background: rgba(200, 172, 214, 0.1) !important;
          border-radius: 0 8px 8px 0 !important;
          padding: 1rem !important;
        }

        .ProseMirror .custom-blockquote p {
          color: #C8ACD6 !important;
          margin: 0.5rem 0 !important;
        }

        .ProseMirror code {
          background: rgba(200, 172, 214, 0.2) !important;
          color: #C8ACD6 !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 6px !important;
          font-family: 'Courier New', monospace !important;
          font-size: 0.9em !important;
          border: 1px solid rgba(200, 172, 214, 0.3) !important;
        }

        .ProseMirror pre {
          background: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
          padding: 1rem !important;
          border-radius: 12px !important;
          margin: 1rem 0 !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          overflow-x: auto !important;
        }

        .ProseMirror pre code {
          background: transparent !important;
          padding: 0 !important;
          color: white !important;
          border: none !important;
        }

        .ProseMirror .custom-link {
          color: #C8ACD6 !important;
          text-decoration: underline !important;
          cursor: pointer !important;
        }

        .ProseMirror .custom-link:hover {
          color: #E8D5E8 !important;
          text-decoration: none !important;
        }

        .ProseMirror .custom-image {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 12px !important;
          margin: 1rem 0 !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          display: block !important;
        }

        .ProseMirror strong {
          color: white !important;
          font-weight: bold !important;
        }

        .ProseMirror em {
          color: white !important;
          font-style: italic !important;
        }

        .ProseMirror u {
          color: white !important;
          text-decoration: underline !important;
        }

        .ProseMirror:focus {
          outline: none !important;
        }

        /* Mobile responsive styles */
        @media (max-width: 640px) {
          .ProseMirror {
            font-size: 16px;
            padding: 0.75rem;
          }
          
          .ProseMirror h1 {
            font-size: 1.5rem !important;
          }
          
          .ProseMirror h2 {
            font-size: 1.25rem !important;
          }

          .ProseMirror .bullet-list,
          .ProseMirror .ordered-list {
            padding-left: 1.25rem !important;
          }
        }

        /* Selection styling */
        .ProseMirror ::selection {
          background: rgba(200, 172, 214, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;