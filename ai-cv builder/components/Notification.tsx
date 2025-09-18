
import React, { useEffect } from 'react';
import InformationCircleIcon from './icons/InformationCircleIcon';
import XMarkIcon from './icons/XMarkIcon';

interface NotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, duration]);

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-center w-full max-w-xs p-4 text-gray-700 bg-white rounded-lg shadow-lg"
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-indigo-500 bg-indigo-100 rounded-lg">
        <InformationCircleIcon className="w-5 h-5" />
        <span className="sr-only">Info icon</span>
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
        aria-label="Close"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;