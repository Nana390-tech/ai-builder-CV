
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import Header from './components/Header';
import Auth from './components/Auth';
import { CVData, Section, SectionKey, Template } from './types';
import { INITIAL_CV_DATA, SECTIONS } from './constants';
import { useAutosaveEffect, SaveStatus } from './hooks/useAutosaveEffect';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => sessionStorage.getItem('currentUser'));
  const [cvData, setCvData] = useState<CVData>(INITIAL_CV_DATA);
  const [activeSection, setActiveSection] = useState<Section>(SECTIONS[0].key);
  const [activeTemplate, setActiveTemplate] = useState<Template>('modern');

  useEffect(() => {
    if (!currentUser) {
      setCvData(INITIAL_CV_DATA);
      setActiveTemplate('modern');
      return;
    }

    try {
      const savedData = localStorage.getItem(`cv-data-${currentUser}`);
      if (savedData) {
        const parsedData: CVData = JSON.parse(savedData);
        if (!parsedData.personalDetails.accentColor) {
            parsedData.personalDetails.accentColor = INITIAL_CV_DATA.personalDetails.accentColor;
        }
        setCvData(parsedData);
      } else {
        setCvData(INITIAL_CV_DATA);
      }
      const savedTemplate = localStorage.getItem(`cv-template-${currentUser}`);
      if (savedTemplate) {
        setActiveTemplate(savedTemplate as Template);
      } else {
        setActiveTemplate('modern');
      }
    } catch (error) {
      console.error("Failed to load user data from localStorage", error);
      setCvData(INITIAL_CV_DATA);
      setActiveTemplate('modern');
    }
  }, [currentUser]);

  const saveToLocalStorage = useCallback(async () => {
    // This function will only be called by the hook if currentUser exists.
    if (!currentUser) return;
    localStorage.setItem(`cv-data-${currentUser}`, JSON.stringify(cvData));
    localStorage.setItem(`cv-template-${currentUser}`, activeTemplate);
  }, [cvData, activeTemplate, currentUser]);

  const saveStatus: SaveStatus = useAutosaveEffect(saveToLocalStorage, cvData, currentUser, 1000);
  
  const handleLogin = (email: string) => {
    setCurrentUser(email);
    sessionStorage.setItem('currentUser', email);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
        setCurrentUser(null);
        sessionStorage.removeItem('currentUser');
    }
  };

  const handleUpdate = useCallback(<K extends SectionKey>(section: K, data: CVData[K]) => {
    setCvData(prev => ({ ...prev, [section]: data }));
  }, []);

  const handleSelectSection = (section: Section) => {
    setActiveSection(section);
  };
  
  const handleSelectTemplate = (template: Template) => {
    setActiveTemplate(template);
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? All your current progress will be lost.')) {
      setCvData(INITIAL_CV_DATA);
      setActiveSection(SECTIONS[0].key);
      setActiveTemplate('modern');
      if(currentUser) {
        localStorage.removeItem(`cv-data-${currentUser}`);
        localStorage.removeItem(`cv-template-${currentUser}`);
      }
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    const currentIndex = SECTIONS.findIndex(s => s.key === activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      setActiveSection(SECTIONS[currentIndex + 1].key);
    }
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    const currentIndex = SECTIONS.findIndex(s => s.key === activeSection);
    if (currentIndex > 0) {
      setActiveSection(SECTIONS[currentIndex - 1].key);
    }
    window.scrollTo(0, 0);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Header userEmail={currentUser} onLogout={handleLogout} />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3">
            <Sidebar 
              activeSection={activeSection} 
              onSelectSection={handleSelectSection} 
              activeTemplate={activeTemplate}
              onSelectTemplate={handleSelectTemplate}
              onReset={handleReset}
            />
          </div>
          <div className="lg:col-span-5">
            <CVForm 
              activeSection={activeSection} 
              cvData={cvData} 
              onUpdate={handleUpdate}
              onNext={handleNext}
              onPrev={handlePrev}
              saveStatus={saveStatus}
            />
          </div>
          <div className="lg:col-span-4">
            <CVPreview 
                data={cvData}
                activeSection={activeSection}
                template={activeTemplate}
            />
          </div>
        </div>
      </main>
      <footer className="w-full text-center py-4 text-xs text-gray-500">
        Designed by [Your Name Here]
      </footer>
    </div>
  );
}

export default App;