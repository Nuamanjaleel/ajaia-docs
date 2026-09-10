import React from 'react';
import { Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered } from 'lucide-react';

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-stone-50 border-b border-stone-200 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('bold') ? 'bg-stone-300 font-bold' : ''}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('italic') ? 'bg-stone-300' : ''}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('underline') ? 'bg-stone-300' : ''}`}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-stone-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-stone-300' : ''}`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-stone-300' : ''}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-stone-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('bulletList') ? 'bg-stone-300' : ''}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('orderedList') ? 'bg-stone-300' : ''}`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  );
}