export type UserRole = 'learner' | 'teacher' | 'school_admin' | 'platform_admin';

export type RegistrationStatus = 'pending_approval' | 'active' | 'suspended';

export interface Curriculum {
  id: string;
  code: string;
  name: string;
  description: string;
  country: string;
  version: string;
  is_active: boolean;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  ems_code?: string;
  province: string;
  district?: string;
  status: 'active' | 'pending_approval' | 'inactive';
  contact_email: string;
  contact_phone?: string;
  address?: string;
  created_at: string;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2026"
  is_current: boolean;
  start_date: string;
  end_date: string;
}

export interface Term {
  id: string;
  academic_year_id: string;
  term_number: number; // 1, 2, 3, 4
  name: string; // "Term 1"
  start_date: string;
  end_date: string;
}

export interface Grade {
  id: string;
  code: string; // "grade-8", "grade-9", "grade-10", "grade-11", "grade-12"
  name: string; // "Grade 8"
  phase: 'Senior Phase' | 'FET Phase';
  sequence_order: number;
}

export type SubjectCategory =
  | 'Languages'
  | 'Mathematical Sciences'
  | 'Natural Sciences'
  | 'Business, Commerce and Management'
  | 'Humanities and Social Sciences'
  | 'Services'
  | 'Technology';

export interface Subject {
  id: string;
  curriculum_id: string;
  grade_id: string;
  code: string;
  name: string;
  category: SubjectCategory;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
}

export interface SchoolSubjectOffering {
  id: string;
  school_id: string;
  subject_id: string;
  academic_year_id: string;
  is_offered: boolean;
}

export interface Topic {
  id: string;
  subject_id: string;
  term_id?: string;
  title: string;
  description: string;
  sequence_order: number;
  estimated_hours: number;
}

export interface Subtopic {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  sequence_order: number;
}

export interface LearningOutcome {
  id: string;
  topic_id: string;
  code: string;
  description: string;
}

export type ResourceCategory =
  | 'textbook'
  | 'study_guide'
  | 'worksheet'
  | 'past_paper'
  | 'revision_note'
  | 'teacher_resource';

export type FileType = 'pdf' | 'epub' | 'docx' | 'pptx' | 'image' | 'video' | 'html';

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  file_url: string;
  storage_path: string;
  file_size_bytes: number;
  file_type: FileType;
  category: ResourceCategory;
  grade_id: string;
  subject_id: string;
  topic_id?: string;
  school_id?: string | null; // null if platform-wide
  term_id?: string;
  academic_year_id?: string;
  uploaded_by: string; // user profile id
  uploaded_by_name?: string;
  is_published: boolean;
  copyright_notice?: string;
  permissions: 'public_to_grade' | 'school_only' | 'class_only';
  download_count: number;
  view_count: number;
  pages_count: number;
  extracted_text?: string;
  created_at: string;
  updated_at: string;
}

export type ProgressStatus = 'not_started' | 'viewed' | 'in_progress' | 'completed';

export interface LearningProgress {
  id: string;
  learner_id: string;
  subject_id: string;
  topic_id?: string;
  resource_id?: string;
  status: ProgressStatus;
  progress_percent: number; // 0 to 100
  last_read_page?: number;
  total_pages?: number;
  time_spent_seconds: number;
  last_accessed_at: string;
  completed_at?: string;
}

export interface DocumentHighlight {
  id: string;
  learner_id: string;
  resource_id: string;
  page_number: number;
  selected_text: string;
  color: 'yellow' | 'green' | 'blue' | 'purple' | 'pink';
  note?: string;
  created_at: string;
}

export type AssessmentType = 'quiz' | 'assignment' | 'test' | 'exam' | 'practice';

export interface Assessment {
  id: string;
  school_id: string;
  subject_id: string;
  grade_id: string;
  term_id?: string;
  title: string;
  description: string;
  assessment_type: AssessmentType;
  total_marks: number;
  passing_marks: number;
  due_date?: string;
  time_limit_minutes?: number;
  created_by: string;
  is_published: boolean;
  created_at: string;
}

export type QuestionType = 'multiple_choice' | 'short_answer' | 'true_false' | 'essay';

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_number: number;
  question_type: QuestionType;
  question_text: string;
  options?: string[]; // for multiple_choice
  correct_answer?: string;
  explanation?: string;
  marks: number;
}

export interface LearnerSubmission {
  id: string;
  assessment_id: string;
  learner_id: string;
  answers: Record<string, string>; // question_id -> answer
  total_score: number;
  percentage: number;
  status: 'submitted' | 'graded' | 'reviewed';
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
  graded_by?: string;
}

export interface AIStudyInteraction {
  id: string;
  learner_id: string;
  subject_id: string;
  resource_id?: string;
  highlighted_text?: string;
  prompt: string;
  response: string;
  context_retrieved?: string;
  model_used: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  school_id: string;
  school_name?: string;
  grade_id?: string;
  grade_name?: string;
  phone?: string;
  avatar_url?: string;
  registration_status: RegistrationStatus;
  enrolled_subject_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface AISettings {
  provider: 'ollama' | 'openai_compatible' | 'local_fallback';
  ollama_base_url: string;
  ollama_model: string;
  openai_base_url?: string;
  openai_api_key?: string;
  openai_model?: string;
  temperature: number;
  max_tokens: number;
  rag_enabled: boolean;
}

