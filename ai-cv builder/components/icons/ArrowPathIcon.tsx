
import React from 'react';

const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001a7.5 7.5 0 01-1.06 3.58a7.5 7.5 0 01-3.58 3.58a7.5 7.5 0 01-3.834 1.06h-.001a7.5 7.5 0 01-3.58-1.06a7.5 7.5 0 01-3.58-3.58a7.5 7.5 0 01-1.06-3.834v-.001a7.5 7.5 0 011.06-3.58a7.5 7.5 0 013.58-3.58a7.5 7.5 0 013.834-1.06h.001a7.5 7.5 0 013.58 1.06a7.5 7.5 0 013.58 3.58a7.5 7.5 0 011.06 3.834v.001z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6m3-3h-6" />
  </svg>
);

export default ArrowPathIcon;