
import { ResumeData } from './types';

export const initialResumeData: ResumeData = {
  name: "Jane Doe",
  title: "Senior Frontend Engineer",
  contact: {
    phone: "123-456-7890",
    email: "jane.doe@email.com",
    linkedin: "linkedin.com/in/janedoe",
    github: "github.com/janedoe",
    location: "San Francisco, CA",
  },
  sections: [
    {
      id: 'summary',
      type: 'summary',
      title: 'Professional Summary',
      isDeletable: false,
      content: "Innovative Senior Frontend Engineer with 8+ years of experience in building and maintaining responsive and scalable web applications. Proficient in React, TypeScript, and modern JavaScript frameworks. Passionate about creating seamless user experiences and writing clean, efficient code.",
    },
    {
      id: 'experience',
      type: 'experience',
      title: 'Work Experience',
      isDeletable: true,
      content: [
        {
          id: "work1",
          company: "Tech Solutions Inc.",
          role: "Senior Frontend Engineer",
          duration: "Jan 2020 - Present",
          responsibilities: [
            "Led the development of a new customer-facing dashboard using React and TypeScript, resulting in a 20% increase in user engagement.",
            "Mentored junior developers and conducted code reviews to maintain high code quality.",
            "Collaborated with UX/UI designers to implement complex design systems and improve application aesthetics.",
          ],
        },
        {
          id: "work2",
          company: "Innovate Co.",
          role: "Frontend Developer",
          duration: "Jun 2016 - Dec 2019",
          responsibilities: [
            "Developed and maintained features for a large-scale e-commerce platform using Angular and Node.js.",
            "Improved website performance by 15% through code optimization and lazy loading techniques.",
            "Worked in an Agile environment, participating in daily stand-ups and sprint planning.",
          ],
        },
      ]
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      isDeletable: true,
      content: [
        {
          id: "edu1",
          institution: "State University",
          degree: "B.S. in Computer Science",
          duration: "Aug 2012 - May 2016",
        },
      ]
    },
    {
      id: 'projects',
      type: 'projects',
      title: 'Projects',
      isDeletable: true,
      content: [
        {
          id: "proj1",
          name: "Personal Portfolio",
          link: "https://github.com/janedoe/portfolio",
          description: "A responsive personal portfolio website built with Next.js and deployed on Vercel to showcase my projects and skills."
        }
      ]
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      isDeletable: true,
      content: {
        "Programming Languages": ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"],
        "Frameworks & Libraries": ["React", "Node.js", "Tailwind CSS", "Next.js"],
        "Tools & Platforms": ["Git", "Docker", "Webpack", "Jest", "Vercel"],
      }
    }
  ]
};