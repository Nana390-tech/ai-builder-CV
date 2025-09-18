
import React from 'react';
// FIX: Corrected import paths to be relative.
import { Section, Template } from '../types';
import { SECTIONS } from '../constants';
import CheckCircleIcon from './icons/CheckCircleIcon';
import TemplateSelector from './TemplateSelector';
import ArrowPathIcon from './icons/ArrowPathIcon';

interface SidebarProps {
  activeSection: Section;
  onSelectSection: (section: Section) => void;
  activeTemplate: Template;
  onSelectTemplate: (template: Template) => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSelectSection, activeTemplate, onSelectTemplate, onReset }) => {
  const activeIndex = SECTIONS.findIndex(s => s.key === activeSection);

  return (
    <nav className="bg-white p-4 rounded-lg shadow sticky top-8">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">CV Sections</h2>
        <ul className="space-y-1">
          {SECTIONS.map((section, index) => {
            const isActive = section.key === activeSection;
            const isCompleted = index < activeIndex;

            return (
              <li key={section.key}>
                <button
                  onClick={() => onSelectSection(section.key)}
                  className={`w-full text-left flex items-center p-3 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 font-semibold'
                      : isCompleted
                      ? 'text-gray-600 hover:bg-gray-100'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                     <CheckCircleIcon className="w-5 h-5 mr-3 text-green-500" />
                  ) : (
                    <span className={`w-5 h-5 mr-3 flex items-center justify-center rounded-full text-xs ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      {index + 1}
                    </span>
                  )}
                  
                  {section.key}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-8 pt-4 border-t">
        <TemplateSelector activeTemplate={activeTemplate} onSelect={onSelectTemplate} />
      </div>
      <div className="mt-8 pt-4 border-t">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-md text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Start Over
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;