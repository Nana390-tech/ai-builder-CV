
import React from 'react';
import { CVData, Section } from '../../types';
import UserIcon from '../icons/UserIcon';
import EnvelopeIcon from '../icons/EnvelopeIcon';
import PhoneIcon from '../icons/PhoneIcon';
import LinkIcon from '../icons/LinkIcon';
import PhotoIcon from '../icons/PhotoIcon';

interface CreativeTemplateProps {
  data: CVData;
  activeSection: Section;
}

const SectionWrapper: React.FC<{
    title: string;
    sectionKey: Section;
    activeSection: Section;
    accentColor: string;
    children: React.ReactNode;
  }> = ({ title, sectionKey, activeSection, accentColor, children }) => {
    const isActive = activeSection === sectionKey;
    return (
      <div 
        className={`py-3 px-4 mb-4 rounded-lg transition-all duration-300 border-l-4 ${isActive ? '' : 'border-transparent'}`}
        style={isActive ? { borderColor: accentColor } : {}}
      >
        <h2 
          className="text-sm font-bold uppercase tracking-wider mb-3"
          style={{ color: accentColor }}
        >
          {title}
        </h2>
        {children}
      </div>
    );
};

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data, activeSection }) => {
  const { personalDetails, professionalSummary, workExperience, education, skills, projects, achievements, certificates, strengths, hobbies } = data;
  const accentColor = personalDetails.accentColor || '#4f46e5';

  const renderTags = (text: string, colorClass: string) => (
    <div className="flex flex-wrap gap-2">
      {text.split(',').map(item => item.trim()).filter(Boolean).map((item, index) => (
        <span key={index} className={`text-xs px-3 py-1 rounded-full ${colorClass}`}>{item}</span>
      ))}
    </div>
  );

  return (
    <div className="aspect-[210/297] mx-auto bg-white border text-xs font-sans">
      {/* Header */}
      <header 
        className={`flex items-center gap-6 p-6 transition-all duration-300 text-white`}
        style={{ backgroundColor: accentColor }}
      >
        {personalDetails.avatar && (
            <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-4 border-white/20 overflow-hidden">
                    <img src={personalDetails.avatar} alt={`${personalDetails.fullName || 'User'}'s avatar`} className="w-full h-full object-cover" />
                </div>
            </div>
        )}
        <div className="flex-grow">
            <h1 className="text-3xl font-bold tracking-wide">{personalDetails.fullName || 'YOUR NAME'}</h1>
            <p className="text-lg text-white/90">Student</p>
        </div>
        <div className="text-right text-[11px] space-y-1 text-white/90">
            {personalDetails.email && <div className="flex items-center justify-end gap-2"><p>{personalDetails.email}</p><EnvelopeIcon className="w-4 h-4"/></div>}
            {personalDetails.phone && <div className="flex items-center justify-end gap-2"><p>{personalDetails.phone}</p><PhoneIcon className="w-4 h-4"/></div>}
            {personalDetails.address && <div className="flex items-center justify-end gap-2"><p>{personalDetails.address}</p><UserIcon className="w-4 h-4"/></div>}
            {personalDetails.linkedIn && <div className="flex items-center justify-end gap-2"><a href={personalDetails.linkedIn} className="hover:underline">{personalDetails.linkedIn}</a><LinkIcon className="w-4 h-4"/></div>}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {professionalSummary.summary && (
            <SectionWrapper title="Summary" sectionKey={Section.PROFESSIONAL_SUMMARY} activeSection={activeSection} accentColor={accentColor}>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{professionalSummary.summary}</p>
            </SectionWrapper>
        )}

        {workExperience.length > 0 && (
            <SectionWrapper title="Experience" sectionKey={Section.WORK_EXPERIENCE} activeSection={activeSection} accentColor={accentColor}>
                {workExperience.map(job => (
                    <div key={job.id} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-sm" style={{ color: accentColor }}>{job.role || 'Job Role'}<span className="text-gray-800"> at {job.company || 'Company'}</span></h3>
                            <p className="text-[11px] text-gray-500 font-medium">{job.startDate} - {job.endDate}</p>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap mt-1 text-[11px]">{job.description}</p>
                    </div>
                ))}
            </SectionWrapper>
        )}

        {education.length > 0 && (
            <SectionWrapper title="Education" sectionKey={Section.EDUCATION} activeSection={activeSection} accentColor={accentColor}>
                 {education.map(edu => (
                    <div key={edu.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-baseline">
                             <h3 className="font-bold text-sm" style={{ color: accentColor }}>{edu.degree || 'Degree'}</h3>
                             <p className="text-[11px] text-gray-500 font-medium">{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="font-semibold text-gray-600">{edu.institution || 'Institution'}</p>
                    </div>
                 ))}
            </SectionWrapper>
        )}

        {projects.length > 0 && (
            <SectionWrapper title="Projects" sectionKey={Section.PROJECTS} activeSection={activeSection} accentColor={accentColor}>
                {projects.map(proj => (
                    <div key={proj.id} className="mb-3 last:mb-0">
                         <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-sm text-gray-800">{proj.name || 'Project Name'}</h3>
                            {proj.link && <a href={proj.link} className="text-[11px] hover:underline" style={{ color: accentColor }}>{proj.link}</a>}
                        </div>
                        {proj.technologies && (
                           <p className="text-[11px] text-gray-500 font-semibold my-1">Technologies: {proj.technologies}</p>
                        )}
                        <p className="text-gray-700 whitespace-pre-wrap mt-1 text-[11px]">{proj.description}</p>
                    </div>
                ))}
            </SectionWrapper>
        )}

        <div className="grid grid-cols-2 gap-x-6">
            {skills.text && (
                <SectionWrapper title="Skills" sectionKey={Section.SKILLS} activeSection={activeSection} accentColor={accentColor}>
                    {renderTags(skills.text, 'bg-indigo-100 text-indigo-800')}
                </SectionWrapper>
            )}
            {strengths.text && (
                <SectionWrapper title="Strengths" sectionKey={Section.STRENGTHS} activeSection={activeSection} accentColor={accentColor}>
                    {renderTags(strengths.text, 'bg-green-100 text-green-800')}
                </SectionWrapper>
            )}
        </div>
        
        {achievements.length > 0 && (
            <SectionWrapper title="Achievements" sectionKey={Section.ACHIEVEMENTS} activeSection={activeSection} accentColor={accentColor}>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-[11px]">
                    {achievements.map(item => <li key={item.id}>{item.description}</li>)}
                </ul>
            </SectionWrapper>
        )}
        
        {certificates.length > 0 && (
            <SectionWrapper title="Certificates" sectionKey={Section.CERTIFICATES} activeSection={activeSection} accentColor={accentColor}>
                 {certificates.map(item => (
                    <div key={item.id} className="mb-3 last:mb-0">
                        <h3 className="font-bold text-sm text-gray-800">{item.name}</h3>
                        <p className="font-semibold text-gray-600">{item.issuer} - {item.date}</p>
                    </div>
                 ))}
            </SectionWrapper>
        )}

         {hobbies.text && (
            <SectionWrapper title="Hobbies" sectionKey={Section.HOBBIES} activeSection={activeSection} accentColor={accentColor}>
                {renderTags(hobbies.text, 'bg-purple-100 text-purple-800')}
            </SectionWrapper>
        )}
      </main>
    </div>
  );
};

export default CreativeTemplate;