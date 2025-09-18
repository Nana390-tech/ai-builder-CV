
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CVData, Section, SectionKey, WorkExperienceItem, EducationItem, ProjectItem, AchievementItem, CertificateItem } from '../types';
import { SECTIONS, ACCENT_COLORS } from '../constants';
import { SaveStatus } from '../hooks/useAutosaveEffect';
import ProgressTracker from './ProgressTracker';
import AutosaveIndicator from './AutosaveIndicator';
import AIAssistant from './AIAssistant';
import PlusCircleIcon from './icons/PlusCircleIcon';
import TrashIcon from './icons/TrashIcon';
import PhotoIcon from './icons/PhotoIcon';

interface CVFormProps {
  activeSection: Section;
  cvData: CVData;
  onUpdate: <K extends SectionKey>(section: K, data: CVData[K]) => void;
  onNext: () => void;
  onPrev: () => void;
  saveStatus: SaveStatus;
}

const CVForm: React.FC<CVFormProps> = ({ activeSection, cvData, onUpdate, onNext, onPrev, saveStatus }) => {
  const currentIndex = SECTIONS.findIndex(s => s.key === activeSection);
  const isFirstSection = currentIndex === 0;
  const isLastSection = currentIndex === SECTIONS.length - 1;

  const [lastAddedItemId, setLastAddedItemId] = useState<string | null>(null);
  // FIX: Updated ref type to accommodate both input and textarea elements.
  const itemRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

  useEffect(() => {
    if (lastAddedItemId && itemRefs.current[lastAddedItemId]) {
      itemRefs.current[lastAddedItemId]?.focus();
      setLastAddedItemId(null);
    }
  }, [lastAddedItemId]);

  const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate('personalDetails', {
      ...cvData.personalDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleColorChange = (color: string) => {
    onUpdate('personalDetails', {
      ...cvData.personalDetails,
      accentColor: color
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('File is too large. Please select an image smaller than 2MB.');
      e.target.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      onUpdate('personalDetails', {
        ...cvData.personalDetails,
        avatar: event.target?.result as string,
      });
    };
    reader.onerror = () => {
      alert('There was an error reading the file. Please try again.');
    };
    reader.readAsDataURL(file);
  };
  
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate('professionalSummary', { summary: e.target.value });
  };
  
  const handleSingleTextareaChange = (section: 'skills' | 'strengths' | 'hobbies', e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(section, { text: e.target.value });
  };
  
  // Generic handler for array items
  const handleArrayChange = (section: 'workExperience' | 'education' | 'projects' | 'achievements' | 'certificates', index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedItems = [...cvData[section]] as any[];
    updatedItems[index] = { ...updatedItems[index], [e.target.name]: e.target.value };
    onUpdate(section, updatedItems as any);
  };
  
  const handleAddItem = (section: 'workExperience' | 'education' | 'projects' | 'achievements' | 'certificates') => {
    let newItem: WorkExperienceItem | EducationItem | ProjectItem | AchievementItem | CertificateItem;
    if (section === 'workExperience') {
      newItem = { id: uuidv4(), company: '', role: '', startDate: '', endDate: '', description: '' };
    } else if (section === 'education') {
      newItem = { id: uuidv4(), institution: '', degree: '', startDate: '', endDate: '', description: '' };
    } else if (section === 'projects') {
      newItem = { id: uuidv4(), name: '', description: '', link: '', technologies: '' };
    } else if (section === 'achievements') {
      newItem = { id: uuidv4(), description: '' };
    } else { // certificates
      newItem = { id: uuidv4(), name: '', issuer: '', date: '' };
    }
    onUpdate(section, [...cvData[section], newItem] as any);
    setLastAddedItemId(newItem.id);
  };

  const handleRemoveItem = (section: 'workExperience' | 'education' | 'projects' | 'achievements' | 'certificates', id: string) => {
    const updatedItems = (cvData[section] as {id: string}[]).filter(item => item.id !== id);
    onUpdate(section, updatedItems as any);
  };

  const renderSection = () => {
    switch (activeSection) {
      case Section.PERSONAL_DETAILS:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden" aria-label="Avatar Preview">
                {cvData.personalDetails.avatar ? (
                  <img src={cvData.personalDetails.avatar} alt={cvData.personalDetails.fullName ? `${cvData.personalDetails.fullName}'s Avatar` : 'User Avatar'} className="w-full h-full object-cover" />
                ) : (
                  <PhotoIcon className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="space-y-2">
                 <label htmlFor="avatar-upload" className="cursor-pointer px-3 py-2 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200">
                  Upload Photo
                </label>
                <input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
                {cvData.personalDetails.avatar && (
                  <button onClick={() => onUpdate('personalDetails', {...cvData.personalDetails, avatar: ''})} className="px-3 py-2 text-sm text-gray-600 hover:text-red-500" aria-label="Remove avatar">
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${cvData.personalDetails.accentColor === color ? 'ring-2 ring-offset-2 ring-indigo-500' : 'border-gray-200'}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
            <div>
                <label htmlFor="fullName" className="sr-only">Full Name</label>
                <input id="fullName" name="fullName" value={cvData.personalDetails.fullName} onChange={handlePersonalDetailsChange} placeholder="Full Name" className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input id="email" name="email" value={cvData.personalDetails.email} onChange={handlePersonalDetailsChange} placeholder="Email" type="email" className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="phone" className="sr-only">Phone</label>
                <input id="phone" name="phone" value={cvData.personalDetails.phone} onChange={handlePersonalDetailsChange} placeholder="Phone" type="tel" className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="address" className="sr-only">Address</label>
                <input id="address" name="address" value={cvData.personalDetails.address} onChange={handlePersonalDetailsChange} placeholder="Address" className="w-full p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="linkedIn" className="sr-only">LinkedIn Profile URL</label>
                <input id="linkedIn" name="linkedIn" value={cvData.personalDetails.linkedIn} onChange={handlePersonalDetailsChange} placeholder="LinkedIn Profile URL" className="w-full p-2 border rounded-md" />
            </div>
          </div>
        );
      case Section.PROFESSIONAL_SUMMARY:
        const summaryText = cvData.professionalSummary.summary;
        return (
          <div>
            <label htmlFor="summary" className="sr-only">Professional Summary</label>
            <textarea id="summary" value={summaryText} onChange={handleSummaryChange} placeholder="Write a brief professional summary..." rows={6} className="w-full p-2 border rounded-md" />
            <AIAssistant 
                section="Professional Summary" 
                currentText={summaryText}
                context={`The user is writing their professional summary. The current CV data is: ${JSON.stringify({ ...cvData, professionalSummary: '' })}`}
                onApplySuggestion={(suggestion) => onUpdate('professionalSummary', { summary: suggestion })}
            />
          </div>
        );
      case Section.WORK_EXPERIENCE:
        return (
            <div>
                {cvData.workExperience.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-md mb-4 relative space-y-2">
                        <div>
                            <label htmlFor={`role-${item.id}`} className="sr-only">Role / Job Title</label>
                            {/* FIX: Changed implicit return in ref callback to prevent TypeScript error. */}
                            <input ref={(el) => { itemRefs.current[item.id] = el; }} id={`role-${item.id}`} name="role" value={item.role} onChange={(e) => handleArrayChange('workExperience', index, e)} placeholder="Role / Job Title" className="w-full p-2 border rounded-md font-semibold" />
                        </div>
                        <div>
                            <label htmlFor={`company-${item.id}`} className="sr-only">Company</label>
                            <input id={`company-${item.id}`} name="company" value={item.company} onChange={(e) => handleArrayChange('workExperience', index, e)} placeholder="Company" className="w-full p-2 border rounded-md" />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label htmlFor={`startDate-work-${item.id}`} className="sr-only">Start Date</label>
                                <input id={`startDate-work-${item.id}`} name="startDate" value={item.startDate} onChange={(e) => handleArrayChange('workExperience', index, e)} placeholder="Start Date (e.g., Jan 2020)" className="w-full p-2 border rounded-md" />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor={`endDate-work-${item.id}`} className="sr-only">End Date</label>
                                <input id={`endDate-work-${item.id}`} name="endDate" value={item.endDate} onChange={(e) => handleArrayChange('workExperience', index, e)} placeholder="End Date (e.g., Present)" className="w-full p-2 border rounded-md" />
                            </div>
                        </div>
                        <div>
                           <label htmlFor={`description-work-${item.id}`} className="sr-only">Description</label>
                           <textarea id={`description-work-${item.id}`} name="description" value={item.description} onChange={(e) => handleArrayChange('workExperience', index, e)} placeholder="Describe your responsibilities and achievements..." rows={4} className="w-full p-2 border rounded-md" />
                        </div>
                         <AIAssistant 
                            section="Work Experience Description" 
                            currentText={item.description}
                            context={`Role: ${item.role}, Company: ${item.company}`}
                            onApplySuggestion={(suggestion) => {
                                const updatedItems = [...cvData.workExperience];
                                updatedItems[index].description = suggestion;
                                onUpdate('workExperience', updatedItems);
                            }}
                        />
                        <button onClick={() => handleRemoveItem('workExperience', item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500" aria-label={`Remove ${item.role || 'work experience'} item`}><TrashIcon className="w-5 h-5" /></button>
                    </div>
                ))}
                <button onClick={() => handleAddItem('workExperience')} className="flex items-center gap-2 text-indigo-600 font-semibold mt-2"><PlusCircleIcon className="w-6 h-6" /> Add Work Experience</button>
            </div>
        );
      case Section.EDUCATION:
         return (
            <div>
                {cvData.education.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-md mb-4 relative space-y-2">
                        <div>
                           <label htmlFor={`degree-${item.id}`} className="sr-only">Degree / Certificate</label>
                           {/* FIX: Changed implicit return in ref callback to prevent TypeScript error. */}
                           <input ref={(el) => { itemRefs.current[item.id] = el; }} id={`degree-${item.id}`} name="degree" value={item.degree} onChange={(e) => handleArrayChange('education', index, e)} placeholder="Degree / Certificate" className="w-full p-2 border rounded-md font-semibold" />
                        </div>
                        <div>
                            <label htmlFor={`institution-${item.id}`} className="sr-only">Institution</label>
                            <input id={`institution-${item.id}`} name="institution" value={item.institution} onChange={(e) => handleArrayChange('education', index, e)} placeholder="Institution" className="w-full p-2 border rounded-md" />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label htmlFor={`startDate-edu-${item.id}`} className="sr-only">Start Date</label>
                                <input id={`startDate-edu-${item.id}`} name="startDate" value={item.startDate} onChange={(e) => handleArrayChange('education', index, e)} placeholder="Start Date" className="w-full p-2 border rounded-md" />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor={`endDate-edu-${item.id}`} className="sr-only">End Date</label>
                                <input id={`endDate-edu-${item.id}`} name="endDate" value={item.endDate} onChange={(e) => handleArrayChange('education', index, e)} placeholder="End Date" className="w-full p-2 border rounded-md" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor={`description-edu-${item.id}`} className="sr-only">Description</label>
                            <textarea id={`description-edu-${item.id}`} name="description" value={item.description} onChange={(e) => handleArrayChange('education', index, e)} placeholder="Optional: Add details about coursework, honors, etc." rows={3} className="w-full p-2 border rounded-md" />
                        </div>
                        <button onClick={() => handleRemoveItem('education', item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500" aria-label={`Remove ${item.degree || 'education'} item`}><TrashIcon className="w-5 h-5" /></button>
                    </div>
                ))}
                <button onClick={() => handleAddItem('education')} className="flex items-center gap-2 text-indigo-600 font-semibold mt-2"><PlusCircleIcon className="w-6 h-6" /> Add Education</button>
            </div>
        );
      case Section.PROJECTS:
        return (
            <div>
                {cvData.projects.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-md mb-4 relative space-y-2">
                        <div>
                            <label htmlFor={`name-proj-${item.id}`} className="sr-only">Project Name</label>
                            {/* FIX: Changed implicit return in ref callback to prevent TypeScript error. */}
                            <input ref={(el) => { itemRefs.current[item.id] = el; }} id={`name-proj-${item.id}`} name="name" value={item.name} onChange={(e) => handleArrayChange('projects', index, e)} placeholder="Project Name" className="w-full p-2 border rounded-md font-semibold" />
                        </div>
                        <div>
                            <label htmlFor={`link-proj-${item.id}`} className="sr-only">Project Link</label>
                            <input id={`link-proj-${item.id}`} name="link" value={item.link} onChange={(e) => handleArrayChange('projects', index, e)} placeholder="Project Link (e.g., GitHub)" className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label htmlFor={`technologies-proj-${item.id}`} className="sr-only">Technologies Used</label>
                            <input id={`technologies-proj-${item.id}`} name="technologies" value={item.technologies} onChange={(e) => handleArrayChange('projects', index, e)} placeholder="Technologies Used (e.g., React, Python)" className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label htmlFor={`description-proj-${item.id}`} className="sr-only">Project Description</label>
                            <textarea id={`description-proj-${item.id}`} name="description" value={item.description} onChange={(e) => handleArrayChange('projects', index, e)} placeholder="Describe the project..." rows={4} className="w-full p-2 border rounded-md" />
                        </div>
                        <AIAssistant 
                            section="Project Description" 
                            currentText={item.description}
                            context={`Project Name: ${item.name}`}
                            onApplySuggestion={(suggestion) => {
                                const updatedItems = [...cvData.projects];
                                updatedItems[index].description = suggestion;
                                onUpdate('projects', updatedItems);
                            }}
                        />
                        <button onClick={() => handleRemoveItem('projects', item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500" aria-label={`Remove ${item.name || 'project'} item`}><TrashIcon className="w-5 h-5" /></button>
                    </div>
                ))}
                <button onClick={() => handleAddItem('projects')} className="flex items-center gap-2 text-indigo-600 font-semibold mt-2"><PlusCircleIcon className="w-6 h-6" /> Add Project</button>
            </div>
        );
      case Section.SKILLS:
        return (
            <div>
                <label htmlFor="skills" className="sr-only">Skills</label>
                <textarea id="skills" value={cvData.skills.text} onChange={(e) => handleSingleTextareaChange('skills', e)} placeholder="List your skills, separated by commas..." rows={6} className="w-full p-2 border rounded-md" />
                <AIAssistant 
                    section="Skills" 
                    currentText={cvData.skills.text}
                    context={`The user is listing their skills.`}
                    onApplySuggestion={(suggestion) => onUpdate('skills', { text: suggestion })}
                />
            </div>
        );
      case Section.ACHIEVEMENTS:
        return (
          <div>
            {cvData.achievements.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-md mb-4 relative">
                <label htmlFor={`achievement-desc-${item.id}`} className="sr-only">Achievement</label>
                <textarea
                  ref={(el) => { itemRefs.current[item.id] = el; }}
                  id={`achievement-desc-${item.id}`}
                  name="description"
                  value={item.description}
                  onChange={(e) => handleArrayChange('achievements', index, e)}
                  placeholder="Describe an achievement..."
                  rows={2}
                  className="w-full p-2 border rounded-md"
                />
                <AIAssistant 
                    section="Achievements" 
                    currentText={item.description}
                    onApplySuggestion={(suggestion) => {
                        const updatedItems = [...cvData.achievements];
                        updatedItems[index].description = suggestion;
                        onUpdate('achievements', updatedItems);
                    }}
                />
                <button onClick={() => handleRemoveItem('achievements', item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500" aria-label={`Remove achievement item`}><TrashIcon className="w-5 h-5" /></button>
              </div>
            ))}
            <button onClick={() => handleAddItem('achievements')} className="flex items-center gap-2 text-indigo-600 font-semibold mt-2"><PlusCircleIcon className="w-6 h-6" /> Add Achievement</button>
          </div>
        );
      case Section.CERTIFICATES:
        return (
          <div>
            {cvData.certificates.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-md mb-4 relative space-y-2">
                <div>
                  <label htmlFor={`cert-name-${item.id}`} className="sr-only">Certificate Name</label>
                  <input ref={(el) => { itemRefs.current[item.id] = el; }} id={`cert-name-${item.id}`} name="name" value={item.name} onChange={(e) => handleArrayChange('certificates', index, e)} placeholder="Certificate Name" className="w-full p-2 border rounded-md font-semibold" />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label htmlFor={`cert-issuer-${item.id}`} className="sr-only">Issuer</label>
                    <input id={`cert-issuer-${item.id}`} name="issuer" value={item.issuer} onChange={(e) => handleArrayChange('certificates', index, e)} placeholder="Issuer" className="w-full p-2 border rounded-md" />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor={`cert-date-${item.id}`} className="sr-only">Date</label>
                    <input id={`cert-date-${item.id}`} name="date" value={item.date} onChange={(e) => handleArrayChange('certificates', index, e)} placeholder="Date Received" className="w-full p-2 border rounded-md" />
                  </div>
                </div>
                <button onClick={() => handleRemoveItem('certificates', item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500" aria-label={`Remove ${item.name || 'certificate'} item`}><TrashIcon className="w-5 h-5" /></button>
              </div>
            ))}
            <button onClick={() => handleAddItem('certificates')} className="flex items-center gap-2 text-indigo-600 font-semibold mt-2"><PlusCircleIcon className="w-6 h-6" /> Add Certificate</button>
            <AIAssistant 
                section="Certificates" 
                currentText=""
                onApplySuggestion={() => {}}
            />
          </div>
        );
      case Section.STRENGTHS:
        return (
            <div>
                <label htmlFor="strengths" className="sr-only">Strengths</label>
                <textarea id="strengths" value={cvData.strengths.text} onChange={(e) => handleSingleTextareaChange('strengths', e)} placeholder="List your key strengths, separated by commas..." rows={4} className="w-full p-2 border rounded-md" />
                <AIAssistant 
                    section="Strengths" 
                    currentText={cvData.strengths.text}
                    onApplySuggestion={(suggestion) => onUpdate('strengths', { text: suggestion })}
                />
            </div>
        );
      case Section.HOBBIES:
        return (
            <div>
                <label htmlFor="hobbies" className="sr-only">Hobbies</label>
                <textarea id="hobbies" value={cvData.hobbies.text} onChange={(e) => handleSingleTextareaChange('hobbies', e)} placeholder="List your hobbies and interests, separated by commas..." rows={4} className="w-full p-2 border rounded-md" />
                <AIAssistant 
                    section="Hobbies" 
                    currentText={cvData.hobbies.text}
                    onApplySuggestion={(suggestion) => onUpdate('hobbies', { text: suggestion })}
                />
            </div>
        );
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow h-full flex flex-col max-h-[calc(100vh-120px)]">
      <ProgressTracker activeSection={activeSection} />
      <form onSubmit={(e) => e.preventDefault()} className="flex-grow overflow-y-auto pr-2 -mr-2">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{activeSection}</h2>
        {renderSection()}
      </form>
      <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={isFirstSection}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <AutosaveIndicator status={saveStatus} />
        <button
          onClick={onNext}
          disabled={isLastSection}
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CVForm;