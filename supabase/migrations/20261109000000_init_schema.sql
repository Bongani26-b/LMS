-- ==============================================================================
-- DIGITAL SECONDARY SCHOOL LMS (GRADES 8-12)
-- Master Database Schema, Row Level Security (RLS) & CAPS Curriculum Seed
-- ==============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Vector extension for RAG embeddings (pgvector)
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS "vector";
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Vector extension could not be enabled; document embeddings will fallback to text search';
END $$;

-- 1. CURRICULA
CREATE TABLE IF NOT EXISTS public.curricula (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  country TEXT NOT NULL DEFAULT 'South Africa',
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SCHOOLS
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  ems_code TEXT UNIQUE,
  province TEXT NOT NULL,
  district TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_approval', 'inactive')),
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. ACADEMIC YEARS & TERMS
CREATE TABLE IF NOT EXISTS public.academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL, -- e.g. "2026"
  is_current BOOLEAN NOT NULL DEFAULT false,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  term_number INT NOT NULL CHECK (term_number BETWEEN 1 AND 4),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(academic_year_id, term_number)
);

-- 4. GRADES
CREATE TABLE IF NOT EXISTS public.grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- 'grade-8', 'grade-9', 'grade-10', 'grade-11', 'grade-12'
  name TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('Senior Phase', 'FET Phase')),
  sequence_order INT NOT NULL UNIQUE
);

-- 5. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curriculum_id UUID NOT NULL REFERENCES public.curricula(id) ON DELETE CASCADE,
  grade_id UUID NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Languages',
    'Mathematical Sciences',
    'Natural Sciences',
    'Business, Commerce and Management',
    'Humanities and Social Sciences',
    'Services',
    'Technology'
  )),
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(curriculum_id, grade_id, code)
);

-- 6. SCHOOL SUBJECT OFFERINGS
CREATE TABLE IF NOT EXISTS public.school_subject_offerings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  is_offered BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(school_id, subject_id, academic_year_id)
);

-- 7. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'teacher', 'school_admin', 'platform_admin')),
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  grade_id UUID REFERENCES public.grades(id) ON DELETE SET NULL,
  phone TEXT,
  avatar_url TEXT,
  registration_status TEXT NOT NULL DEFAULT 'active' CHECK (registration_status IN ('pending_approval', 'active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. LEARNER ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.learner_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(learner_id, subject_id, academic_year_id)
);

-- 9. TEACHER ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(teacher_id, subject_id, school_id, academic_year_id)
);

-- 10. SUBJECT TOPICS & SUBTOPICS
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  term_id UUID REFERENCES public.terms(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  sequence_order INT NOT NULL DEFAULT 1,
  estimated_hours NUMERIC NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.subtopics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sequence_order INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.learning_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 11. EDUCATIONAL RESOURCES (DIGITAL LIBRARY)
CREATE TABLE IF NOT EXISTS public.educational_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'epub', 'docx', 'pptx', 'image', 'video', 'html')),
  category TEXT NOT NULL CHECK (category IN (
    'textbook',
    'study_guide',
    'worksheet',
    'past_paper',
    'revision_note',
    'teacher_resource'
  )),
  grade_id UUID NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE, -- null if platform-wide
  term_id UUID REFERENCES public.terms(id) ON DELETE SET NULL,
  academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  copyright_notice TEXT,
  permissions TEXT NOT NULL DEFAULT 'public_to_grade' CHECK (permissions IN ('public_to_grade', 'school_only', 'class_only')),
  download_count INT NOT NULL DEFAULT 0,
  view_count INT NOT NULL DEFAULT 0,
  pages_count INT NOT NULL DEFAULT 1,
  extracted_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. LEARNING PROGRESS & TRACKING
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.educational_resources(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'viewed', 'in_progress', 'completed')),
  progress_percent INT NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  last_read_page INT DEFAULT 1,
  total_pages INT DEFAULT 1,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  UNIQUE(learner_id, subject_id, topic_id, resource_id)
);

-- 13. DOCUMENT HIGHLIGHTS & ANNOTATIONS
CREATE TABLE IF NOT EXISTS public.document_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.educational_resources(id) ON DELETE CASCADE,
  page_number INT NOT NULL DEFAULT 1,
  selected_text TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'purple', 'pink')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. ASSESSMENTS & EXERCISES
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  grade_id UUID NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
  term_id UUID REFERENCES public.terms(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('quiz', 'assignment', 'test', 'exam', 'practice')),
  total_marks INT NOT NULL DEFAULT 100,
  passing_marks INT NOT NULL DEFAULT 50,
  due_date TIMESTAMPTZ,
  time_limit_minutes INT,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'short_answer', 'true_false', 'essay')),
  question_text TEXT NOT NULL,
  options JSONB, -- Array of strings for MCQ
  correct_answer TEXT,
  explanation TEXT,
  marks INT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.learner_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_score NUMERIC NOT NULL DEFAULT 0,
  percentage NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'reviewed')),
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(assessment_id, learner_id)
);

-- 15. AI STUDY SESSIONS & INTERACTIONS
CREATE TABLE IF NOT EXISTS public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.educational_resources(id) ON DELETE SET NULL,
  highlighted_text TEXT,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  context_retrieved TEXT,
  model_used TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.curricula ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_subject_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Public read for Curricula, Grades, Subjects
CREATE POLICY "Anyone can view curricula" ON public.curricula FOR SELECT USING (true);
CREATE POLICY "Anyone can view grades" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Anyone can view active subjects" ON public.subjects FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view schools" ON public.schools FOR SELECT USING (status = 'active');

-- Profiles policies
CREATE POLICY "Users can view profiles in their school or their own" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR
    school_id = public.current_user_school_id() OR
    public.current_user_role() = 'platform_admin'
  );

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Educational Resources policies
CREATE POLICY "Users can view published resources for their school or platform-wide" ON public.educational_resources
  FOR SELECT USING (
    is_published = true AND (
      school_id IS NULL OR
      school_id = public.current_user_school_id() OR
      public.current_user_role() = 'platform_admin'
    )
  );

CREATE POLICY "Teachers and admins can insert resources" ON public.educational_resources
  FOR INSERT WITH CHECK (
    public.current_user_role() IN ('teacher', 'school_admin', 'platform_admin')
  );

-- Highlights policies: private to learner
CREATE POLICY "Learners can manage their own highlights" ON public.document_highlights
  FOR ALL USING (learner_id = auth.uid());

-- Learning Progress policies: private to learner + readable by teacher/admin
CREATE POLICY "Learners manage their own progress" ON public.learning_progress
  FOR ALL USING (learner_id = auth.uid());

CREATE POLICY "Teachers can view progress of learners in their school" ON public.learning_progress
  FOR SELECT USING (
    public.current_user_role() IN ('teacher', 'school_admin', 'platform_admin')
  );

-- Assessments policies
CREATE POLICY "Anyone enrolled can view published assessments" ON public.assessments
  FOR SELECT USING (
    is_published = true AND (
      school_id = public.current_user_school_id() OR
      public.current_user_role() = 'platform_admin'
    )
  );

-- Submissions policies
CREATE POLICY "Learners can view and create their own submissions" ON public.learner_submissions
  FOR ALL USING (learner_id = auth.uid());

CREATE POLICY "Teachers can view and grade submissions for their school" ON public.learner_submissions
  FOR ALL USING (
    public.current_user_role() IN ('teacher', 'school_admin', 'platform_admin')
  );

-- AI Interactions: private to learner
CREATE POLICY "Learners manage their own AI interactions" ON public.ai_interactions
  FOR ALL USING (learner_id = auth.uid());

