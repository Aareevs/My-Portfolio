import React, { useState } from 'react';
import { Search, LayoutGrid, List, Star, Globe, Github, Monitor, Smartphone, Cpu, ExternalLink, Instagram } from 'lucide-react';
import { XP_ICONS } from '../../constants';
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";

const FREELANCE_PROJECTS = [
  {
    id: "sear-food",
    title: "Sear Food",
    category: "Freelance Web Project",
    logo: "/sear-food-logo.png",
    screenshot: "/sear-food-screenshot.png",
    description:
      "A premium culinary website built to showcase authentic Indian masalas, spices, and dehydrated foods for retail and export audiences.",
    highlights: [
      "Premium catalog presentation for products",
      "Search and category-based filtering",
      "Responsive design for desktop and mobile",
      "Cinematic landing section with polished interactions",
    ],
    techStack: ["TypeScript", "Vite", "Vanilla CSS", "JavaScript"],
  },
];

// --- User's Projects Data ---
const PROJECTS = [
  {
    id: 1,
    title: "Vaani Setu",
    category: "Web & Mobile",
    image: "/vaani_example.png",
    logo: "/vaani-setu-logo.png",
    description: "Vaani Setu uses advanced AI technology to interpret sign language in real-time, creating an inclusive environment where everyone can communicate effortlessly.",
    problemSolved: "Breaking communication barriers by converting live sign language gestures into instant text and natural-sounding speech output.",
    architecture: [
      "Camera Detection: AI captures and analyzes hand gestures through your camera in real-time",
      "AI Processing: advanced machine learning models interpret gestures with high accuracy",
      "Text & Speech Output: instant conversion into readable text and natural-sounding speech",
      "Inclusive communication flow designed for fast, effortless interaction"
    ],
    techStack: ["TypeScript", "React", "Kotlin", "Android"],
    websiteTechStack: ["TypeScript", "React", "HTML/CSS", "JavaScript", "PostgreSQL (PL/pgSQL)"],
    appTechStack: ["Kotlin", "Android", "HTML/CSS", "Android Studio", "Python"],
    highlights: [
      { icon: <Globe size={14} />, text: "Live production deployment" },
      { icon: <Monitor size={14} />, text: "Modern interactive UI" },
      { icon: <Smartphone size={14} />, text: "Mobile app available" }
    ],
    status: "Completed",
    isFeatured: true,
    isStartup: true,
    demoUrl: "https://vaani-setu-website.vercel.app/",
    githubUrl: "https://github.com/Aareevs/Vaani-Setu-Website", 
    backendUrl: "https://github.com/Aareevs/Vaani-Setu-Mobile-App",
    instagramUrl: "https://www.instagram.com/vaani_setu/"
  },
  {
    id: 2,
    title: "VSX: Buy or Bail",
    category: "Web",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    logo: "/vsx-logo.png",
    description: "A Stock Simulation Event platform for the NOESIS Tech Fest held by Vedam School of Technology. Features real-time stock value updates.",
    architecture: [
      "Real-time stock value engine",
      "Authentication and Event Management"
    ],
    techStack: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Python"],
    status: "Completed",
    isFeatured: true,
    isStartup: false,
    demoUrl: "https://vsx-buy-or-bail.vercel.app/",
    githubUrl: "https://github.com/Aareevs/Stock-Website"
  },
  {
    id: 3,
    title: "VPL-Auction-Website",
    category: "Web",
    image: "https://img1.hscicdn.com/image/upload/f_auto/lsci/db/PICTURES/CMS/272500/272593.6.jpg",
    logo: "/vpl-logo.png",
    description: "An IPL Auction Style area where website contains a dashboard and squad list for teams to see and an admin panel for admin to add players up for auction.",
    architecture: [
      "Interactive Dashboard & Squad List",
      "Admin Panel for Auction Management"
    ],
    techStack: ["TypeScript", "React", "Node.js", "HTML/CSS", "Python"],
    status: "Completed",
    isFeatured: false,
    isStartup: false,
    demoUrl: "https://vedam-premier-league-vpl.vercel.app/",
    githubUrl: "https://github.com/Aareevs/VPL-Auction-Website"
  },
  {
    id: 4,
    title: "Microsoft XP Portfolio",
    category: "Web",
    image: "https://images.techeblog.com/wp-content/uploads/2025/02/21195755/run-windows-xp-apple-tv.jpg",
    logo: "/windows-xp-logo.png",
    description: "A nostalgic recreation of Windows XP as a portfolio.",
    architecture: [
      "Framer Motion for dragging and animations",
      "React context for window management"
    ],
    techStack: ["React", "TailwindCSS", "Framer Motion"],
    status: "Completed",
    isFeatured: true,
    isStartup: false,
    demoUrl: "https://aareev-microsoft-xp-portfolio.vercel.app/",
    githubUrl: "https://github.com/Aareevs/Aareev-Microsoft-XP-Portfolio"
  },
  {
    id: 5,
    title: "MacOS-Recreation",
    category: "Web",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    logo: "/macos.png",
    description: "A recreation of the MacOS System that is Interactive and realistic. Inspired by Mitch Ivin.",
    architecture: [
      "Interactive Component Architecture",
      "Realistic OS behaviors & logic"
    ],
    techStack: ["TypeScript", "React", "HTML/CSS", "Framer Motion"],
    isFeatured: false,
    isStartup: false,
    demoUrl: "https://macos-recreation.vercel.app/",
    githubUrl: "https://github.com/Aareevs/MacOS-Recreation"
  },
  {
    id: 6,
    title: "ChronoTask",
    category: "Web",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80",
    logo: "/chronotask-logo.png",
    description: "The ultimate student productivity hub featuring smart dashboards, task management, focus timers, and community collaboration.",
    architecture: [
      "Smart Dashboards",
      "Task & Schedule Management"
    ],
    techStack: ["TypeScript", "React"],
    status: "Completed",
    isFeatured: false,
    isStartup: false,
    demoUrl: "https://chronotask-phi.vercel.app/#",
    githubUrl: "https://github.com/Aareevs/InnoVedam-Hackathon-Youva"
  },
  {
    id: 7,
    title: "Focus-Time",
    category: "Extension",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80",
    description: "Focus Time is a browser extension to help you focus on education and priorities. Compatible with Google Chrome, Edge, Brave, Opera, etc.",
    architecture: [
      "Browser Extension APIs",
      "Focus Mode & Tracking"
    ],
    techStack: ["JavaScript", "HTML", "CSS"],
    status: "Completed",
    isFeatured: false,
    isStartup: false,
    githubUrl: "https://github.com/Aareevs/Focus-Time-Extension"
  },
  {
    id: 8,
    title: "Blurline: Corporate Credit Intelligence Systems",
    category: "Web & AI",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    logo: "/blurline-logo.png",
    description: "A full-stack AI credit appraisal platform that evaluates business risk from uploaded company datasets, computes a weighted credit score, and produces an explainable appraisal report.",
    architecture: [
      "Multi-file Ingestion & Normalization",
      "Analysis Agents & LLM Report Generation"
    ],
    techStack: ["React", "FastAPI", "Python", "Tailwind CSS"],
    status: "Completed",
    isFeatured: true,
    isStartup: true,
    demoUrl: "https://alta-hackathon-code-bloods.vercel.app",
    githubUrl: "https://github.com/Aareevs/AltaHackathon_CodeBloods", 
  },
  {
    id: 9,
    title: "OpenEnv: Release Desk",
    category: "AI & Tools",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    description: "OpenEnv is an interactive environment for AI training data sanitization and compliance auditing. Turns the workflow into a deterministic environment for agent evaluation and learning.",
    architecture: [
      "Interactive Playground & Python Tooling",
      "FastAPI service for agent evaluation interface"
    ],
    techStack: ["Python", "FastAPI", "Uvicorn"],
    status: "Completed",
    isFeatured: false,
    isStartup: false,
    demoUrl: "https://huggingface.co/spaces/mrhapile/llm-sanitizer",
    githubUrl: "https://github.com/Aareevs/Openenv-LLMAI-Scalar"
  }
];

interface MyProjectsProps extends ComponentProcessProps {
  onOpenProject?: (url: string, title: string, width?: number, height?: number) => void;
}

const MyProjects: React.FC<MyProjectsProps> = ({ onOpenProject }) => {
  const [activeTab, setActiveTab] = useState('My Projects');
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);

  const toggleDescription = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setExpandedProjects(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const matchesSearch = (project: (typeof PROJECTS)[number]): boolean => {
    if (!normalizedSearch) return true;

    const searchableText = [
      project.title,
      project.category,
      project.description,
      ...project.architecture,
      ...project.techStack,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  };

  const matchesFilter = (project: (typeof PROJECTS)[number]): boolean => {
    if (filter === 'Featured') return Boolean(project.isFeatured);
    if (filter === '🚀 Startup') return Boolean(project.isStartup);
    if (filter === 'Web') return project.category.toLowerCase().includes('web');

    return true;
  };

  const filteredProjects = PROJECTS.filter(
    (project) => matchesFilter(project) && matchesSearch(project)
  );
  const featuredProject = filteredProjects.find((p) => p.id === 1);
  const gridProjects = filteredProjects.filter((p) => p.id !== 1);
  const featuredBadgeProjectIds = new Set([1, 2]);
  const shouldShowCompletedCheck = (projectTitle: string) =>
    projectTitle === 'VSX: Buy or Bail' || projectTitle === 'Focus-Time';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1c1c1e', color: 'white', fontFamily: 'Inter, sans-serif', overflow: 'hidden', userSelect: 'none' }}>

      {/* Main App Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        
        {/* Navigation Tabs - Stationary */}
        <div className="flex-shrink-0 flex items-center px-6 pt-4 border-b border-[#3a3a3c]">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('My Projects')}
              className={`px-3 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${activeTab === 'My Projects' ? 'bg-[#2c2c2e] text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2c2c2e]/50'}`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('Freelance Projects')}
              className={`px-3 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${activeTab === 'Freelance Projects' ? 'bg-[#2c2c2e] text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2c2c2e]/50'}`}
            >
              Freelance Projects
            </button>
            <button 
              onClick={() => setActiveTab('GitHub Repos')}
              className={`px-3 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${activeTab === 'GitHub Repos' ? 'bg-[#2c2c2e] text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2c2c2e]/50'}`}
            >
              GitHub Repos
            </button>
          </div>
        </div>

        {/* Toolbar (Search & Filters) - Stationary */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-[#1c1c1e]">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={activeTab === 'My Projects' ? "Search projects..." : activeTab === 'Freelance Projects' ? "Search freelance projects..." : "Search repositories..."}
              className="w-full bg-[#2c2c2e] border border-[#3a3a3c] rounded-[6px] pl-9 pr-4 py-1.5 text-[13px] text-gray-300 focus:outline-none focus:border-[#5a5a5c] placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Filter Pills (My Projects Only) */}
            {activeTab === 'My Projects' && (
              <div className="flex items-center bg-[#2c2c2e] rounded-md p-1 border border-[#3a3a3c]">
                {['All', 'Featured', '🚀 Startup', 'Web'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-[12px] font-medium rounded-[4px] transition-colors ${filter === f ? 'bg-[#4a4a4c] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
            
            {activeTab === 'My Projects' && <div className="w-[1px] h-5 bg-[#3a3a3c]"></div>}

            {/* View Toggles */}
            <div className="flex items-center bg-[#2c2c2e] rounded-md p-1 border border-[#3a3a3c]">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-[4px] transition-colors ${viewMode === 'grid' ? 'bg-[#4a4a4c] text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-[4px] transition-colors ${viewMode === 'list' ? 'bg-[#4a4a4c] text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Scrollable Area */}
        {activeTab === 'My Projects' ? (
          <div className="dark-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px', minHeight: 0 }}>
          
          {/* Featured Hero Project */}
          {featuredProject && viewMode === 'grid' && (
            <div className="mb-6 rounded-xl bg-[#20293a] border border-[#3a445c] overflow-hidden">
              <div className="grid grid-cols-1 xl:grid-cols-[40%_60%]">
                <div className="relative h-[220px] xl:h-auto">
                  <img
                    src={featuredProject.image}
                    alt={featuredProject.title}
                    className="w-full h-full object-cover"
                  />
                  {"logo" in featuredProject && featuredProject.logo && (
                    <div className="absolute bottom-4 right-4 w-24 h-24 rounded-xl bg-[#f4f7fb] border border-[#cfd9e6] p-2 shadow-xl flex items-center justify-center">
                      <img
                        src={featuredProject.logo}
                        alt={`${featuredProject.title} logo`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-[#fb923c] text-black text-[11px] uppercase font-bold px-3 py-1.5 rounded flex items-center gap-1.5">
                    <Star size={12} fill="currentColor" />
                    Featured Startup Project
                  </div>
                </div>

                <div className="p-6 xl:p-7">
                  <h2 className="text-[34px] font-bold text-white tracking-tight mb-2">{featuredProject.title}</h2>
                  <p className="text-[#a0afc0] text-[16px] leading-relaxed mb-4">
                    {featuredProject.description}
                  </p>

                  {featuredProject.problemSolved && (
                    <div className="rounded-lg bg-[#2c3951] border border-[#445272] px-4 py-3 mb-4">
                      <p className="text-[#67b0ff] text-[12px] font-semibold uppercase tracking-wide mb-1">
                        Problem Solved
                      </p>
                      <p className="text-[#c7d2e0] text-[14px] leading-relaxed">{featuredProject.problemSolved}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-[#34d399] text-[12px] font-semibold uppercase tracking-wide mb-2">
                      Architecture
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {featuredProject.architecture.map((item) => (
                        <div key={item} className="flex items-start gap-2 rounded-md bg-[#25324a]/70 border border-[#394a68] px-3 py-2 text-[#dbeafe] text-[13px]">
                          <svg className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                    <div className="rounded-lg bg-[#25324a]/60 border border-[#3a4a67] p-3">
                      <div className="flex items-center gap-2 text-[#8ab4ff] text-[12px] font-semibold uppercase tracking-wide mb-2">
                        <Monitor size={13} />
                        Website Stack
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {featuredProject.websiteTechStack?.map((tech) => (
                          <span key={`web-${tech}`} className="bg-[#1f2a3d] border border-[#415174] text-[#d1d5db] text-[11px] px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#25324a]/60 border border-[#3a4a67] p-3">
                      <div className="flex items-center gap-2 text-[#8ab4ff] text-[12px] font-semibold uppercase tracking-wide mb-2">
                        <Cpu size={13} />
                        App Stack
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {featuredProject.appTechStack?.map((tech) => (
                          <span key={`app-${tech}`} className="bg-[#1f2a3d] border border-[#415174] text-[#d1d5db] text-[11px] px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredProject.highlights?.map((item, idx) => (
                      <div key={idx} className="inline-flex items-center gap-1.5 rounded-full border border-[#3c4f70] bg-[#263450] text-[#d6e4ff] text-[12px] px-3 py-1">
                        {item.icon}
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => {
                        if (featuredProject.demoUrl) window.open(featuredProject.demoUrl, '_blank');
                      }}
                      className="bg-[#24a0ed] hover:bg-[#1a88ce] text-white text-[13px] font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all"
                    >
                      <Globe size={14} />
                      Live
                    </button>
                    {featuredProject.githubUrl && (
                      <button
                        onClick={() => window.open(featuredProject.githubUrl, '_blank')}
                        className="bg-[#4b5563] hover:bg-[#6b7280] text-white text-[13px] font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Github size={14} />
                        Website Repo
                      </button>
                    )}
                    {featuredProject.backendUrl && (
                      <button
                        onClick={() => window.open(featuredProject.backendUrl, '_blank')}
                        className="bg-[#4b5563] hover:bg-[#6b7280] text-white text-[13px] font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Smartphone size={14} />
                        App Repo
                      </button>
                    )}
                    {featuredProject.instagramUrl && (
                      <button
                        onClick={() => window.open(featuredProject.instagramUrl, '_blank')}
                        className="bg-[#3f3f46] hover:bg-[#52525b] text-white text-[13px] font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Instagram size={14} />
                        Instagram
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No projects match your current search/filter.
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
              {gridProjects.map(project => (
                <div key={project.id} className="bg-[#242426] border border-[#3a3a3c] hover:border-[#5a5a5c] rounded-xl overflow-hidden flex flex-col group transition-all duration-300">
                  <div className="h-48 relative overflow-hidden">
                    {featuredBadgeProjectIds.has(project.id) && (
                      <div className="absolute top-4 left-4 bg-yellow-500/90 text-black text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 z-10 backdrop-blur-sm">
                        <Star size={10} fill="currentColor" />
                        Featured
                      </div>
                    )}
                    {shouldShowCompletedCheck(project.title) && (
                      <div className="absolute top-4 right-4 bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30 text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 z-10 backdrop-blur-sm">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        completed
                      </div>
                    )}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-5 backdrop-blur-[2px]">
                      {project.githubUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.githubUrl, '_blank');
                          }}
                          className="bg-[#f3f4f6] text-black text-[16px] font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-white transition-all shadow-xl hover:scale-105"
                        >
                          <Github size={20} />
                          Code
                        </button>
                      )}
                      {project.demoUrl && (
                        <button
                          className="bg-[#3b82f6] text-white text-[16px] font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#2563eb] transition-all shadow-xl hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.demoUrl, '_blank');
                          }}
                        >
                          <ExternalLink size={20} />
                          Demo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer">{project.title}</h3>
                      <span className="bg-[#3a3a3c] text-gray-300 text-[10px] px-2 py-0.5 rounded border border-[#4a4a4c] uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>

                    <p 
                      onClick={(e) => toggleDescription(e, project.id as number)}
                      className={`text-gray-400 text-[13px] mb-4 leading-relaxed cursor-pointer transition-all duration-300 ${expandedProjects.includes(project.id as number) ? '' : 'line-clamp-2'}`}
                      title={expandedProjects.includes(project.id as number) ? "Click to show less" : "Click to view full description"}
                    >
                      {project.description}
                    </p>

                    <div className="flex flex-col gap-2 mb-6 mt-auto">
                      {project.architecture.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-gray-400 text-[12px]">
                          <svg className="w-3.5 h-3.5 text-[#34d399] shrink-0 mt-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-[#3a3a3c]">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="bg-[#2c2c2e] border border-[#3a3a3c] text-gray-300 text-[11px] px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="bg-[#2c2c2e] border border-[#3a3a3c] text-gray-400 text-[11px] px-2 py-0.5 rounded">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-20">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-[#242426] border border-[#3a3a3c] hover:border-[#5a5a5c] rounded-xl p-4 flex gap-4 items-center transition-colors">
                  {'logo' in project && project.logo ? (
                    <div className={`w-24 h-24 rounded-lg shrink-0 border border-[#3a3a3c] p-2 flex items-center justify-center ${project.id === 1 || project.id === 2 || project.id === 6 ? 'bg-[#f3f4f6]' : 'bg-[#1f1f22]'}`}>
                      <img
                        src={project.logo}
                        alt={`${project.title} logo`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-24 h-24 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white truncate mb-1">{project.title}</h3>
                    <div className="mb-2">
                      <span className="inline-flex bg-[#3a3a3c] text-gray-300 text-[10px] px-2 py-0.5 rounded border border-[#4a4a4c] uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                    <p 
                      onClick={(e) => toggleDescription(e, project.id as number)}
                      className={`text-gray-400 text-[13px] mb-2 cursor-pointer transition-all duration-300 ${expandedProjects.includes(project.id as number) ? '' : 'line-clamp-2'}`}
                      title={expandedProjects.includes(project.id as number) ? "Click to show less" : "Click to view full description"}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <span key={`${project.id}-${tech}`} className="bg-[#2c2c2e] border border-[#3a3a3c] text-gray-300 text-[11px] px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {project.githubUrl && (
                      <button
                        onClick={() => window.open(project.githubUrl, '_blank')}
                        className="bg-[#4b5563] hover:bg-[#6b7280] text-white text-[12px] font-medium px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors"
                      >
                        <Github size={13} />
                        Code
                      </button>
                    )}
                    {project.demoUrl && (
                      <button
                        onClick={() => window.open(project.demoUrl, '_blank')}
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[12px] font-medium px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink size={13} />
                        Demo
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        ) : activeTab === 'Freelance Projects' ? (
          <FreelanceProjects viewMode={viewMode} searchQuery={searchQuery} />
        ) : (
          <GitHubRepos viewMode={viewMode} searchQuery={searchQuery} />
        )}

      </div>

      {/* Footer Area */}
      <div style={{ flexShrink: 0, height: 32, backgroundColor: '#222224', borderTop: '1px solid #3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: 12, color: '#9ca3af' }}>
        <span>{activeTab === 'My Projects' ? `${filteredProjects.length} project${filteredProjects.length === 1 ? '' : 's'}` : activeTab === 'Freelance Projects' ? `${FREELANCE_PROJECTS.length} freelance project` : 'Repositories'}</span>
        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
          <Star size={12} className="text-yellow-500" />
          <span>stars</span>
        </div>
      </div>
      
    </div>
  );
};

const FreelanceProjects: React.FC<{
  searchQuery: string;
  viewMode: 'grid' | 'list';
}> = ({ searchQuery, viewMode }) => {
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  const toggleDescription = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedProjects(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProjects = FREELANCE_PROJECTS.filter((project) => {
    if (!normalizedSearch) return true;

    return [
      project.title,
      project.category,
      project.description,
      ...project.highlights,
      ...project.techStack,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  });

  return (
    <div className="dark-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px', minHeight: 0 }}>
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No freelance projects match your search.</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-[#242426] border border-[#3a3a3c] rounded-xl overflow-hidden">
              <div className="h-56 bg-[#18181b] flex items-center justify-center border-b border-[#3a3a3c]">
                <img
                  src={project.screenshot}
                  alt={`${project.title} website screenshot`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={project.logo}
                    alt={`${project.title} logo`}
                    className="w-10 h-10 rounded-md bg-white object-cover"
                    draggable={false}
                    onDragStart={(event) => event.preventDefault()}
                    onCopy={(event) => event.preventDefault()}
                    onContextMenu={(event) => event.preventDefault()}
                    onMouseDown={(event) => event.preventDefault()}
                    style={{ userSelect: 'none' }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <p className="text-xs text-gray-400">{project.category}</p>
                  </div>
                </div>

                <p 
                  onClick={(e) => toggleDescription(e, project.id as string)}
                  className={`text-gray-300 text-[13px] leading-relaxed mb-4 cursor-pointer transition-all duration-300 ${expandedProjects.includes(project.id as string) ? '' : 'line-clamp-2'}`}
                  title={expandedProjects.includes(project.id as string) ? "Click to show less" : "Click to view full description"}
                >
                  {project.description}
                </p>

                <div className="flex flex-col gap-2 mb-4">
                  {project.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-gray-400 text-[12px]">
                      <svg className="w-3.5 h-3.5 text-[#34d399] shrink-0 mt-[1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="bg-[#2c2c2e] border border-[#3a3a3c] text-gray-300 text-[11px] px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-20">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-[#242426] border border-[#3a3a3c] rounded-xl p-4 flex gap-4 items-center">
              <img
                src={project.logo}
                alt={`${project.title} logo`}
                className="w-24 h-24 rounded-lg bg-white object-contain p-2 shrink-0"
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                onCopy={(event) => event.preventDefault()}
                onContextMenu={(event) => event.preventDefault()}
                onMouseDown={(event) => event.preventDefault()}
                style={{ userSelect: 'none' }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-semibold text-white truncate">{project.title}</h3>
                  <span className="bg-[#3a3a3c] text-gray-300 text-[10px] px-2 py-0.5 rounded border border-[#4a4a4c] uppercase tracking-wider shrink-0">
                    Freelance
                  </span>
                </div>
                <p 
                  onClick={(e) => toggleDescription(e, project.id as string)}
                  className={`text-gray-400 text-[13px] mb-2 cursor-pointer transition-all duration-300 ${expandedProjects.includes(project.id as string) ? '' : 'line-clamp-2'}`}
                  title={expandedProjects.includes(project.id as string) ? "Click to show less" : "Click to view full description"}
                >
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 5).map((tech) => (
                    <span key={`${project.id}-${tech}`} className="bg-[#2c2c2e] border border-[#3a3a3c] text-gray-300 text-[11px] px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GitHubRepos: React.FC<{
  searchQuery: string;
  viewMode: 'grid' | 'list';
}> = ({ searchQuery, viewMode }) => {
  const [repos, setRepos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('https://api.github.com/users/Aareevs/repos?sort=updated&per_page=100')
      .then(res => res.json())
      .then(data => {
        setRepos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching repos:", err);
        setLoading(false);
      });
  }, []);

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'TypeScript': return 'bg-[#3178c6]';
      case 'JavaScript': return 'bg-[#f1e05a]';
      case 'Java': return 'bg-[#b07219]';
      case 'HTML': return 'bg-[#e34c26]';
      case 'CSS': return 'bg-[#563d7c]';
      case 'Python': return 'bg-[#3572A5]';
      default: return 'bg-gray-500';
    }
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const msDiff = now.getTime() - date.getTime();
    const days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredRepos = repos.filter((repo) => {
    if (!normalizedSearch) return true;

    return [
      repo.name,
      repo.description || '',
      repo.language || '',
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  });

  return (
    <div className="dark-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px', minHeight: 0 }}>
      {loading ? (
        <div className="flex items-center justify-center p-12 text-gray-400">Loading repositories...</div>
      ) : filteredRepos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No repositories match your search.</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-20">
          {filteredRepos.map(repo => (
            <div key={repo.id} className="bg-[#242426] border border-[#3a3a3c] hover:border-[#5a5a5c] rounded-xl p-5 flex flex-col group cursor-pointer transition-colors" onClick={() => window.open(repo.html_url, '_blank')}>
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1 text-white font-semibold text-[15px] group-hover:text-blue-400 transition-colors">
                  <Github size={18} className="shrink-0 mt-0.5" />
                  <span className="truncate block min-w-0" title={repo.name}>{repo.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-[12px] shrink-0">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500" />
                    {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#3b82f6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>
                    {repo.forks_count}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-[13px] line-clamp-2 mb-6 min-h-[40px]">
                {repo.description || 'No description available'}
              </p>
              
              <div className="flex justify-between items-center mt-auto text-[11px] text-gray-400">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${getLanguageColor(repo.language)}`}></span>
                  <span className="truncate">{repo.language || 'Unknown'}</span>
                </div>
                <span className="shrink-0">{timeAgo(repo.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-20">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="bg-[#242426] border border-[#3a3a3c] hover:border-[#5a5a5c] rounded-xl p-4 flex gap-4 items-center cursor-pointer transition-colors"
              onClick={() => window.open(repo.html_url, '_blank')}
            >
              <div className="w-24 h-24 rounded-lg shrink-0 border border-[#3a3a3c] bg-[#1f1f22] flex items-center justify-center">
                <Github size={38} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-semibold text-white truncate" title={repo.name}>{repo.name}</h3>
                </div>
                <p className="text-gray-400 text-[13px] line-clamp-2 mb-2">
                  {repo.description || 'No description available'}
                </p>
                <div className="flex items-center gap-3 text-gray-400 text-[12px]">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500" />
                    {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#3b82f6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>
                    {repo.forks_count}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${getLanguageColor(repo.language)}`}></span>
                    <span className="truncate">{repo.language || 'Unknown'}</span>
                  </div>
                  <span className="shrink-0">{timeAgo(repo.updated_at)}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    window.open(repo.html_url, '_blank');
                  }}
                  className="bg-[#4b5563] hover:bg-[#6b7280] text-white text-[12px] font-medium px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Github size={13} />
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Arrow Right Icon component
const ArrowRight = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default MyProjects;
