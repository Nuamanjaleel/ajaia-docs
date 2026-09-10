# AI-Native Workflow Note

## AI Tools Used
- **Claude 3.5 Sonnet / LLM Assistants**: Leveraged for rapid boilerplate generation, schema planning, and unit test generation.

## Material Speedups
1. **Schema Generation**: Accelerated PostgreSQL relational table definitions and initial seed data creation.
2. **TipTap Extension Binding**: Quickly mapped toolbar states (`editor.isActive('bold')`) to React components.
3. **File Parser Regex**: Generated Markdown header and formatting regex transformers for client-side file imports.

## Rejected or Modified AI Outputs
- **Rejected Real-time Yjs/WebSockets**: AI initial prompt suggestions included heavy real-time multiplayer WebSockets (Yjs / Socket.io). This was intentionally rejected to stay within the 4-6 hour timebox and focus on delivering a high-quality CRUD, file upload, and relational sharing experience.
- **Modified File Reader**: AI initially produced `file.text()` promises which triggered browser permission locks on cloud-synced files. Refactored to native `FileReader` API for cross-browser stability.

## Quality Verification
- Verified correctness using Vitest unit tests (`npx vitest run`).
- Conducted multi-user context manual testing across Alice, Bob, and Charlie accounts.