
import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, Project, ContactInfo, ResumeSection, CustomItem, SectionContent } from '../types';
import { Section } from './Section';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

// --- PROPS INTERFACE ---
interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  onDeleteSection: (id: string) => void;
  onAddSection: (type: ResumeSection['type']) => void;
  onSectionContentChange: (id: string, content: SectionContent) => void;
  onSectionTitleChange: (id: string, title: string) => void;
}

// --- SHARED STYLES ---
const inputClass = "p-2 border rounded-md bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full";
const textareaClasses = "w-full p-2 border rounded-md bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const smallButtonClass = "text-red-600 hover:text-red-800 font-medium flex items-center gap-1";
const addButtonClass = "mt-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1";


// --- SECTION-SPECIFIC FORM COMPONENTS ---

const WorkExperienceForm: React.FC<{ items: WorkExperience[], onChange: (items: WorkExperience[]) => void }> = ({ items, onChange }) => {
    const handleChange = (id: string, field: keyof WorkExperience, value: any) => {
        onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    const addItem = () => onChange([...items, { id: crypto.randomUUID(), company: '', role: '', duration: '', responsibilities: [] }]);
    const removeItem = (id: string) => onChange(items.filter(item => item.id !== id));

    return (
        <div>
            {items.map(exp => (
                <div key={exp.id} className="p-4 border border-zinc-200 rounded-md mb-4 space-y-3 bg-white">
                    <input type="text" placeholder="Company" value={exp.company} onChange={e => handleChange(exp.id, 'company', e.target.value)} className={inputClass} />
                    <input type="text" placeholder="Role" value={exp.role} onChange={e => handleChange(exp.id, 'role', e.target.value)} className={inputClass} />
                    <input type="text" placeholder="Duration (e.g., Jan 2020 - Present)" value={exp.duration} onChange={e => handleChange(exp.id, 'duration', e.target.value)} className={inputClass} />
                    <textarea placeholder="Responsibilities (one per line)" value={exp.responsibilities.join('\n')} onChange={e => handleChange(exp.id, 'responsibilities', e.target.value.split('\n'))} rows={4} className={textareaClasses} />
                    <button onClick={() => removeItem(exp.id)} className={smallButtonClass}><TrashIcon /> Remove</button>
                </div>
            ))}
            <button onClick={addItem} className={addButtonClass}><PlusIcon /> Add Experience</button>
        </div>
    );
};

const EducationForm: React.FC<{ items: Education[], onChange: (items: Education[]) => void }> = ({ items, onChange }) => {
    const handleChange = (id: string, field: keyof Education, value: string) => {
        onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    const addItem = () => onChange([...items, { id: crypto.randomUUID(), institution: '', degree: '', duration: '' }]);
    const removeItem = (id: string) => onChange(items.filter(item => item.id !== id));
    
    return (
        <div>
            {items.map(edu => (
                <div key={edu.id} className="p-4 border border-zinc-200 rounded-md mb-4 space-y-3 bg-white">
                    <input type="text" placeholder="Institution" value={edu.institution} onChange={e => handleChange(edu.id, 'institution', e.target.value)} className={inputClass} />
                    <input type="text" placeholder="Degree" value={edu.degree} onChange={e => handleChange(edu.id, 'degree', e.target.value)} className={inputClass} />
                    <input type="text" placeholder="Duration (e.g., Aug 2012 - May 2016)" value={edu.duration} onChange={e => handleChange(edu.id, 'duration', e.target.value)} className={inputClass} />
                    <button onClick={() => removeItem(edu.id)} className={smallButtonClass}><TrashIcon /> Remove</button>
                </div>
            ))}
            <button onClick={addItem} className={addButtonClass}><PlusIcon /> Add Education</button>
        </div>
    );
};

const ProjectsForm: React.FC<{ items: Project[], onChange: (items: Project[]) => void }> = ({ items, onChange }) => {
    const handleChange = (id: string, field: keyof Project, value: string) => {
        onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    const addItem = () => onChange([...items, { id: crypto.randomUUID(), name: '', description: '' }]);
    const removeItem = (id: string) => onChange(items.filter(item => item.id !== id));
    
    return (
        <div>
            {items.map(proj => (
                <div key={proj.id} className="p-4 border border-zinc-200 rounded-md mb-4 space-y-2 bg-white">
                    <input type="text" placeholder="Project Name" value={proj.name} onChange={e => handleChange(proj.id, 'name', e.target.value)} className={inputClass} />
                    <textarea placeholder="Description" value={proj.description} onChange={e => handleChange(proj.id, 'description', e.target.value)} rows={3} className={textareaClasses} />
                    <button onClick={() => removeItem(proj.id)} className={smallButtonClass}><TrashIcon /> Remove</button>
                </div>
            ))}
            <button onClick={addItem} className={addButtonClass}><PlusIcon /> Add Project</button>
        </div>
    );
};

const SkillsForm: React.FC<{ skills: Record<string, string[]>, onChange: (skills: Record<string, string[]>) => void }> = ({ skills, onChange }) => {
    const [skillName, setSkillName] = useState('');
    const [category, setCategory] = useState('');

    const addSkill = () => {
        const trimmedName = skillName.trim();
        const trimmedCategory = category.trim();
        if (!trimmedName || !trimmedCategory) return;

        const newSkills = { ...skills };
        const categorySkills = newSkills[trimmedCategory] ? [...newSkills[trimmedCategory]] : [];
        if (!categorySkills.find(s => s.toLowerCase() === trimmedName.toLowerCase())) {
            categorySkills.push(trimmedName);
            newSkills[trimmedCategory] = categorySkills;
            onChange(newSkills);
        }
        setSkillName('');
        setCategory('');
    };
    
    const removeSkill = (cat: string, skillToRemove: string) => {
        const newSkills = { ...skills };
        newSkills[cat] = newSkills[cat].filter(s => s !== skillToRemove);
        if (newSkills[cat].length === 0) delete newSkills[cat];
        onChange(newSkills);
    };

    return (
         <>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input type="text" value={skillName} onChange={e => setSkillName(e.target.value)} placeholder="e.g., React" className={inputClass}/>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Frameworks & Libraries" className={inputClass}/>
            </div>
            <button onClick={addSkill} className="w-full md:w-auto bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <PlusIcon /> Add Skill
            </button>
            <div className="mt-6 space-y-4">
                {Object.entries(skills).map(([cat, skillList]) => (
                    <div key={cat}>
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{cat}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skillList.map(skill => (
                                <div key={skill} className="flex items-center gap-2 px-3 py-1 bg-zinc-200 text-zinc-800 rounded-full text-sm font-medium">
                                    <span>{skill}</span>
                                    <button onClick={() => removeSkill(cat, skill)} className="text-zinc-500 hover:text-zinc-700">&times;</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};


const CustomSectionForm: React.FC<{ items: CustomItem[], onChange: (items: CustomItem[]) => void }> = ({ items, onChange }) => {
    const handleChange = (id: string, field: keyof CustomItem, value: any) => {
        onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    const addItem = () => onChange([...items, { id: crypto.randomUUID(), title: '', subtitle: '', description: '' }]);
    const removeItem = (id: string) => onChange(items.filter(item => item.id !== id));

    return (
        <div>
            {items.map(item => (
                <div key={item.id} className="p-4 border border-zinc-200 rounded-md mb-4 space-y-3 bg-white">
                    <input type="text" placeholder="Title" value={item.title} onChange={e => handleChange(item.id, 'title', e.target.value)} className={inputClass} />
                    <input type="text" placeholder="Subtitle (e.g., location, date)" value={item.subtitle} onChange={e => handleChange(item.id, 'subtitle', e.target.value)} className={inputClass} />
                    <textarea placeholder="Description (optional)" value={item.description} onChange={e => handleChange(item.id, 'description', e.target.value)} rows={3} className={textareaClasses} />
                    <button onClick={() => removeItem(item.id)} className={smallButtonClass}><TrashIcon /> Remove Item</button>
                </div>
            ))}
            <button onClick={addItem} className={addButtonClass}><PlusIcon /> Add Item</button>
        </div>
    );
};


// --- MAIN FORM COMPONENT ---

export const ResumeForm: React.FC<ResumeFormProps> = ({ 
    resumeData, setResumeData, onMoveSection, onDeleteSection, 
    onAddSection, onSectionContentChange, onSectionTitleChange 
}) => {

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleSimpleChange = <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
     setResumeData(prev => ({ ...prev, [field]: value }));
  }

  const renderSectionForm = (section: ResumeSection) => {
      switch(section.type) {
          case 'summary':
              return <textarea placeholder="Write a brief summary..." value={section.content as string} onChange={e => onSectionContentChange(section.id, e.target.value)} rows={5} className={textareaClasses}/>
          case 'experience':
              return <WorkExperienceForm items={section.content as WorkExperience[]} onChange={c => onSectionContentChange(section.id, c)} />
          case 'education':
              return <EducationForm items={section.content as Education[]} onChange={c => onSectionContentChange(section.id, c)} />
          case 'projects':
              return <ProjectsForm items={section.content as Project[]} onChange={c => onSectionContentChange(section.id, c)} />
          case 'skills':
              return <SkillsForm skills={section.content as Record<string, string[]>} onChange={c => onSectionContentChange(section.id, c)} />
          case 'custom':
          case 'certifications':
          case 'awards':
          case 'volunteer':
          case 'interests':
              return <CustomSectionForm items={section.content as CustomItem[]} onChange={c => onSectionContentChange(section.id, c)} />
          default:
              return null;
      }
  };

  return (
    <div className="space-y-6">
      <Section title="Personal Information" isCollapsible={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Jane Doe" value={resumeData.name} onChange={e => handleSimpleChange('name', e.target.value)} className={inputClass} aria-label="Full Name"/>
            <input type="text" placeholder="Senior Frontend Engineer" value={resumeData.title} onChange={e => handleSimpleChange('title', e.target.value)} className={inputClass} aria-label="Job Title"/>
            <input type="tel" placeholder="123-456-7890" value={resumeData.contact.phone} onChange={e => handleContactChange('phone', e.target.value)} className={inputClass} aria-label="Phone"/>
            <input type="email" placeholder="jane.doe@email.com" value={resumeData.contact.email} onChange={e => handleContactChange('email', e.target.value)} className={inputClass} aria-label="Email"/>
            <input type="text" placeholder="linkedin.com/in/janedoe" value={resumeData.contact.linkedin} onChange={e => handleContactChange('linkedin', e.target.value)} className={inputClass} aria-label="LinkedIn"/>
            <input type="text" placeholder="github.com/janedoe" value={resumeData.contact.github} onChange={e => handleContactChange('github', e.target.value)} className={inputClass} aria-label="GitHub"/>
            <div className="col-span-1 md:col-span-2">
                <input type="text" placeholder="San Francisco, CA" value={resumeData.contact.location} onChange={e => handleContactChange('location', e.target.value)} className={inputClass} aria-label="Location"/>
            </div>
        </div>
      </Section>

      {resumeData.sections.map((section, index) => (
          <Section 
            key={section.id}
            title={section.title}
            isDeletable={section.isDeletable}
            onTitleChange={(newTitle) => onSectionTitleChange(section.id, newTitle)}
            onDelete={() => onDeleteSection(section.id)}
            onMoveUp={() => onMoveSection(index, 'up')}
            onMoveDown={() => onMoveSection(index, 'down')}
            isFirst={index === 0}
            isLast={index === resumeData.sections.length - 1}
            isCollapsible={true}
          >
              {renderSectionForm(section)}
          </Section>
      ))}

      <div className="p-4 bg-white border-t border-zinc-200 rounded-b-lg">
          <h3 className="font-semibold text-zinc-800 mb-2">Add a new section</h3>
          <div className="flex flex-wrap gap-2">
              <button onClick={() => onAddSection('experience')} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-md text-sm hover:bg-zinc-300">Experience</button>
              <button onClick={() => onAddSection('education')} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-md text-sm hover:bg-zinc-300">Education</button>
              <button onClick={() => onAddSection('projects')} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-md text-sm hover:bg-zinc-300">Projects</button>
              <button onClick={() => onAddSection('skills')} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-md text-sm hover:bg-zinc-300">Skills</button>
              <button onClick={() => onAddSection('certifications')} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-md text-sm hover:bg-zinc-300">Certifications</button>
              <button onClick={() => onAddSection('awards')} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-md text-sm hover:bg-zinc-300">Awards</button>
              <button onClick={() => onAddSection('volunteer')} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-md text-sm hover:bg-zinc-300">Volunteer</button>
              <button onClick={() => onAddSection('interests')} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-md text-sm hover:bg-zinc-300">Interests</button>
              <button onClick={() => onAddSection('custom')} className="bg-zinc-200 text-zinc-800 px-3 py-1 rounded-md text-sm hover:bg-zinc-300">Custom</button>
          </div>
      </div>

    </div>
  );
};