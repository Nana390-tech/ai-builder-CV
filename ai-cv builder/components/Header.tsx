
import React from 'react';
import ArrowRightOnRectangleIcon from './icons/ArrowRightOnRectangleIcon';

interface HeaderProps {
  userEmail: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-indigo-600">
              AI-Powered CV Builder
            </h1>
          </div>
          <div className="flex items-center">
            {userEmail ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{userEmail}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  aria-label="Log out"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <a 
                href="https://github.com/google/gemini-api-cookbook/tree/main/demos/react-cv-builder" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;