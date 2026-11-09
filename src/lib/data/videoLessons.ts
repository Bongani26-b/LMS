export interface VideoLesson {
  id: string;
  title: string;
  subjectName: string;
  grade: string;
  duration: string;
  instructor: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
  linkedResourceId?: string;
}

export const CAPS_VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'vid-phsc-01',
    title: 'Chemical Bonding: Covalent vs. Ionic Bonds Explained',
    subjectName: 'Physical Sciences',
    grade: 'Grade 10',
    duration: '14:20',
    instructor: 'Dr. Evelyn Smith',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/S_7y5nO4vjE',
    description: 'Detailed explanation of electron transfer in ionic crystals and electron pair sharing in polar/non-polar covalent bonds.',
    linkedResourceId: 'res-phsc10-tb',
  },
  {
    id: 'vid-math-01',
    title: 'Algebra: Master Trinomial Factorisation and Quadratic Equations',
    subjectName: 'Mathematics',
    grade: 'Grade 10',
    duration: '18:45',
    instructor: 'Mr. David Mokoena',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/V6yixyiJcos',
    description: 'Step-by-step worked examples factoring ax² + bx + c, difference of squares, and common factor techniques for CAPS exams.',
    linkedResourceId: 'res-math10-sg',
  },
  {
    id: 'vid-lfsc-01',
    title: 'DNA: The Code of Life, Replication & Protein Synthesis',
    subjectName: 'Life Sciences',
    grade: 'Grade 12',
    duration: '22:10',
    instructor: 'Mrs. Zanele Dlamini',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/8kK2zwjRV0M',
    description: 'Visual 3D walkthrough of transcription in the nucleus and translation at the ribosome.',
    linkedResourceId: 'res-lfsc12-tb',
  },
  {
    id: 'vid-nsci-01',
    title: 'Photosynthesis & Cellular Respiration in Plants',
    subjectName: 'Natural Sciences',
    grade: 'Grade 8',
    duration: '12:35',
    instructor: 'Mr. Johan van der Merwe',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/UPBMG5EIyf8',
    description: 'How chloroplasts trap radiant solar energy to bake glucose and release oxygen, plus the iodine starch test.',
    linkedResourceId: 'res-nsci8-tb',
  },
];
