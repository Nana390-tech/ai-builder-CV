
import React from 'react';
import { SaveStatus } from '../hooks/useAutosaveEffect';
import CheckCircleIcon from './icons/CheckCircleIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface AutosaveIndicatorProps {
  status: SaveStatus;
}

const AutosaveIndicator: React.FC<AutosaveIndicatorProps> = ({ status }) => {
  if (status === 'idle') {
    return <div className="w-36 h-5" />; // Reserve space to prevent layout shift
  }

  const getStatusContent = () => {
    switch (status) {
      case 'saving':
        return (
          <>
            <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
            Saving...
          </>
        );
      case 'saved':
        return (
          <>
            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
            All changes saved
          </>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-500">
            <span className="font-bold mr-2">!</span>
            Error saving
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center text-sm text-gray-500 w-36 h-5" aria-live="polite">
      {getStatusContent()}
    </div>
  );
};

export default AutosaveIndicator;