export interface Lesson {
  id: number;
  title: string;
  category: string;
  chapter: string;
  content: string;
  summary: string;
  genz_summary: string;
  image_url?: string;
}

export interface Quiz {
  id: number;
  lesson_id: number;
  question: string;
  options: string[]; // JSON string in DB, array in TS
  answer: string;
  type: 'theory' | 'practical';
}

export type View = 'home' | 'learning' | 'quiz' | 'profile';
