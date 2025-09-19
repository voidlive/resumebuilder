
import React, { useState, useCallback, useEffect } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { Toolbar } from './components/Toolbar';
import { ResumeData, Template, ColorPalette, ResumeSection, SectionContent } from './types';
import { initialResumeData } from './constants';
import { LoadingSpinner } from './components/icons/LoadingSpinner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Custom Hook for State History (Undo/Redo) ---
type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

const useHistoryState = <T,>(initialState: T) => {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const set = useCallback((newState: React.SetStateAction<T>) => {
    setState(currentState => {
      const newPresent = newState instanceof Function ? newState(currentState.present) : newState;
      
      if (JSON.stringify(newPresent) === JSON.stringify(currentState.present)) {
        return currentState;
      }
      
      return {
        past: [...currentState.past, currentState.present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    if (!canUndo) return;
    setState(currentState => {
      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, currentState.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, [canUndo]);
  
  const redo = useCallback(() => {
    if (!canRedo) return;
    setState(currentState => {
      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);
      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  return { state: state.present, set, undo, redo, canUndo, canRedo };
};
// --- End of Custom Hook ---


function App() {
  const { 
    state: resumeData, 
    set: setResumeData, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistoryState<ResumeData>(initialResumeData);

  const [template, setTemplate] = useState<Template>('classic');
  const [colorPalette, setColorPalette] = useState<ColorPalette>('blue');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'error' } | null>(null);

  const generatePdfClientSide = async () => {
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) return;

    try {
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Increase scale for better quality
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (clientError) {
      console.error("Client-side PDF generation also failed:", clientError);
      setNotification({
        message: "Sorry, we couldn't generate the PDF. Please try again later.",
        type: 'error',
      });
    }
  };


  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    setNotification(null);

    try {
      // PRIMARY METHOD: Server-side PDF generation
      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) throw new Error("Resume element not found");

      const elementClone = resumeElement.cloneNode(true) as HTMLElement;
      elementClone.style.transform = 'scale(1)';
      elementClone.style.boxShadow = 'none';
      const htmlContent = elementClone.outerHTML;

      let css = '';
      document.querySelectorAll('style').forEach(style => {
        css += style.innerHTML;
      });

      const fontLink = document.querySelector('link[href^="https://fonts.googleapis.com"]');
      const fontLinkHtml = fontLink ? fontLink.outerHTML : '';

      const fullHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8" />
              <title>Resume</title>
              ${fontLinkHtml}
              <script src="https://cdn.tailwindcss.com"></script>
              <style>${css}</style>
          </head>
          <body>
              ${htmlContent}
          </body>
          </html>
      `;

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: fullHtml }),
      });

      if (!response.ok) {
        throw new Error(`Server failed with status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.warn("Server-side PDF generation failed, falling back to client-side method.", error);
      
      // FALLBACK METHOD: Client-side PDF generation
      setNotification({
        message: "High-quality PDF server not found. Falling back to an in-browser PDF. For best results, please run the local server.",
        type: 'info'
      });
      await generatePdfClientSide();

    } finally {
      setIsDownloadingPdf(false);
    }
  };


  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    setResumeData(prev => {
      const newSections = [...prev.sections];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newSections.length) {
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      }
      
      return { ...prev, sections: newSections };
    });
  };

  const handleDeleteSection = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id),
    }));
  };

  const handleAddSection = (type: ResumeSection['type']) => {
    setResumeData(prev => {
      let newSection: ResumeSection;
      const base = { id: crypto.randomUUID(), isDeletable: true };

      switch (type) {
        case 'experience':
          newSection = { ...base, title: 'Work Experience', type, content: [] };
          break;
        case 'education':
          newSection = { ...base, title: 'Education', type, content: [] };
          break;
        case 'projects':
          newSection = { ...base, title: 'Projects', type, content: [] };
          break;
        case 'skills':
          newSection = { ...base, title: 'Skills', type, content: {} };
          break;
        case 'custom':
          newSection = { ...base, title: 'Custom Section', type, content: [] };
          break;
        case 'certifications':
          newSection = { ...base, title: 'Certifications', type, content: [] };
          break;
        case 'awards':
            newSection = { ...base, title: 'Awards', type, content: [] };
            break;
        case 'volunteer':
            newSection = { ...base, title: 'Volunteer Experience', type, content: [] };
            break;
        case 'interests':
            newSection = { ...base, title: 'Interests', type, content: [] };
            break;
        case 'summary':
        default:
          // Avoid adding another summary if one exists
          if (prev.sections.some(s => s.type === 'summary')) return prev;
          newSection = { id: 'summary', title: 'Professional Summary', type: 'summary', content: '', isDeletable: false };
          break;
      }
      return { ...prev, sections: [...prev.sections, newSection] };
    });
  };

  const handleSectionContentChange = (id: string, newContent: SectionContent) => {
    setResumeData(prev => ({
        ...prev,
        sections: prev.sections.map(s => s.id === id ? { ...s, content: newContent } : s)
    }));
  };

  const handleSectionTitleChange = (id: string, newTitle: string) => {
    setResumeData(prev => ({
        ...prev,
        sections: prev.sections.map(s => s.id === id ? { ...s, title: newTitle } : s)
    }));
  };


  return (
    <>
      {notification && (
        <div 
            className={`fixed top-24 right-8 max-w-sm z-50 rounded-lg shadow-2xl p-4 no-print
              ${notification.type === 'info' ? 'bg-blue-100 border border-blue-400 text-blue-800' : ''}
              ${notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-800' : ''}`}
            role="alert"
        >
            <div className="flex">
                <div className="py-1">
                    <svg className={`fill-current h-6 w-6 mr-4 ${notification.type === 'info' ? 'text-blue-500' : 'text-red-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg>
                </div>
                <div>
                    <p className="font-bold">{notification.type === 'info' ? 'Heads up!' : 'Error'}</p>
                    <p className="text-sm">{notification.message}</p>
                </div>
                <button onClick={() => setNotification(null)} className="absolute top-0 right-2 text-2xl font-semibold" aria-label="Close notification">&times;</button>
            </div>
        </div>
      )}
      {isDownloadingPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 no-print" aria-live="polite" aria-busy="true">
            <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-4">
              <LoadingSpinner />
              <span className="text-lg font-medium text-zinc-800">Generating your PDF...</span>
            </div>
        </div>
      )}
      <div className="min-h-screen font-inter text-zinc-800">
        <header className="bg-white shadow-md p-4 sticky top-0 z-20 no-print">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-zinc-900">Resume Builder</h1>
            <Toolbar
              template={template}
              setTemplate={setTemplate}
              colorPalette={colorPalette}
              setColorPalette={setColorPalette}
              onDownloadPDF={handleDownloadPdf}
              isDownloadingPdf={isDownloadingPdf}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </div>
        </header>
        
        <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="no-print">
            <ResumeForm 
              resumeData={resumeData} 
              setResumeData={setResumeData}
              onMoveSection={handleMoveSection}
              onDeleteSection={handleDeleteSection}
              onAddSection={handleAddSection}
              onSectionContentChange={handleSectionContentChange}
              onSectionTitleChange={handleSectionTitleChange}
            />
          </div>

          <div className="relative">
            <div className="sticky top-24">
              <ResumePreview 
                data={resumeData} 
                template={template}
                colorPalette={colorPalette}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;