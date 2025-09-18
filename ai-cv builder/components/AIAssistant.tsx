
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { getAIideas, getAIVocabulary, proofreadWithAI } from '../services/geminiService';
// FIX: Corrected import path to be relative.
import { AIProofreadSuggestion } from '../types';
import { VOCABULARY_CATEGORIES } from '../constants';
import SparklesIcon from './icons/SparklesIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import Tooltip from './Tooltip';


interface AIAssistantProps {
  section: string;
  currentText: string;
  context?: string;
  onApplySuggestion: (suggestion: string) => void;
}

type ActiveTab = 'ideas' | 'vocabulary' | 'proofread';
const TABS: ActiveTab[] = ['ideas', 'vocabulary', 'proofread'];

const AIAssistant: React.FC<AIAssistantProps> = ({ section, currentText, context, onApplySuggestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('ideas');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      tabRefs.current[TABS.indexOf(activeTab)]?.focus();
    } else {
      // Don't shift focus back to trigger when closing via "Use this idea"
      // triggerRef.current?.focus(); 
    }
  }, [isOpen]);

  const handleGetIdeas = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const ideas = await getAIideas(section, context || '');
      setResults(ideas);
    } catch (e) {
      setError('Failed to get ideas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetVocab = async (category: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
        const vocab = await getAIVocabulary(category);
        setResults(vocab);
    } catch (e) {
        setError('Failed to get vocabulary. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleProofread = async () => {
    if(!currentText) {
        setError("There's no text to proofread.");
        setResults([]);
        return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
        const suggestions: AIProofreadSuggestion[] = await proofreadWithAI(currentText);
        setResults(suggestions);
    } catch (e) {
        setError('Failed to proofread. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = TABS.indexOf(activeTab);
    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % TABS.length;
      setActiveTab(TABS[nextIndex]);
      tabRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      setActiveTab(TABS[prevIndex]);
      tabRefs.current[prevIndex]?.focus();
    }
  };

  const renderResults = () => {
    if(isLoading) return <div className="text-center p-4" aria-live="polite">Loading...</div>
    if(error) return <div className="text-center p-4 text-red-500" role="alert">{error}</div>
    if(!results) return <div className="text-center p-4 text-gray-500">Click a button above to get AI help.</div>;

    switch(activeTab) {
        case 'ideas':
            return (
                <div className="space-y-3">
                    {results.map((idea: string, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md border">
                            <p className="text-sm text-gray-700">{idea}</p>
                            <button onClick={() => { onApplySuggestion(idea); setIsOpen(false); }} className="text-xs font-semibold text-indigo-600 hover:underline mt-2">Use this idea</button>
                        </div>
                    ))}
                </div>
            );
        case 'vocabulary':
            return (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {results.map((item: {word: string; definition: string}, index: number) => (
                        <li key={index} className="p-2 bg-gray-50 rounded-md">
                            <p className="font-semibold text-gray-800">{item.word}</p>
                            <p className="text-sm text-gray-600">{item.definition}</p>
                        </li>
                    ))}
                </ul>
            );
        case 'proofread':
            if(results.length === 0) return <div className="text-center p-4 text-green-600" aria-live="polite">Looks good! No mistakes found.</div>
            return (
                 <div className="space-y-3">
                    {results.map((s: AIProofreadSuggestion, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md border">
                            <p className="text-sm text-gray-500">Original: <span className="line-through">{s.original}</span></p>
                            <p className="text-sm text-green-700">Suggestion: <span>{s.corrected}</span></p>
                            <p className="text-xs text-gray-600 mt-1 italic">Reason: {s.explanation}</p>
                        </div>
                    ))}
                </div>
            );
    }
  }
  
  const vocabCategories = VOCABULARY_CATEGORIES[section] || [];

  return (
    <div className="mt-2">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="ai-assistant-panel"
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
      >
        <SparklesIcon className="w-4 h-4" />
        AI Assistant
      </button>

      {isOpen && (
        <div ref={panelRef} id="ai-assistant-panel" className="mt-2 p-4 border rounded-lg bg-white shadow-lg">
          <div role="tablist" aria-label="AI Assistant Options" className="flex gap-2 mb-4">
            <Tooltip text="Get suggestions for what to write based on your CV.">
                <button role="tab" id="tab-ideas" aria-controls="tabpanel-ideas" aria-selected={activeTab === 'ideas'} onClick={() => { setActiveTab('ideas'); setResults(null); }} onKeyDown={handleTabKeyDown} ref={(el) => { tabRefs.current[0] = el; }} tabIndex={activeTab === 'ideas' ? 0 : -1} className={`flex-1 px-3 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${activeTab === 'ideas' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><LightBulbIcon className="w-4 h-4"/>Ideas</button>
            </Tooltip>
            <Tooltip text="Find simple, professional words to improve your writing.">
                <button role="tab" id="tab-vocabulary" aria-controls="tabpanel-vocabulary" aria-selected={activeTab === 'vocabulary'} onClick={() => { setActiveTab('vocabulary'); setResults(null); }} onKeyDown={handleTabKeyDown} ref={(el) => { tabRefs.current[1] = el; }} tabIndex={activeTab === 'vocabulary' ? 0 : -1} className={`flex-1 px-3 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${activeTab === 'vocabulary' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><BookOpenIcon className="w-4 h-4"/>Vocabulary</button>
            </Tooltip>
            <Tooltip text="Check your text for grammar and spelling mistakes.">
                <button role="tab" id="tab-proofread" aria-controls="tabpanel-proofread" aria-selected={activeTab === 'proofread'} onClick={() => { setActiveTab('proofread'); setResults(null); }} onKeyDown={handleTabKeyDown} ref={(el) => { tabRefs.current[2] = el; }} tabIndex={activeTab === 'proofread' ? 0 : -1} className={`flex-1 px-3 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${activeTab === 'proofread' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><CheckCircleIcon className="w-4 h-4"/>Proofread</button>
            </Tooltip>
          </div>
          
          <div role="tabpanel" id="tabpanel-ideas" aria-labelledby="tab-ideas" hidden={activeTab !== 'ideas'}>
             <Tooltip text="Click to get three different examples for this section.">
                <button onClick={handleGetIdeas} className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 mb-4">Generate Ideas</button>
             </Tooltip>
          </div>
          <div role="tabpanel" id="tabpanel-vocabulary" aria-labelledby="tab-vocabulary" hidden={activeTab !== 'vocabulary'}>
             <div className="grid grid-cols-2 gap-2 mb-4">
                 {vocabCategories.length > 0 ? (
                    vocabCategories.map(category => (
                        <Tooltip key={category} text={`Get a list of 10 useful words for "${category}".`}>
                            <button onClick={() => handleGetVocab(category)} className="w-full text-xs bg-gray-100 py-2 rounded-md hover:bg-gray-200">{category}</button>
                        </Tooltip>
                    ))
                 ) : (
                    <p className="col-span-2 text-center text-sm text-gray-500">No vocabulary suggestions for this section.</p>
                 )}
            </div>
          </div>
          <div role="tabpanel" id="tabpanel-proofread" aria-labelledby="tab-proofread" hidden={activeTab !== 'proofread'}>
            <Tooltip text="Click to check for mistakes and get suggestions.">
                <button onClick={handleProofread} className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 mb-4">Check My Writing</button>
            </Tooltip>
          </div>

          <div className="bg-gray-50 p-2 rounded-md border min-h-[100px]">
            {renderResults()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;