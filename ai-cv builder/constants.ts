
// FIX: Created file content to resolve module not found errors.
import { CVData, Section } from './types';

export const SECTIONS: { key: Section }[] = [
  { key: Section.PERSONAL_DETAILS },
  { key: Section.PROFESSIONAL_SUMMARY },
  { key: Section.WORK_EXPERIENCE },
  { key: Section.EDUCATION },
  { key: Section.PROJECTS },
  { key: Section.SKILLS },
  { key: Section.ACHIEVEMENTS },
  { key: Section.CERTIFICATES },
  { key: Section.STRENGTHS },
  { key: Section.HOBBIES },
];

export const ACCENT_COLORS = [
  '#4f46e5', // Indigo
  '#2563eb', // Blue
  '#16a34a', // Green
  '#ca8a04', // Amber
  '#dc2626', // Red
  '#db2777', // Pink
  '#581c87', // Purple
  '#171717', // Neutral
];

export const INITIAL_CV_DATA: CVData = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedIn: '',
    avatar: '',
    accentColor: ACCENT_COLORS[0],
  },
  professionalSummary: {
    summary: '',
  },
  workExperience: [],
  education: [],
  projects: [],
  skills: {
    text: '',
  },
  achievements: [],
  certificates: [],
  strengths: {
    text: '',
  },
  hobbies: {
    text: '',
  },
};

export const VOCABULARY_CATEGORIES: { [key: string]: string[] } = {
  'Professional Summary': ['Impactful Adjectives', 'Professional Traits', 'Key Verbs'],
  'Work Experience Description': ['Action Verbs', 'Achievement Keywords', 'Responsibility Phrases'],
  'Project Description': ['Project Verbs', 'Technical Terms', 'Result-oriented Words'],
  'Skills': ['Technical Skill Keywords', 'Soft Skill Synonyms'],
  'Achievements': ['Impact Verbs', 'Quantifiable Results'],
  'Certificates': ['Official Terminology', 'Relevant Skills'],
  'Strengths': ['Positive Adjectives', 'Character Traits'],
  'Hobbies': ['Action Verbs for Hobbies', 'Descriptive Words'],
};