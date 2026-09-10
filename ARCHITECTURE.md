# AjaiaDocs — Architecture Note

## System Architecture & Stack Overview
AjaiaDocs is a lightweight, full-stack collaborative document editor designed to deliver core rich-text editing, file parsing/imports, and relational sharing mechanisms within a strict delivery constraint.

- **Frontend**: React 19 + Vite + Tailwind CSS v4.
- **Rich Text Core**: TipTap (ProseMirror wrapper) for modular, headless rich-text editing (Headings, Bold, Italic, Underline, Bulleted/Numbered Lists).
- **Backend & Persistence**: Supabase (Cloud PostgreSQL) managing relational schemas (`documents`, `app_users`, `document_shares`).
- **File Parsing Engine**: Client-side FileReader pipeline (`src/lib/fileParser.js`) converting Markdown (`.md`), plain text (`.txt`), and JSON into formatted rich HTML document drafts.

## Strategic Product Tradeoffs
1. **Simulated Multi-User Auth**: To maximize evaluation clarity, a top-bar user switcher (`Alice`, `Bob`, `Charlie`) was implemented instead of complex registration/login flows. This allows reviewers to immediately test multi-user sharing and permissions in seconds.
2. **Relational Sharing vs. Complex RBAC**: Implemented explicit owner-to-user mappings in `document_shares`. Owners maintain full control (editing, sharing, deleting), while shared users receive read/edit access separated into a dedicated "Shared" workspace tab.
3. **TipTap over native ContentEditable**: Avoided raw browser `contentEditable` bugs while keeping bundle size minimal and avoiding heavy external SaaS dependencies.