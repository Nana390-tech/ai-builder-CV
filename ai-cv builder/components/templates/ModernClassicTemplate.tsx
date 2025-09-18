
import React from 'react';
import { CVData, Section, Template } from '../../types';
import UserIcon from '../icons/UserIcon';
import EnvelopeIcon from '../icons/EnvelopeIcon';
import PhoneIcon from '../icons/PhoneIcon';
import LinkIcon from '../icons/LinkIcon';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import AcademicCapIcon from '../icons/AcademicCapIcon';
import CodeBracketIcon from '../icons/CodeBracketIcon';
import FolderOpenIcon from '../icons/FolderOpenIcon';
import PhotoIcon from '../icons/PhotoIcon';
import SparklesIcon from '../icons/SparklesIcon'; // Assuming a suitable icon
import CheckCircleIcon from '../icons/CheckCircleIcon'; // Assuming a suitable icon


interface ModernClassicTemplateProps {
  data: CVData;
  activeSection: Section;
  template: 'modern' | 'classic';
}

const SectionWrapper: React.FC<{
  title: string;
  icon?: React.ReactNode;
  sectionKey: Section;
  activeSection: Section;
  isModern: boolean;
  accentColor: string;
  children: React.ReactNode;
}> = ({ title, icon, sectionKey, activeSection, isModern, accentColor, children }) => {
  const isActive = activeSection === sectionKey;
  return (
    <div className={`p-4 mb-4 border-2 rounded-lg transition-all duration-300 ${isActive ? 'border-indigo-500 shadow-lg bg-indigo-50/50' : 'border-transparent'}`}>
      <h2 
        className={`text-sm font-bold uppercase pb-1 mb-3 flex items-center gap-2 ${isModern ? '' : 'text-gray-800'} border-b-2 border-gray-300`}
        style={isModern ? { color: accentColor } : {}}
      >
        {isModern && icon}
        {title}
      </h2>
      {children}
    </div>
  );
};


const ModernClassicTemplate: React.FC<ModernClassicTemplateProps> = ({ data, activeSection, template }) => {
  const { personalDetails, professionalSummary, workExperience, education, skills, projects, achievements, certificates, strengths, hobbies } = data;
  const isModern = template === 'modern';
  const fontClass = isModern ? 'font-sans' : 'font-serif';
  const textClass = 'text-gray-700 leading-relaxed';
  const accentColor = personalDetails.accentColor || '#4f46e5';
  
  const renderTags = (text: string, colorClass: string) => (
    <div className="flex flex-wrap gap-2">
      {text.split(',').map(item => item.trim()).filter(Boolean).map((item, index) => (
        <span key={index} className={`px-2 py-1 rounded-md ${isModern ? colorClass : 'border border-gray-300'}`}>{item}</span>
      ))}
    </div>
  );

  return (
    <div className={`aspect-[210/297] mx-auto p-8 bg-white border text-xs ${fontClass}`}>
      {/* Header */}
      <header className={`pb-4 border-b mb-4 p-4 border-2 rounded-lg transition-all flex items-center gap-6 ${activeSection === Section.PERSONAL_DETAILS ? 'border-indigo-500 shadow-lg bg-indigo-50/50' : 'border-transparent'}`}>
        <div className="flex-grow">
          <h1 className={`text-3xl font-bold text-gray-900 tracking-wide text-center ${!isModern && 'tracking-widest'}`}>{personalDetails.fullName || 'YOUR NAME'}</h1>
          <div className={`flex justify-center items-center gap-x-4 gap-y-1 mt-2 text-gray-600 flex-wrap ${isModern ? 'text-xs' : 'text-[11px]'}`}>
              {personalDetails.address && <span>{personalDetails.address}</span>}
              {isModern && personalDetails.address && <span className="text-gray-300">|</span>}
              {personalDetails.phone && <span>{personalDetails.phone}</span>}
              {isModern && personalDetails.phone && <span className="text-gray-300">|</span>}
              {personalDetails.email && <span>{personalDetails.email}</span>}
              {personalDetails.linkedIn && <span className="text-gray-300">|</span>}
              {personalDetails.linkedIn && <a href={personalDetails.linkedIn} className="hover:underline" style={{ color: accentColor }}>{personalDetails.linkedIn}</a>}
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden">
             {personalDetails.avatar ? (
                <img src={personalDetails.avatar} alt={`${personalDetails.fullName || 'User'}'s avatar`} className="w-full h-full object-cover" />
              ) : (
                <PhotoIcon className="w-10 h-10 text-gray-400" />
              )}
          </div>
        </div>
      </header>

      <main>
        {professionalSummary.summary && (
          <SectionWrapper title="Professional Summary" icon={<UserIcon className="w-4 h-4" />} sectionKey={Section.PROFESSIONAL_SUMMARY} activeSection={activeSection} isModern={isModern} accentColor={accentColor}>
            <p className={`${textClass} whitespace-pre-wrap`}>{professionalSummary.summary}</p>
          </SectionWrapper>
        )}

        {workExperience.length > 0 && (
           <SectionWrapper title="Work Experience" icon={<BriefcaseIcon className="w-4 h-4" />} sectionKey={Section.WORK_EXPERIENCE} activeSection={activeSection} isModern={isModern} accentColor={accentColor}>
            {workExperience.map(job => (
              <div key={job.id} className="mb-4 last:mb-0">
                <h3 className={`font-bold ${isModern ? 'text-base' : 'text-sm'} text-gray-800`}>{job.role || 'Job Role'} at {job.company || 'Company'}</h3>
                <p className="text-[11px] text-gray-500 italic my-1">{job.startDate} - {job.endDate}</p>
                <p className={`${textClass} whitespace-pre-wrap`}>{job.description}</p>
              </div>
            ))}
          </SectionWrapper>
        )}
        
        {education.length > 0 && (
          <SectionWrapper title="Education" icon={<AcademicCapIcon className="w-4 h-4" />} sectionKey={Section.EDUCATION} activeSection={activeSection} isModern={isModern} accentColor={accentColor}>
            {education.map(edu => (
              <div key={edu.id} className="mb-4 last:mb-0">
                <h3 className={`font-bold ${isModern ? 'text-base' : 'text-sm'} text-gray-800`}>{edu.degree || 'Degree'}</h3>
                <p className={`${textClass} font-semibold`}>{edu.institution || 'Institution'}</p>
                <p className="text-[11px] text-gray-500 italic my-1">{edu.startDate} - {edu.endDate}</p>
                <p className={`${textClass} whitespace-pre-wrap`}>{edu.description}</p>
              </div>
            ))}
          </SectionWrapper>
        )}

        {projects.length > 0 && (
            <SectionWrapper title="Projects" icon={<FolderOpenIcon className="w-4 h-4" />} sectionKey={Section.PROJECTS} activeSection={activeSection} isModern={isModern} accentColor={accentColor}>
              {projects.map(proj => (
                <div key={proj.id} className="mb-4 last:mb-0">
                  <h3 className={`font-bold ${isModern ? 'text-base' : 'text-sm'} text-gray-800`}>{proj.name || 'Project Name'}</h3>
                  {proj.link && <a href={proj.link} className="text-[11px] hover:underline" style={{ color: accentColor }}>{proj.link}</a>}
                  {proj.technologies && (
                    <p className="text-[11px] text-gray-500 italic my-1">Technologies: {proj.technologies}</p>
                  )}
                  <p className={`${textClass} whitespace-pre-wrap mt-1`}>{proj.description}</p>
                </div>
              ))}
            </SectionWrapper>
        )}

        {skills.text && (
          <SectionWrapper title="Skills" icon={<CodeBracketIcon className="w-4 h-4" />} sectionKey={Section.SKILLS} activeSection={activeSection} isModern={isModern} accentColor={accentColor}>
            {renderTags(skills.text, 'bg-indigo-100 text-indigo-800')}
          </SectionWrapper>
        )}
        
        {achievements.length > 0 && (
            <SectionWrapper title="Achievements" icon={<SparklesIcon className="w-4 h-4" />} sectionKey={Section.ACHIEVEMENTS} activeSection={activeSection} isModern={isModern} accentColor={accentColor}>
                <ul className="list-disc list-inside space-y-1">
                    {achievements.map(item => (
                        <li key={item.id} className={textClass}>{item.description}</li>
                    ))}
                </ul>
            </SectionWrapper>
        )}

        {certificates.length > 0 && (
            <SectionWrapper title="Certificates" icon={<CheckCircleIcon className="w-4 h-4" />} sectionKey={Section.CERTIFICATES} activeSection={activeSection} isModern={isModern} accentColor={accentColor}>
                 {certificates.map(item => (
                    <div key={item.id} className="mb-2 last:mb-0">
                        <h3 className={`font-bold ${isModern ? 'text-base' : 'text-sm'} text-gray-800`}>{item.name}</h3>
                        <p className={`${textClass} font-semibold`}>{item.issuer} - {item.date}</p>
                    </div>
                 ))}
            </SectionWrapper>
        )}

        {strengths.text && (
            <SectionWrapper title="Strengths" icon={<UserIcon className="w-4 h-4" />} sectionKey={Section.STRENGTHS} activeSection={activeSection} isModern={isModern} accentColor={accentColor}>
                {renderTags(strengths.text, 'bg-green-100 text-green-800')}
            </SectionWrapper>
        )}

        {hobbies.text && (
            <SectionWrapper title="Hobbies" icon={<SparklesIcon className="w-4 h-4" />} sectionKey={Section.HOBBIES} activeSection={activeSection} isModern={isModern} accentColor={accentColor}>
                {renderTags(hobbies.text, 'bg-purple-100 text-purple-800')}
            </SectionWrapper>
        )}
      </main>
    </div>
  );
};

export default ModernClassicTemplate;