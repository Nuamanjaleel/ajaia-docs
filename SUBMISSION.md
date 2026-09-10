# Submission Checklist — AjaiaDocs

## Deliverables Checklist
- [x] Complete React/Vite source code
- [x] `README.md` with setup & local execution instructions
- [x] `ARCHITECTURE.md` (Architecture Note)
- [x] `AI_WORKFLOW.md` (AI Workflow Note)
- [x] Live Deployment URL
- [x] Automated Vitest test suite (`src/lib/fileParser.test.js`)

## Completed Features
- **Document Creation & Editing**: Create, rename, rich-text edit (Bold, Italic, Underline, H1/H2, Lists), auto-save.
- **File Upload / Import**: Parses `.txt`, `.md`, and `.json` files into active document drafts.
- **Sharing**: Granular sharing with simulated users, Owner vs Shared tab separation.
- **Persistence**: PostgreSQL cloud database persistence via Supabase.

## What Would Be Built in Next 2-4 Hours
1. **PDF / Word Export**: Export current document state to downloadable `.pdf` or `.docx`.
2. **Document Version History**: Track changes over time with revert functionality.
3. **Inline Comments**: Allow shared users to highlight text and leave inline feedback.