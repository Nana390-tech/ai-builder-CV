
import React from 'react';

const FolderOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5a.75.75 0 000-1.5H3.75a.75.75 0 000 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75A2.25 2.25 0 016.75 4.5h3.75a2.25 2.25 0 012.25 2.25v.75H4.5v-.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 9.75v8.25a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V9.75" />
  </svg>
);

export default FolderOpenIcon;