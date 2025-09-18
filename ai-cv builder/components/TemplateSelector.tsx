
import React from 'react';
import { Template } from '../types';

interface TemplateSelectorProps {
  activeTemplate: Template;
  onSelect: (template: Template) => void;
}

const templates: { id: Template, name: string, description: string }[] = [
    { id: 'modern', name: 'Modern', description: 'A clean, stylish design with icons.' },
    { id: 'classic', name: 'Classic', description: 'A timeless, traditional serif layout.' },
    { id: 'creative', name: 'Creative', description: 'A bold design with a horizontal header.' },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ activeTemplate, onSelect }) => {
  return (
    <fieldset>
      <legend className="text-lg font-semibold mb-4 text-gray-700">Templates</legend>
      <div className="space-y-3">
        {templates.map(template => (
            <div key={template.id}>
                <input
                    type="radio"
                    id={`template-${template.id}`}
                    name="template-selector"
                    value={template.id}
                    checked={activeTemplate === template.id}
                    onChange={() => onSelect(template.id)}
                    className="sr-only"
                />
                <label
                    htmlFor={`template-${template.id}`}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer block ${
                        activeTemplate === template.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400'
                    }`}
                >
                    <p className={`font-semibold ${activeTemplate === template.id ? 'text-indigo-700' : 'text-gray-800'}`}>{template.name}</p>
                    <p className="text-xs text-gray-500">{template.description}</p>
                </label>
            </div>
        ))}
      </div>
    </fieldset>
  );
};

export default TemplateSelector;