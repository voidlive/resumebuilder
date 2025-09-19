
import React from 'react';
import { Template, ColorPalette } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface ToolbarProps {
  template: Template;
  setTemplate: (template: Template) => void;
  colorPalette: ColorPalette;
  setColorPalette: (color: ColorPalette) => void;
  onDownloadPDF: () => void;
  isDownloadingPdf: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const templates: { id: Template; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'corporate', name: 'Corporate' },
  { id: 'creative', name: 'Creative' },
  { id: 'executive', name: 'Executive' },
  { id: 'technical', name: 'Technical' },
];

const colors: { id: ColorPalette; name: string; hex: string }[] = [
  { id: 'blue', name: 'Blue', hex: 'bg-blue-600' },
  { id: 'green', name: 'Green', hex: 'bg-green-600' },
  { id: 'black', name: 'Black', hex: 'bg-black' },
  { id: 'purple', name: 'Purple', hex: 'bg-purple-600' },
];

export const Toolbar: React.FC<ToolbarProps> = ({ 
  template, setTemplate, 
  colorPalette, setColorPalette, 
  onDownloadPDF, isDownloadingPdf,
  onUndo, onRedo, canUndo, canRedo
}) => {

  return (
    <div className="flex items-center gap-2 md:gap-4 flex-wrap">
      <div className="flex items-center gap-1">
          <button onClick={onUndo} disabled={!canUndo} className="p-2 rounded-md hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Undo">
            <UndoIcon />
          </button>
           <button onClick={onRedo} disabled={!canRedo} className="p-2 rounded-md hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Redo">
            <RedoIcon />
          </button>
      </div>

      <div className="h-6 w-px bg-zinc-300 hidden md:block"></div>

      <div className="flex items-center gap-2">
        <label htmlFor="template-select" className="text-sm font-medium text-gray-600 hidden md:block">Template:</label>
        <select id="template-select" value={template} onChange={e => setTemplate(e.target.value as Template)} className="p-2 border border-zinc-300 rounded-md text-sm bg-white text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
         <label className="text-sm font-medium text-gray-600 hidden md:block">Color:</label>
         <div className="flex items-center gap-2">
          {colors.map(c => (
            <button key={c.id} onClick={() => setColorPalette(c.id)} className={`w-6 h-6 rounded-full ${c.hex} transition-transform transform hover:scale-110 ${colorPalette === c.id ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-white' : ''}`}></button>
          ))}
         </div>
      </div>
      
      <button onClick={onDownloadPDF} disabled={isDownloadingPdf} className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-wait min-w-[150px]">
        {isDownloadingPdf ? <LoadingSpinner /> : <DownloadIcon />}
        <span className="hidden md:inline">{isDownloadingPdf ? 'Downloading...' : 'Download PDF'}</span>
      </button>
    </div>
  );
};