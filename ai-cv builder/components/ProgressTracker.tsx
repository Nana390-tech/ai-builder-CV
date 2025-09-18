
import React from 'react';
// FIX: Corrected import paths to be relative.
import { Section } from '../types';
import { SECTIONS } from '../constants';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface ProgressTrackerProps {
  activeSection: Section;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ activeSection }) => {
  const activeIndex = SECTIONS.findIndex(s => s.key === activeSection);

  return (
    <div className="mb-8">
      <ol className="flex items-center w-full">
        {SECTIONS.map((section, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;

          return (
            <React.Fragment key={section.key}>
              <li className="flex-1 flex flex-col items-center text-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                    isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </div>
                <p className={`mt-2 text-xs font-medium w-20 ${
                  isActive ? 'text-indigo-600' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {section.key}
                </p>
              </li>
              {index < SECTIONS.length - 1 && (
                <li className="flex-auto -mx-2">
                  <div className={`h-1 w-full transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </div>
  );
};

export default ProgressTracker;