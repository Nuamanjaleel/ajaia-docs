import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { supabase } from './lib/supabase';
import { parseUploadedFile } from './lib/fileParser';
import EditorToolbar from './components/EditorToolbar';
import ShareModal from './components/ShareModal';
import { FileText, Plus, Share2, Save, FileUp, Trash2 } from 'lucide-react';

const SEEDED_USERS = [
  { id: 'user_alice', name: 'Alice (Engineering)', email: 'alice@ajaia.io' },
  { id: 'user_bob', name: 'Bob (Product)', email: 'bob@ajaia.io' },
  { id: 'user_charlie', name: 'Charlie (Design)', email: 'charlie@ajaia.io' },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(SEEDED_USERS[0]);
  const [documents, setDocuments] = useState([]);
  const [sharedDocs, setSharedDocs] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [title, setTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my_docs');

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '',
    onUpdate: () => setSaveStatus('Unsaved changes'),
  });

  useEffect(() => {
    loadDocuments();
  }, [currentUser]);

  async function loadDocuments() {
    const [{ data: owned }, { data: shares }] = await Promise.all([
      supabase.from('documents').select('*').eq('owner_id', currentUser.id).order('updated_at', { ascending: false }),
      supabase.from('document_shares').select('document_id, documents(*)').eq('shared_with_user_id', currentUser.id)
    ]);

    if (owned) setDocuments(owned);
    if (shares) setSharedDocs(shares.map(s => s.documents).filter(Boolean));

    if (owned && owned.length > 0 && !activeDoc) {
      openDoc(owned[0]);
    }
  }

  function openDoc(doc) {
    setActiveDoc(doc);
    setTitle(doc.title);
    if (editor) editor.commands.setContent(doc.content || '');
    setSaveStatus('Saved');
  }

  async function handleCreateNew() {
    const newDoc = {
      title: 'Untitled Document',
      content: '<p>Start typing here...</p>',
      owner_id: currentUser.id,
    };
    const { data, error } = await supabase.from('documents').insert(newDoc).select().single();
    if (error) alert("Error creating doc: " + error.message);
    else {
      await loadDocuments();
      openDoc(data);
    }
  }

  async function handleSave() {
    if (!activeDoc) return;
    setSaveStatus('Saving...');
    const htmlContent = editor.getHTML();
    const { error } = await supabase.from('documents').update({
      title,
      content: htmlContent,
      updated_at: new Date().toISOString()
    }).eq('id', activeDoc.id);

    if (error) {
      alert("Save failed: " + error.message);
      setSaveStatus('Error');
    } else {
      setSaveStatus('Saved');
      loadDocuments();
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const parsed = await parseUploadedFile(file);
      const { data, error } = await supabase.from('documents').insert({
        title: parsed.title,
        content: parsed.content,
        owner_id: currentUser.id,
      }).select().single();

      if (error) throw error;
      await loadDocuments();
      openDoc(data);
    } catch (err) {
      alert(err.message);
    } finally {
      e.target.value = ''; // Reset file input
    }
  }

  async function handleDeleteDoc(docId, e) {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) return;
    await supabase.from('documents').delete().eq('id', docId);
    if (activeDoc?.id === docId) setActiveDoc(null);
    loadDocuments();
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-stone-900 text-white p-2 rounded-lg font-serif font-bold text-lg">A</div>
          <span className="font-bold text-lg text-stone-900">AjaiaDocs</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">Simulated User:</span>
          <select
            value={currentUser.id}
            onChange={(e) => setCurrentUser(SEEDED_USERS.find(u => u.id === e.target.value))}
            className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-800 outline-none cursor-pointer"
          >
            {SEEDED_USERS.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto p-6 gap-6">
        <aside className="w-72 bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              onClick={handleCreateNew}
              className="flex-1 bg-stone-900 text-white py-2 px-3 rounded-xl text-sm font-medium hover:bg-stone-800 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Doc
            </button>
            <label className="bg-stone-100 text-stone-700 py-2 px-3 rounded-xl text-sm font-medium hover:bg-stone-200 cursor-pointer flex items-center justify-center gap-1.5 border border-stone-200" title="Import .txt, .md, .json">
              <FileUp className="w-4 h-4" /> Import
              <input type="file" accept=".txt,.md,.json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex border-b border-stone-200 text-sm">
            <button
              onClick={() => setActiveTab('my_docs')}
              className={`flex-1 py-2 font-medium border-b-2 ${activeTab === 'my_docs' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400'}`}
            >
              My Docs ({documents.length})
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`flex-1 py-2 font-medium border-b-2 ${activeTab === 'shared' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400'}`}
            >
              Shared ({sharedDocs.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            {(activeTab === 'my_docs' ? documents : sharedDocs).map(doc => (
              <div
                key={doc.id}
                onClick={() => openDoc(doc)}
                className={`p-3 rounded-xl text-sm cursor-pointer flex items-center justify-between group transition-colors ${activeDoc?.id === doc.id ? 'bg-stone-100 font-medium text-stone-900' : 'text-stone-600 hover:bg-stone-50'}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 shrink-0 text-stone-400" />
                  <span className="truncate">{doc.title}</span>
                </div>
                {activeTab === 'my_docs' && (
                  <button
                    onClick={(e) => handleDeleteDoc(doc.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col overflow-hidden">
          {activeDoc ? (
            <>
              <div className="p-4 border-b border-stone-200 flex items-center justify-between gap-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setSaveStatus('Unsaved changes'); }}
                  className="font-serif text-2xl font-bold text-stone-900 outline-none flex-1 bg-transparent border-b border-transparent focus:border-stone-300"
                  placeholder="Untitled Document"
                />

                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400">{saveStatus}</span>
                  <button
                    onClick={handleSave}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-stone-200"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  {activeDoc.owner_id === currentUser.id && (
                    <button
                      onClick={() => setIsShareOpen(true)}
                      className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  )}
                </div>
              </div>

              <EditorToolbar editor={editor} />

              <div className="flex-1 p-6 overflow-y-auto">
                <EditorContent editor={editor} className="prose max-w-none font-sans" />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400 p-8">
              <FileText className="w-12 h-12 stroke-1 mb-2" />
              <p>Select or create a document to start editing</p>
            </div>
          )}
        </main>
      </div>

      {isShareOpen && activeDoc && (
        <ShareModal
          doc={activeDoc}
          currentUser={currentUser}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </div>
  );
}