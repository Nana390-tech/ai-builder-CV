
import React from 'react';
import { CVData, Section, Template } from '../types';
import { SECTIONS } from '../constants';
import DownloadIcon from './icons/DownloadIcon';
import PrinterIcon from './icons/PrinterIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import ModernClassicTemplate from './templates/ModernClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

declare const html2pdf: any;

interface CVPreviewProps {
  data: CVData;
  activeSection: Section;
  template: Template;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, activeSection, template }) => {
  const isLastSection = SECTIONS[SECTIONS.length - 1].key === activeSection;
  
  const getPdfBuilder = () => {
    const element = document.getElementById('cv-preview-content');
    const opt = {
      margin: 0,
      filename: `${data.personalDetails.fullName.replace(' ', '_') || 'CV'}_${template}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    return html2pdf().from(element).set(opt);
  }

  const handleDownload = () => {
    getPdfBuilder().save();
  };

  const handlePrint = () => {
    getPdfBuilder().toPdf().get('pdf').then((pdf: any) => {
      // The `datauristring` is a base64 encoded string of the PDF
      // We open it in a new window and trigger the print dialog
      const newWindow = window.open(pdf.output('datauristring'));
      newWindow?.addEventListener('load', () => {
        newWindow.print();
      });
    });
  };

  const handleEmail = () => {
    const subject = `CV - ${data.personalDetails.fullName || 'Job Application'}`;
    const body = `Dear Hiring Manager,\n\nPlease find my CV attached for your consideration.\n\nSincerely,\n${data.personalDetails.fullName || ''}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };


  const renderTemplate = () => {
    const props = { data, activeSection };
    switch (template) {
      case 'creative':
        return <CreativeTemplate {...props} />;
      case 'classic':
      case 'modern':
      default:
        return <ModernClassicTemplate {...props} template={template} />;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow h-full sticky top-8 flex flex-col max-h-[calc(100vh-120px)]">
      <div className="flex-grow overflow-y-auto" id="cv-preview-container">
         <div id="cv-preview-content">
          {renderTemplate()}
        </div>
      </div>
       {isLastSection && (
        <div className="pt-4 mt-4 border-t space-y-2">
           <p className="text-sm text-center text-gray-600 font-semibold mb-2" id="export-heading">Export your CV</p>
           <div className="flex gap-2" role="toolbar" aria-labelledby="export-heading">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                <DownloadIcon className="w-5 h-5" />
                Download PDF
              </button>
               <button
                onClick={handlePrint}
                title="Print CV"
                aria-label="Print CV"
                className="p-2 text-sm font-semibold text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300"
              >
                <PrinterIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleEmail}
                title="Email CV"
                aria-label="Email CV"
                className="p-2 text-sm font-semibold text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300"
              >
                <EnvelopeIcon className="w-5 h-5" />
              </button>
           </div>
           <p className="text-xs text-center text-gray-500 pt-1">To email your CV, download the PDF first, then attach it to the email.</p>
        </div>
      )}
    </div>
  );
};

export default CVPreview;