
import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactElement;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative flex flex-col items-center group w-full">
      {children}
      <div className="absolute bottom-full flex flex-col items-center mb-2 tooltip-text">
        <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-nowrap bg-gray-700 shadow-lg rounded-md tooltip-arrow tooltip-arrow-bottom">
          {text}
        </span>
      </div>
    </div>
  );
};

export default Tooltip;