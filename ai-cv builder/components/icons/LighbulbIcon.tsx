
import React from 'react';

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 00-7.5 0c.065.58.433 1.168.96 1.625a7.5 7.5 0 005.58 0c.527-.457.895-1.045.96-1.625zM16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM12 14.25v-2.25" />
  </svg>
);

export default LightBulbIcon;