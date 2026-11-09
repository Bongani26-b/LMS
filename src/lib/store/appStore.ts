'use client';

import {
  UserProfile,
  UserRole,
  EducationalResource,
  LearningProgress,
  DocumentHighlight,
  Assessment,
  AssessmentQuestion,
  LearnerSubmission,
  AIStudyInteraction,
  Subject,
  School,
  Grade,
  Topic,
  AISettings,
} from '@/types';
import {
  INITIAL_GRADES,
  INITIAL_SCHOOLS,
  INITIAL_SUBJECTS,
  INITIAL_TOPICS,
  INITIAL_RESOURCES,
  INITIAL_ASSESSMENTS,
  INITIAL_QUESTIONS,
} from '@/lib/data/curriculumData';

const STORAGE_KEYS = {
  CURRENT_USER: 'dss_lms_current_user',
  RESOURCES: 'dss_lms_resources',
  PROGRESS: 'dss_lms_progress',
  HIGHLIGHTS: 'dss_lms_highlights',
  SUBMISSIONS: 'dss_lms_submissions',
  AI_INTERACTIONS: 'dss_lms_ai_interactions',
  AI_SETTINGS: 'dss_lms_ai_settings',
  SCHOOLS: 'dss_lms_schools',
  ASSESSMENTS: 'dss_lms_assessments',
};

// Default AI configuration
export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: 'local_fallback', // Can be 'ollama', 'openai_compatible', 'local_fallback'
  ollama_base_url: 'http://localhost:11434',
  ollama_model: 'llama3.2',
  temperature: 0.4,
  max_tokens: 1024,
  rag_enabled: true,
};

// Helper to safely read from localStorage
function getStoredItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export class AppStore {
  // Current logged in user profile
  static getCurrentUser(): UserProfile | null {
    return getStoredItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  static setCurrentUser(user: UserProfile | null): void {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Quick switch role for testing all personas
  static switchRole(role: UserRole): UserProfile {
    const currentUser = this.getCurrentUser();
    let updated: UserProfile;

    if (role === 'learner') {
      updated = {
        id: currentUser?.id || 'usr-learner-001',
        email: currentUser?.email || 'thabo.nkosi@student.school.za',
        full_name: currentUser?.full_name || 'Thabo Nkosi',
        role: 'learner',
        school_id: currentUser?.school_id || 'sch-001',
        school_name: 'Pretoria Boys High School',
        grade_id: currentUser?.grade_id || 'grade-10',
        grade_name: 'Grade 10',
        registration_status: 'active',
        enrolled_subject_ids: currentUser?.enrolled_subject_ids?.length
          ? currentUser.enrolled_subject_ids
          : ['subj-math-10', 'subj-phsc-10', 'subj-lfsc-10', 'subj-enhl-10'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else if (role === 'teacher') {
      updated = {
        id: 'usr-teacher-001',
        email: 'dr.smith@boyshigh.com',
        full_name: 'Dr. Evelyn Smith',
        role: 'teacher',
        school_id: 'sch-001',
        school_name: 'Pretoria Boys High School',
        registration_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else if (role === 'school_admin') {
      updated = {
        id: 'usr-admin-001',
        email: 'principal@boyshigh.com',
        full_name: 'Mr. David Mokoena (Principal)',
        role: 'school_admin',
        school_id: 'sch-001',
        school_name: 'Pretoria Boys High School',
        registration_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      updated = {
        id: 'usr-platform-001',
        email: 'director@education.gov.za',
        full_name: 'Platform Administrator',
        role: 'platform_admin',
        school_id: 'sch-001',
        school_name: 'Central Department of Basic Education',
        registration_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    this.setCurrentUser(updated);
    return updated;
  }

  // Schools
  static getSchools(): School[] {
    return getStoredItem<School[]>(STORAGE_KEYS.SCHOOLS, INITIAL_SCHOOLS);
  }

  static addSchool(school: Omit<School, 'id' | 'created_at'>): School {
    const schools = this.getSchools();
    const newSchool: School = {
      ...school,
      id: `sch-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    schools.push(newSchool);
    setStoredItem(STORAGE_KEYS.SCHOOLS, schools);
    return newSchool;
  }

  // Grades & Subjects
  static getGrades(): Grade[] {
    return INITIAL_GRADES;
  }

  static getSubjects(): Subject[] {
    return INITIAL_SUBJECTS;
  }

  static getSubjectsByGrade(gradeId: string): Subject[] {
    return INITIAL_SUBJECTS.filter((s) => s.grade_id === gradeId && s.is_active);
  }

  static getSubjectById(subjectId: string): Subject | undefined {
    return INITIAL_SUBJECTS.find((s) => s.id === subjectId);
  }

  // Topics
  static getTopics(subjectId?: string): Topic[] {
    if (!subjectId) return INITIAL_TOPICS;
    return INITIAL_TOPICS.filter((t) => t.subject_id === subjectId);
  }

  // Resources (Digital Library)
  static getResources(): EducationalResource[] {
    return getStoredItem<EducationalResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  }

  static getResourcesBySubject(subjectId: string): EducationalResource[] {
    return this.getResources().filter((r) => r.subject_id === subjectId && r.is_published);
  }

  static getResourceById(id: string): EducationalResource | undefined {
    return this.getResources().find((r) => r.id === id);
  }

  static addResource(resource: Omit<EducationalResource, 'id' | 'created_at' | 'updated_at' | 'download_count' | 'view_count'>): EducationalResource {
    const resources = this.getResources();
    const newResource: EducationalResource = {
      ...resource,
      id: `res-${Date.now()}`,
      download_count: 0,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    resources.unshift(newResource);
    setStoredItem(STORAGE_KEYS.RESOURCES, resources);
    return newResource;
  }

  static incrementResourceViews(id: string): void {
    const resources = this.getResources();
    const target = resources.find((r) => r.id === id);
    if (target) {
      target.view_count += 1;
      setStoredItem(STORAGE_KEYS.RESOURCES, resources);
    }
  }

  static incrementResourceDownloads(id: string): void {
    const resources = this.getResources();
    const target = resources.find((r) => r.id === id);
    if (target) {
      target.download_count += 1;
      setStoredItem(STORAGE_KEYS.RESOURCES, resources);
    }
  }

  // Learning Progress
  static getProgress(userId?: string): LearningProgress[] {
    const all = getStoredItem<LearningProgress[]>(STORAGE_KEYS.PROGRESS, []);
    if (!userId) return all;
    return all.filter((p) => p.learner_id === userId);
  }

  static updateReadingProgress(params: {
    learnerId: string;
    subjectId: string;
    resourceId: string;
    page: number;
    totalPages: number;
    timeSpentSeconds?: number;
  }): LearningProgress {
    const all = getStoredItem<LearningProgress[]>(STORAGE_KEYS.PROGRESS, []);
    let item = all.find(
      (p) => p.learner_id === params.learnerId && p.resource_id === params.resourceId
    );

    const percent = Math.min(100, Math.round((params.page / params.totalPages) * 100));
    const isCompleted = percent >= 95;

    if (item) {
      item.last_read_page = params.page;
      item.total_pages = params.totalPages;
      item.progress_percent = Math.max(item.progress_percent, percent);
      item.status = isCompleted ? 'completed' : 'in_progress';
      item.time_spent_seconds += params.timeSpentSeconds || 15;
      item.last_accessed_at = new Date().toISOString();
      if (isCompleted && !item.completed_at) {
        item.completed_at = new Date().toISOString();
      }
    } else {
      item = {
        id: `prog-${Date.now()}`,
        learner_id: params.learnerId,
        subject_id: params.subjectId,
        resource_id: params.resourceId,
        status: isCompleted ? 'completed' : 'viewed',
        progress_percent: percent,
        last_read_page: params.page,
        total_pages: params.totalPages,
        time_spent_seconds: params.timeSpentSeconds || 15,
        last_accessed_at: new Date().toISOString(),
        completed_at: isCompleted ? new Date().toISOString() : undefined,
      };
      all.push(item);
    }

    setStoredItem(STORAGE_KEYS.PROGRESS, all);
    return item;
  }

  // Highlights & Annotations
  static getHighlights(learnerId: string, resourceId?: string): DocumentHighlight[] {
    const all = getStoredItem<DocumentHighlight[]>(STORAGE_KEYS.HIGHLIGHTS, []);
    return all.filter(
      (h) => h.learner_id === learnerId && (!resourceId || h.resource_id === resourceId)
    );
  }

  static addHighlight(highlight: Omit<DocumentHighlight, 'id' | 'created_at'>): DocumentHighlight {
    const all = getStoredItem<DocumentHighlight[]>(STORAGE_KEYS.HIGHLIGHTS, []);
    const newHighlight: DocumentHighlight = {
      ...highlight,
      id: `hl-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    all.push(newHighlight);
    setStoredItem(STORAGE_KEYS.HIGHLIGHTS, all);
    return newHighlight;
  }

  static removeHighlight(id: string): void {
    const all = getStoredItem<DocumentHighlight[]>(STORAGE_KEYS.HIGHLIGHTS, []);
    const filtered = all.filter((h) => h.id !== id);
    setStoredItem(STORAGE_KEYS.HIGHLIGHTS, filtered);
  }

  // Assessments & Submissions
  static getAssessments(subjectId?: string): Assessment[] {
    const all = getStoredItem<Assessment[]>(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
    if (!subjectId) return all;
    return all.filter((a) => a.subject_id === subjectId && a.is_published);
  }

  static getQuestions(assessmentId: string): AssessmentQuestion[] {
    return INITIAL_QUESTIONS.filter((q) => q.assessment_id === assessmentId);
  }

  static getSubmissions(learnerId?: string): LearnerSubmission[] {
    const all = getStoredItem<LearnerSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
    if (!learnerId) return all;
    return all.filter((s) => s.learner_id === learnerId);
  }

  static submitAssessment(
    assessmentId: string,
    learnerId: string,
    answers: Record<string, string>
  ): LearnerSubmission {
    const questions = this.getQuestions(assessmentId);
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((q) => {
      maxScore += q.marks;
      if (answers[q.id] === q.correct_answer) {
        totalScore += q.marks;
      }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const all = getStoredItem<LearnerSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);

    const submission: LearnerSubmission = {
      id: `sub-${Date.now()}`,
      assessment_id: assessmentId,
      learner_id: learnerId,
      answers,
      total_score: totalScore,
      percentage,
      status: 'graded',
      feedback:
        percentage >= 75
          ? 'Distinction! Excellent mastery of CAPS concepts.'
          : percentage >= 50
          ? 'Good work. You have achieved curriculum competency. Review explanations for incorrect items.'
          : 'Needs revision. Review the textbook chapter and reattempt the exercise.',
      submitted_at: new Date().toISOString(),
      graded_at: new Date().toISOString(),
    };

    all.push(submission);
    setStoredItem(STORAGE_KEYS.SUBMISSIONS, all);
    return submission;
  }

  // AI Interactions
  static getAIInteractions(learnerId: string): AIStudyInteraction[] {
    const all = getStoredItem<AIStudyInteraction[]>(STORAGE_KEYS.AI_INTERACTIONS, []);
    return all.filter((i) => i.learner_id === learnerId);
  }

  static recordAIInteraction(
    interaction: Omit<AIStudyInteraction, 'id' | 'created_at'>
  ): AIStudyInteraction {
    const all = getStoredItem<AIStudyInteraction[]>(STORAGE_KEYS.AI_INTERACTIONS, []);
    const newEntry: AIStudyInteraction = {
      ...interaction,
      id: `ai-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    all.unshift(newEntry);
    setStoredItem(STORAGE_KEYS.AI_INTERACTIONS, all);
    return newEntry;
  }

  // AI Settings
  static getAISettings(): AISettings {
    return getStoredItem<AISettings>(STORAGE_KEYS.AI_SETTINGS, DEFAULT_AI_SETTINGS);
  }

  static updateAISettings(settings: Partial<AISettings>): AISettings {
    const current = this.getAISettings();
    const updated = { ...current, ...settings };
    setStoredItem(STORAGE_KEYS.AI_SETTINGS, updated);
    return updated;
  }
}

