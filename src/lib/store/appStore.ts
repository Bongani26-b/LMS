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
  CommunityChannel,
  CommunityMessage,
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
  COMMUNITY_MESSAGES: 'dss_lms_community_messages',
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

  // ==========================================
  // Community Channels & Messages
  // ==========================================
  static getCommunityChannels(): CommunityChannel[] {
    return [
      {
        id: 'general',
        name: 'General Student Lounge',
        description: 'Connect with secondary students, share study tips, motivation, and school life discussions.',
        iconName: 'MessageSquare',
        category: 'general',
        memberCount: 1420,
      },
      {
        id: 'mathematics',
        name: 'Mathematics Help',
        subjectCode: 'MATH',
        subjectName: 'Mathematics',
        description: 'Algebra, trinomial factorisation, functions, geometry, trigonometry, and exam problems.',
        iconName: 'Calculator',
        category: 'subject',
        memberCount: 890,
      },
      {
        id: 'physical-sciences',
        name: 'Physical Sciences Help',
        subjectCode: 'PHSC',
        subjectName: 'Physical Sciences',
        description: 'Chemical bonding, stoichiometry, Newton’s laws, electric circuits, and science experiments.',
        iconName: 'Atom',
        category: 'subject',
        memberCount: 740,
      },
      {
        id: 'life-sciences',
        name: 'Life Sciences & Biology',
        subjectCode: 'LFSC',
        subjectName: 'Life Sciences',
        description: 'DNA replication, transcription & translation, genetics, human reproduction, and meiosis.',
        iconName: 'Dna',
        category: 'subject',
        memberCount: 680,
      },
      {
        id: 'natural-sciences',
        name: 'Natural Sciences (Grades 8–9)',
        subjectCode: 'NSCI',
        subjectName: 'Natural Sciences',
        description: 'Photosynthesis, respiration, atomic structure, and energy transfers for Senior Phase.',
        iconName: 'FlaskConical',
        category: 'subject',
        memberCount: 520,
      },
      {
        id: 'english-hl',
        name: 'English & Languages',
        subjectCode: 'ENHL',
        subjectName: 'English Home Language',
        description: 'Essay writing structures, prescribed poetry, comprehension skills, and literature analysis.',
        iconName: 'BookMarked',
        category: 'subject',
        memberCount: 460,
      },
      {
        id: 'accounting',
        name: 'Accounting & Commerce',
        subjectCode: 'ACCT',
        subjectName: 'Accounting',
        description: 'Ledgers, journals, income statements, balance sheets, and financial calculations.',
        iconName: 'Landmark',
        category: 'subject',
        memberCount: 310,
      },
    ];
  }

  static getCommunityMessages(channelId?: string): CommunityMessage[] {
    const all = getStoredItem<CommunityMessage[]>(STORAGE_KEYS.COMMUNITY_MESSAGES, this.getDefaultCommunityMessages());
    if (!channelId || channelId === 'all') {
      return all;
    }
    return all.filter((m) => m.channelId === channelId);
  }

  static sendCommunityMessage(msg: {
    channelId: string;
    authorId: string;
    authorName: string;
    authorGrade: string;
    authorAvatar?: string;
    content: string;
    isHelpRequest?: boolean;
    topicTag?: string;
  }): CommunityMessage {
    const all = getStoredItem<CommunityMessage[]>(STORAGE_KEYS.COMMUNITY_MESSAGES, this.getDefaultCommunityMessages());
    const newMessage: CommunityMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    all.push(newMessage);
    setStoredItem(STORAGE_KEYS.COMMUNITY_MESSAGES, all);
    return newMessage;
  }

  static toggleCommunityMessageLike(messageId: string, userId: string): CommunityMessage | null {
    const all = getStoredItem<CommunityMessage[]>(STORAGE_KEYS.COMMUNITY_MESSAGES, this.getDefaultCommunityMessages());
    const target = all.find((m) => m.id === messageId);
    if (!target) return null;

    target.likedBy = target.likedBy || [];
    const alreadyLiked = target.likedBy.includes(userId);

    if (alreadyLiked) {
      target.likedBy = target.likedBy.filter((id) => id !== userId);
      target.likes = Math.max(0, (target.likes || 1) - 1);
    } else {
      target.likedBy.push(userId);
      target.likes = (target.likes || 0) + 1;
    }

    setStoredItem(STORAGE_KEYS.COMMUNITY_MESSAGES, all);
    return target;
  }

  private static getDefaultCommunityMessages(): CommunityMessage[] {
    return [
      {
        id: 'msg-seed-01',
        channelId: 'mathematics',
        authorId: 'usr-sipho',
        authorName: 'Sipho Ndlovu',
        authorGrade: 'Grade 10',
        content: 'Hey everyone, I need quick help with trinomial factoring: when factorising x² - 5x - 24 = 0, how do you quickly find the pair of factors that add up to -5?',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        likes: 4,
        likedBy: ['usr-learner-001'],
        isHelpRequest: true,
        topicTag: 'Trinomial Factorisation',
      },
      {
        id: 'msg-seed-02',
        channelId: 'mathematics',
        authorId: 'usr-anika',
        authorName: 'Anika Patel',
        authorGrade: 'Grade 10',
        content: '@Sipho Ndlovu: List the factor pairs of 24 with opposite signs: (1, 24), (2, 12), (3, 8), (4, 6). Notice that -8 + 3 = -5! So the factors are (x - 8)(x + 3) = 0, giving x = 8 or x = -3.',
        createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        likes: 7,
        likedBy: [],
        topicTag: 'Worked Solution',
      },
      {
        id: 'msg-seed-03',
        channelId: 'physical-sciences',
        authorId: 'usr-lerato',
        authorName: 'Lerato Khumalo',
        authorGrade: 'Grade 10',
        content: 'Is an electronegativity difference of 1.2 considered polar covalent or ionic in CAPS exams? My notes say polar covalent but I want to be 100% sure before tomorrow’s test.',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        likes: 5,
        likedBy: [],
        isHelpRequest: true,
        topicTag: 'Chemical Bonding',
      },
      {
        id: 'msg-seed-04',
        channelId: 'physical-sciences',
        authorId: 'usr-kyle',
        authorName: 'Kyle Van Zyl',
        authorGrade: 'Grade 10',
        content: 'Yes @Lerato Khumalo! In CAPS Physical Sciences, non-polar is ΔEN < 0.4, polar covalent is 0.4 ≤ ΔEN < 2.1, and ionic is ΔEN ≥ 2.1. So 1.2 is definitely polar covalent!',
        createdAt: new Date(Date.now() - 3600000 * 4.2).toISOString(),
        likes: 9,
        likedBy: ['usr-learner-001'],
        topicTag: 'CAPS Electronegativity Rule',
      },
      {
        id: 'msg-seed-05',
        channelId: 'life-sciences',
        authorId: 'usr-zola',
        authorName: 'Zola Mthembu',
        authorGrade: 'Grade 12',
        content: 'Can someone summarize the 3 main steps of translation at the ribosome? Trying to memorize for Life Sciences Paper 2.',
        createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
        likes: 6,
        likedBy: [],
        isHelpRequest: true,
        topicTag: 'Protein Synthesis',
      },
      {
        id: 'msg-seed-06',
        channelId: 'life-sciences',
        authorId: 'usr-thabo',
        authorName: 'Thabo Nkosi',
        authorGrade: 'Grade 10',
        content: '1. mRNA attaches to ribosome. 2. tRNA brings specific amino acids matching the mRNA codon with its anticodon. 3. Peptide bonds join amino acids into a polypeptide chain until a stop codon is reached!',
        createdAt: new Date(Date.now() - 3600000 * 6.1).toISOString(),
        likes: 12,
        likedBy: [],
        topicTag: 'Study Summary',
      },
      {
        id: 'msg-seed-07',
        channelId: 'general',
        authorId: 'usr-kgothatso',
        authorName: 'Kgothatso Moloi',
        authorGrade: 'Grade 11',
        content: 'Welcome everyone to the student community! How is everyone tackling their study schedule for Term 1? Remember to take 10 minute breaks every 50 minutes to stay fresh.',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        likes: 15,
        likedBy: ['usr-learner-001'],
        topicTag: 'Study Tips',
      },
      {
        id: 'msg-seed-08',
        channelId: 'natural-sciences',
        authorId: 'usr-ayanda',
        authorName: 'Ayanda Sithole',
        authorGrade: 'Grade 8',
        content: 'Why do plants turn iodine solution dark blue-black during the photosynthesis starch test? Does anyone have the explanation?',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        likes: 3,
        likedBy: [],
        isHelpRequest: true,
        topicTag: 'Photosynthesis Starch Test',
      },
    ];
  }
}


