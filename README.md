# AjaiaDocs

### Collaborative Document Editor

A lightweight full-stack document editor built for the **Ajaia AI-Native Engineering Assessment**.

AjaiaDocs provides rich-text editing, document sharing, file importing, and automatic cloud persistence through Supabase.

---

## ✨ Features

### 📝 Rich-Text Editor

* **Bold**
* *Italic*
* <u>Underline</u>
* H1 and H2 headings
* Bulleted lists
* Numbered lists

### 📁 File Import

Import existing content directly into your active document.

**Supported formats:**

* `.md`
* `.txt`
* `.json`

### 👥 Document Sharing

Share documents with team members while clearly separating:

* **Document Owner**
* **Shared Users**

Available team members:

`Alice` · `Bob` · `Charlie`

### ☁️ Cloud Persistence

Documents are automatically saved and persisted using:

**Supabase + PostgreSQL**

---

## 🛠️ Tech Stack

| Technology | Purpose                     |
| ---------- | --------------------------- |
| React      | Frontend                    |
| Vite       | Development & build tooling |
| JavaScript | Application logic           |
| Supabase   | Backend & cloud persistence |
| PostgreSQL | Database                    |
| Vitest     | Automated testing           |

---

# 🚀 Getting Started

Follow the steps below to run AjaiaDocs locally.

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ajaia-docs
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Supabase

Create a `.env` file in the **root directory** of the project.

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace the placeholder values with the credentials from your Supabase project.

> **Note:** Do not commit your `.env` file or expose sensitive credentials in the repository.

## 4. Start the Development Server

```bash
npm run dev
```

Vite will display the local development URL in your terminal.

Usually:

```text
http://localhost:5173
```

Open the URL in your browser to launch AjaiaDocs.

---

# 🧪 Testing

AjaiaDocs uses **Vitest** for automated testing.

From the project directory, run:

```bash
npx vitest run
```

The current test suite includes:

```text
fileParser.test.js
```

### Expected Result

```text
✓ 2 tests passed
```

All tests should pass successfully.

---

# 📂 File Import

AjaiaDocs currently supports importing:

| Format         | Supported |
| -------------- | :-------: |
| Markdown `.md` |     ✅     |
| Text `.txt`    |     ✅     |
| JSON `.json`   |     ✅     |

Imported content is parsed and loaded into the currently active document.

---

# 🔐 Environment Variables

The application requires two environment variables:

### `VITE_SUPABASE_URL`

Your Supabase project URL.

### `VITE_SUPABASE_ANON_KEY`

Your Supabase anonymous API key.

Example:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

# 📌 Project Highlights

AjaiaDocs demonstrates:

* Full-stack application development
* Rich-text document editing
* File parsing and importing
* Document sharing
* Cloud database persistence
* Supabase integration
* Automated testing with Vitest

---

# 📄 Assessment

Built as part of the **Ajaia AI-Native Engineering Assessment**.
