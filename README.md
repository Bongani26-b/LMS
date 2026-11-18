# Digital Secondary School Learning Management System (Grades 8–12)

A comprehensive, scalable, role-based Learning Management System engineered specifically for secondary schools, initialized with the **South African Curriculum and Assessment Policy Statement (CAPS)** standards for **Senior Phase (Grades 8–9)** and **Further Education and Training (FET Phase, Grades 10–12)**.

Login details
Email: learner@qrastudy.com
Password: Password123

---

## 1. Product Capabilities & Modules

### 🎓 Learner Journey
1. **Interactive Onboarding Wizard (`/onboarding`)**:
   - Legal name, school-issued or personal email identifier, password.
   - School selection from verified database registry with live school addition request workflow.
   - Grade selection: Grade 8, 9, 10, 11, or 12.
   - Dynamic subject selection based on the chosen school and CAPS grade offerings.
   - Direct configuration into the personalized dashboard.
2. **Personalized Learner Dashboard (`/dashboard`)**:
   - Welcome banner with learner name, grade level, verified school, term schedule (Term 1–4, 2026), and study time.
   - Real learning metrics: topics completed, in progress, and not started.
   - Real assessment performance tracking (average marks, assessment completion count).
   - Recent learning activity log (reading sessions, AI study queries, graded tests).
   - Subject roster cards linking to textbooks and practice tests.
3. **Digital Educational Library (`/library`)**:
   - Filter and search textbooks, study guides, worksheets, past exam papers, and revision notes.
   - File size and page count inspection.
   - Direct download and "Open in Document Reader" actions.
4. **Interactive Document Reader & Highlight-to-AI (`/reader`, `/reader/[id]`)**:
   - Page navigation, direct page entry, and zoom controls (75% to 150%).
   - Text selection with **floating contextual action bar**.
   - Persistent multi-color highlighting (yellow, green, purple).
   - **Highlight-to-AI**: Highlights any sentence or paragraph, clicks "Ask AI", and automatically passes the selected excerpt into the AI Study Panel with grounded answers.
5. **Formative & Summative Testing (`/assessments`, `/assessments/[id]`)**:
   - Real assessment questions with option selections and marks.
   - Automated scoring, feedback evaluation, and result recording into the learner's profile.
6. **Dedicated AI Study Tutor (`/ai-tutor`)**:
   - Full-page tutor with subject picker and prompt suggestions.
   - Grounded in approved curriculum material via Retrieval-Augmented Generation (RAG).

### 👩‍🏫 Teacher Studio (`/teacher`)
- Assigned subjects and class rosters.
- Resource upload center (`/teacher/upload`) with title, category, grade, subject, and text ingestion.
- Markbook and assessment submissions inspection (`/teacher/submissions`).

### 🏛️ School Administration (`/school-admin`)
- Verified school profile and EMS registration code.
- Grade-level CAPS subject offerings configuration.
- Learner and teacher roster management.

### ⚙️ Platform Administration (`/platform-admin`)
- National registry of secondary schools with approval workflow.
- Master CAPS curriculum catalog for Grades 8–12.
- AI inference configuration (`/platform-admin/ai-settings`): Ollama local endpoint, model selector (`llama3.2`, `mistral`, `gemma2`), temperature, and RAG vector search toggles.

---

## 2. Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & Relational Database**: Supabase (PostgreSQL), Next.js Server Components, API routes, Row Level Security (RLS).
- **AI & RAG Inference**:
  - Local inference via **Ollama** (`http://localhost:11434`) using open-weight models (`llama3.2`, `mistral`, `gemma2`, `phi3`).
  - Open AI-compatible provider abstraction layer for extensible cloud providers.
  - Specialized built-in CAPS Educational Intelligence Engine ensuring 0% downtime offline.
  - Context chunking and RAG similarity retrieval grounded in official educational resources.
- **Data Persistence**: Production Supabase clients (`client.ts`, `server.ts`) with zero-config local storage persistent store for immediate testing and verification.

---

## 3. Database Schema & Migrations

The complete database migration is located in `supabase/migrations/`:
- `supabase/migrations/20261109000000_init_schema.sql`: Full schema with 17 tables, Row Level Security (RLS) policies, foreign key cascades, and helper functions.
- `supabase/migrations/20261109000001_seed_caps_data.sql`: Official South African CAPS curriculum data (Grades 8–12), verified secondary schools (Pretoria Boys High, Westerford High, Durban High, Parktown Girls, Grey High), subject catalogs, and curriculum topics.

### Tables
1. `curricula`
2. `schools`
3. `academic_years` & `terms`
4. `grades` (Grades 8 to 12)
5. `subjects`
6. `school_subject_offerings`
7. `profiles`
8. `learner_enrollments`
9. `teacher_assignments`
10. `topics` & `subtopics` & `learning_outcomes`
11. `educational_resources` (Digital Library)
12. `learning_progress`
13. `document_highlights`
14. `assessments` & `assessment_questions` & `learner_submissions`
15. `ai_interactions`
16. `audit_logs`
17. `system_settings`

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+
- Optional: Ollama installed for local model inference (`ollama run llama3.2`)

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build

# 3. Start production server
npm run start
# Or start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Testing Role Personas

Use the **Role Persona Pill** in the top navigation bar to test all user roles with active authentication state:
- 🎓 **Learner**: Access personalized dashboard, enrolled subjects, document reader with highlight-to-AI, and practice tests.
- 👩‍🏫 **Teacher**: Manage class rosters, upload new textbooks/guides, and review student assessment submissions.
- 🏛️ **School Admin**: Configure school offerings, review academic schedules, and verify staff.
- ⚙️ **Platform Admin**: Inspect system health, approve new schools, and configure AI model parameters.

