
// FIX: Created file content to resolve module not found errors.
export enum Section {
    PERSONAL_DETAILS = 'Personal Details',
    PROFESSIONAL_SUMMARY = 'Professional Summary',
    WORK_EXPERIENCE = 'Work Experience',
    EDUCATION = 'Education',
    PROJECTS = 'Projects',
    SKILLS = 'Skills',
    ACHIEVEMENTS = 'Achievements',
    CERTIFICATES = 'Certificates',
    STRENGTHS = 'Strengths',
    HOBBIES = 'Hobbies',
}

export type Template = 'modern' | 'classic' | 'creative';

export interface PersonalDetails {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn: string;
    avatar: string;
    accentColor: string;
}

export interface ProfessionalSummary {
    summary: string;
}

export interface WorkExperienceItem {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface EducationItem {
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface ProjectItem {
    id: string;
    name: string;
    description: string;
    link: string;
    technologies: string;
}

export interface Skills {
    text: string;
}

export interface AchievementItem {
    id: string;
    description: string;
}

export interface CertificateItem {
    id: string;
    name: string;
    issuer: string;
    date: string;
}

export interface Strengths {
    text: string;
}

export interface Hobbies {
    text: string;
}


export interface CVData {
    personalDetails: PersonalDetails;
    professionalSummary: ProfessionalSummary;
    workExperience: WorkExperienceItem[];
    education: EducationItem[];
    projects: ProjectItem[];
    skills: Skills;
    achievements: AchievementItem[];
    certificates: CertificateItem[];
    strengths: Strengths;
    hobbies: Hobbies;
}

export type SectionKey = keyof CVData;

export interface AIProofreadSuggestion {
    original: string;
    corrected: string;
    explanation: string;
}