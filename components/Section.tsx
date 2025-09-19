
import React, { useState } from 'react';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isDeletable?: boolean;
  isCollapsible?: boolean;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onTitleChange?: (newTitle: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const Section: React.FC<SectionProps> = ({ 
    title, children, isDeletable, isCollapsible,
    onDelete, onMoveUp, onMoveDown, onTitleChange,
    isFirst, isLast
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if(onTitleChange && currentTitle.trim()) {
        onTitleChange(currentTitle.trim());
    } else {
        setCurrentTitle(title); // revert if empty
    }
  }
  
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handleTitleBlur();
      } else if (e.key === 'Escape') {
          setCurrentTitle(title);
          setIsEditingTitle(false);
      }
  }
  
  const headerContent = (
    <div className="w-full flex justify-between items-center p-4 bg-white rounded-t-lg hover:bg-zinc-50">
        <div className="flex items-center gap-2 flex-grow">
            {isEditingTitle ? (
                 <input 
                    type="text" 
                    value={currentTitle} 
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    className="text-lg font-semibold text-zinc-900 bg-zinc-100 border border-blue-400 rounded-md px-2 -ml-2"
                    autoFocus
                />
            ) : (
                <h2 className="text-lg font-semibold text-zinc-800" onDoubleClick={() => onTitleChange && setIsEditingTitle(true)}>
                    {title}
                </h2>
            )}
        </div>
        <div className="flex items-center gap-2">
            {onMoveUp && <button onClick={onMoveUp} disabled={isFirst} className="p-1 rounded-full hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUpIcon /></button>}
            {onMoveDown && <button onClick={onMoveDown} disabled={isLast} className="p-1 rounded-full hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDownIcon /></button>}
            {isDeletable && <button onClick={onDelete} className="p-1 text-red-500 rounded-full hover:bg-red-500 hover:text-white"><TrashIcon /></button>}
            {isCollapsible && (
                 <svg
                    className={`w-6 h-6 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            )}
        </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      {isCollapsible ? (
          <button
            className="w-full text-left focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
           {headerContent}
          </button>
      ) : (
          headerContent
      )}
      
      {(!isCollapsible || isOpen) && <div className="p-4 border-t border-zinc-200">{children}</div>}
    </div>
  );
};