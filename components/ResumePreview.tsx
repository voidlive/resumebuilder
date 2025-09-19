
import React, { useRef, useState, useLayoutEffect } from 'react';
import { ResumeData, Template, ColorPalette, ContactInfo, ResumeSection, WorkExperience, Education, Project, CustomItem } from '../types';
import { PhoneIcon } from './icons/PhoneIcon';
import { EmailIcon } from './icons/EmailIcon';
import { LocationIcon } from './icons/LocationIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { GitHubIcon } from './icons/GitHubIcon';

interface ResumePreviewProps {
  data: ResumeData;
  template: Template;
  colorPalette: ColorPalette;
}

const colorSchemes = {
  blue: {
    primary: 'text-blue-800',
    bg: 'bg-blue-600',
    border: 'border-blue-600',
    company: 'text-blue-700',
    fill: 'fill-blue-600',
    link: 'text-blue-700 hover:underline',
  },
  green: {
    primary: 'text-green-800',
    bg: 'bg-green-600',
    border: 'border-green-600',
    company: 'text-green-700',
    fill: 'fill-green-600',
    link: 'text-green-700 hover:underline',
  },
  black: {
    primary: 'text-black',
    bg: 'bg-zinc-900',
    border: 'border-black',
    company: 'text-zinc-800',
    fill: 'fill-black',
    link: 'text-zinc-800 hover:underline',
  },
  purple: {
    primary: 'text-purple-800',
    bg: 'bg-purple-600',
    border: 'border-purple-600',
    company: 'text-purple-700',
    fill: 'fill-purple-600',
    link: 'text-purple-700 hover:underline',
  }
};

const templates = {
    classic: ClassicTemplate,
    corporate: CorporateTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
    technical: TechnicalTemplate,
};


const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1123;

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, colorPalette }) => {
  const styles = {
    colors: colorSchemes[colorPalette],
  };

  const TemplateComponent = templates[template] || ClassicTemplate;

  const outerWrapperRef = useRef<HTMLDivElement>(null); 
  const previewRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string | number>('auto');

  useLayoutEffect(() => {
    const updateScaleAndHeight = () => {
      if (outerWrapperRef.current && previewRef.current) {
        const containerWidth = outerWrapperRef.current.offsetWidth;
        const previewScale = Math.min(1, containerWidth / PAGE_WIDTH_PX);
        previewRef.current.style.transform = `scale(${previewScale})`;
        setHeight(previewRef.current.offsetHeight * previewScale);
      }
    };
    
    updateScaleAndHeight();
    window.addEventListener('resize', updateScaleAndHeight);
    const observer = new ResizeObserver(updateScaleAndHeight);
    if (previewRef.current) observer.observe(previewRef.current);

    return () => {
      window.removeEventListener('resize', updateScaleAndHeight);
      if (previewRef.current) observer.unobserve(previewRef.current);
    };
  }, [data, template, colorPalette]);

  return (
    <div ref={outerWrapperRef} style={{ height: height, transition: 'height 0.2s ease-out' }} className="relative">
      <div
        ref={previewRef}
        id="resume-preview"
        className="absolute top-0 left-0 bg-white shadow-lg transition-transform duration-300 origin-top-left"
        style={{ 
          width: `${PAGE_WIDTH_PX}px`, 
          minHeight: `${PAGE_HEIGHT_PX}px`,
        }}
      >
        <TemplateComponent data={data} styles={styles} />
      </div>
    </div>
  );
};

// --- SHARED TEMPLATE COMPONENTS ---

interface TemplateProps {
  data: ResumeData;
  styles: {
    colors: typeof colorSchemes[ColorPalette];
  };
}

const formatUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
}

const ContactLine: React.FC<{ contact: ContactInfo; separator?: string; className?: string; colors: TemplateProps['styles']['colors'] }> = ({ contact, separator = '|', className='', colors }) => {
    const items = [
        contact.email && { type: 'email', value: contact.email },
        contact.phone && { type: 'phone', value: contact.phone },
        contact.location && { type: 'location', value: contact.location },
        contact.linkedin && { type: 'linkedin', value: contact.linkedin },
        contact.github && { type: 'github', value: contact.github },
    ].filter(Boolean);

    return (
        <div className={`flex justify-center flex-wrap gap-x-2 gap-y-1 text-10pt text-zinc-800 ${className}`}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {item.type === 'email' ? <a href={`mailto:${item.value}`} className={colors.link}>{item.value}</a> :
                     item.type === 'linkedin' ? <a href={formatUrl(item.value)} target="_blank" rel="noopener noreferrer" className={colors.link}>{item.value}</a> :
                     item.type === 'github' ? <a href={formatUrl(item.value)} target="_blank" rel="noopener noreferrer" className={colors.link}>{item.value}</a> :
                     <span>{item.value}</span>}
                    {index < items.length - 1 && <span className="text-zinc-400">{separator}</span>}
                </React.Fragment>
            ))}
        </div>
    );
};

// --- SECTION PREVIEW COMPONENTS ---

const SectionPreview: React.FC<{ section: ResumeSection, colors: TemplateProps['styles']['colors'], templateName: Template }> = ({ section, colors, templateName }) => {
    const content = section.content;
    switch (section.type) {
        case 'summary':
            return <p className="text-black text-10pt">{content as string}</p>;
        case 'experience':
            return (
                <div>
                    {(content as WorkExperience[]).map(exp => (
                        <div key={exp.id} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-11pt text-black">{exp.role}</h3>
                                <p className="text-10pt font-medium text-zinc-700">{exp.duration}</p>
                            </div>
                            <p className={`text-11pt font-semibold ${colors.company}`}>{exp.company}</p>
                            <ul className="list-disc list-inside mt-1 text-black text-10pt space-y-1">
                                {exp.responsibilities.map((line, i) => line.trim() && <li key={i}>{line}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            );
        case 'education':
            return (
                <div>
                    {(content as Education[]).map(edu => (
                        <div key={edu.id} className="flex justify-between items-baseline mb-1">
                            <div>
                                <h3 className="font-bold text-11pt text-black">{edu.institution}</h3>
                                <p className="text-10pt text-black">{edu.degree}</p>
                            </div>
                            <p className="text-10pt font-medium text-zinc-700">{edu.duration}</p>
                        </div>
                    ))}
                </div>
            );
        case 'projects':
            return (
                <div>
                    {(content as Project[]).map(proj => (
                        <div key={proj.id} className="mb-2">
                             <h3 className={`font-bold text-11pt ${templateName === 'technical' ? 'font-roboto-mono' : ''}`}>{proj.name}</h3>
                             <p className="text-10pt text-black">{proj.description}</p>
                        </div>
                    ))}
                </div>
            );
        case 'skills':
            return (
                <div className="text-10pt text-black space-y-1">
                    {Object.entries(content as Record<string, string[]>).map(([category, skillNames]) => (
                        <div key={category} className="flex items-start">
                            <span className="font-semibold w-1/3 pr-2">{category}:</span>
                            <span className={`w-2/3 ${templateName === 'technical' ? 'font-roboto-mono' : ''}`}>{skillNames.join(', ')}</span>
                        </div>
                    ))}
                </div>
            );
        case 'custom':
        case 'certifications':
        case 'awards':
        case 'volunteer':
        case 'interests':
            return (
                 <div>
                    {(content as CustomItem[]).map(item => (
                        <div key={item.id} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-11pt text-black">{item.title}</h3>
                                <p className="text-10pt font-medium text-zinc-700">{item.subtitle}</p>
                            </div>
                            {item.description && <p className="text-10pt text-black">{item.description}</p>}
                        </div>
                    ))}
                </div>
            )
        default: return null;
    }
}


// --- TEMPLATE IMPLEMENTATIONS ---

function ClassicTemplate({ data, styles }: TemplateProps) {
  const { colors } = styles;
  return (
    <div className="p-14 line-height-1-4 font-inter">
      <header className="text-center mb-5">
        <h1 className="text-24pt font-bold tracking-normal">{data.name}</h1>
        <p className={`text-14pt font-normal mt-1 ${colors.primary}`}>{data.title}</p>
        <div className="mt-2"><ContactLine contact={data.contact} colors={colors} /></div>
      </header>
      
      <div className="space-y-4">
        {data.sections.map(section => (
            <section key={section.id}>
                <h2 className={`text-12pt font-bold uppercase ${colors.primary} border-b-2 ${colors.border} pb-1 mb-2 tracking-wider`}>{section.title}</h2>
                <SectionPreview section={section} colors={colors} templateName="classic" />
            </section>
        ))}
      </div>
    </div>
  );
};


function CorporateTemplate({ data, styles }: TemplateProps) {
  const { colors } = styles;
  return (
    <div className="p-14 line-height-1-4 font-garamond">
      <header className={`text-center border-b-4 pb-3 ${colors.border}`}>
        <h1 className="text-32pt font-bold tracking-tight">{data.name}</h1>
        <p className={`text-14pt font-normal mt-1 ${colors.primary}`}>{data.title}</p>
      </header>
      <div className="text-center mt-3">
        <ContactLine contact={data.contact} separator='|' className="text-11pt" colors={colors} />
      </div>

      <div className="space-y-4 mt-5">
        {data.sections.map(section => (
            <section key={section.id}>
                <h2 className={`text-12pt font-bold uppercase ${colors.primary} tracking-widest mb-2`}>{section.title}</h2>
                <SectionPreview section={section} colors={colors} templateName="corporate"/>
            </section>
        ))}
      </div>
    </div>
  );
}

function CreativeTemplate({ data, styles }: TemplateProps) {
  const { colors } = styles;
  const { summary, ...otherSections } = data.sections.reduce((acc, section) => ({...acc, [section.type]: section}), {} as Record<string, ResumeSection>);

  return (
    <div className="flex h-full font-inter text-10pt">
      <aside className={`w-[30%] h-full p-6 ${colors.bg}`}>
        <div className="text-white">
          <h1 className="text-24pt font-bold leading-tight">{data.name}</h1>
          <p className="text-12pt mt-1">{data.title}</p>
        </div>
        <div className="mt-8 space-y-5 text-white">
          <section>
            <h2 className="text-11pt font-bold uppercase tracking-wider border-b border-white pb-1 mb-2">Contact</h2>
            <div className="space-y-2 text-10pt">
              {data.contact.email && <p className="flex items-center gap-2"><EmailIcon /> <a href={`mailto:${data.contact.email}`} className="hover:underline">{data.contact.email}</a></p>}
              {data.contact.phone && <p className="flex items-center gap-2"><PhoneIcon /> {data.contact.phone}</p>}
              {data.contact.location && <p className="flex items-center gap-2"><LocationIcon /> {data.contact.location}</p>}
              {data.contact.linkedin && <p className="flex items-center gap-2"><LinkedInIcon /> <a href={formatUrl(data.contact.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.contact.linkedin}</a></p>}
              {data.contact.github && <p className="flex items-center gap-2"><GitHubIcon /> <a href={formatUrl(data.contact.github)} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.contact.github}</a></p>}
            </div>
          </section>
          {data.sections.filter(s => ['skills', 'education'].includes(s.type)).map(section => (
              <section key={section.id}>
                <h2 className="text-11pt font-bold uppercase tracking-wider border-b border-white pb-1 mb-2">{section.title}</h2>
                <SectionPreview section={section} colors={colors} templateName="creative"/>
              </section>
          ))}
        </div>
      </aside>
      <main className="w-[70%] h-full p-8 overflow-y-hidden line-height-1-4">
         <div className="space-y-4">
            {data.sections.filter(s => !['skills', 'education'].includes(s.type)).map(section => (
                <section key={section.id}>
                    <h2 className={`text-12pt font-bold uppercase ${colors.primary} tracking-widest mb-2`}>{section.title}</h2>
                    <SectionPreview section={section} colors={colors} templateName="creative"/>
                </section>
            ))}
        </div>
      </main>
    </div>
  );
}

function ExecutiveTemplate({ data, styles }: TemplateProps) {
    const { colors } = styles;
    return (
        <div className="p-12 font-lora line-height-1-4">
            <header className="text-center mb-6">
                <h1 className="text-28pt font-bold">{data.name}</h1>
                <p className={`text-14pt font-normal mt-1 ${colors.primary}`}>{data.title}</p>
                <div className="mt-2"><ContactLine contact={data.contact} separator='•' className="text-10pt" colors={colors} /></div>
            </header>
            
            <div className="flex gap-8">
                <div className="w-1/4">
                    {data.sections.map(section => (
                        <h2 key={section.id} className={`text-11pt font-bold uppercase ${colors.primary} mb-2 tracking-wider mt-10 first:mt-0`}>{section.title}</h2>
                    ))}
                </div>
                <div className={`w-3/4 border-l-2 pl-8 ${colors.border}`}>
                     {data.sections.map(section => (
                        <section key={section.id} className="mb-8">
                           <SectionPreview section={section} colors={colors} templateName="executive"/>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TechnicalTemplate({ data, styles }: TemplateProps) {
    const { colors } = styles;
    return (
        <div className="p-12 font-roboto-mono line-height-1-4">
            <header className={`p-4 ${colors.bg} bg-opacity-10 mb-6`}>
                <h1 className="text-20pt font-bold">{data.name} // <span className={`${colors.primary}`}>{data.title}</span></h1>
                <div className="mt-2"><ContactLine contact={data.contact} separator='//' className="text-9pt justify-start" colors={colors}/></div>
            </header>

            <div className="space-y-4">
                 {data.sections.map(section => (
                    <section key={section.id}>
                        <h2 className={`text-11pt font-bold uppercase text-zinc-600 tracking-widest mb-2`}>&lt;{section.title}&gt;</h2>
                        <div className="pl-4">
                            <SectionPreview section={section} colors={colors} templateName="technical"/>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}