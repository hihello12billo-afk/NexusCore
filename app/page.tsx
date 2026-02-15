"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useScroll, useSpring, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { 
  Zap, ArrowRight, CheckCircle2, Rocket, 
  Database, Lock, Code2, Brain, 
  Activity, Server as ServerIcon, Command, 
  Sun, Moon, Menu, X, Globe, Cpu, MessageSquare, 
  Share2, Terminal
} from 'lucide-react';
import ContactModal from '@/components/ContactModal';

// --- UTILITY COMPONENTS ---

const Spotlight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300 opacity-0 dark:opacity-100"
      style={{
        background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(79, 70, 229, 0.10), transparent 80%)`,
      }}
    />
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 origin-left z-[101]"
      style={{ scaleX }}
    />
  );
};

const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative group inline-block">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-indigo-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-75">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-purple-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-75 delay-75">{text}</span>
    </div>
  );
};

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("INITIALIZING CORE...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2; 
      });
    }, 20);

    const texts = ["LOADING NEURAL NET...", "CONNECTING TO DATABASE...", "DECRYPTING KEYS...", "SYSTEM READY"];
    let i = 0;
    const textTimer = setInterval(() => {
      if(i < texts.length) setText(texts[i++]);
    }, 400);

    return () => { clearInterval(timer); clearInterval(textTimer); };
  }, []);

  useEffect(() => {
    if (progress === 100) setTimeout(onComplete, 500);
  }, [progress, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center font-mono"
    >
      <div className="w-64 mb-4 text-xs text-indigo-400 flex justify-between">
        <span>{text}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-indigo-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragElastic={0.16}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      whileHover={{ cursor: "grabbing" }}
      className={`transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- THEME TOGGLE BUTTON ---
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white hover:scale-110 transition-transform flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

// --- MAIN PAGE ---

export default function LandingPage() {
  // We separate "isChecking" (database look up) from "showPreloader" (animation)
  const [isChecking, setIsChecking] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);
  
  const [activeTab, setActiveTab] = useState("marketing");
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const [randomData, setRandomData] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- SMART CHECK: SAME DAY LOGIC ---
  useEffect(() => {
    // 1. Get today's date (e.g., "Mon Feb 16 2026")
    const today = new Date().toDateString();
    
    // 2. Check what date we saved last time
    const lastVisitDate = localStorage.getItem("nexus_last_visit");

    if (lastVisitDate === today) {
      // VISITED TODAY: Don't show animation
      setShowPreloader(false);
    } else {
      // NEW VISIT OR DIFFERENT DAY: Show animation
      setShowPreloader(true);
    }

    // 3. Stop checking so we can render
    setIsChecking(false);
  }, []);

  // --- SAVE THE DATE WHEN ANIMATION ENDS ---
  const handleLoaderComplete = () => {
    setShowPreloader(false);
    // Save "Today" as the last visited date
    localStorage.setItem("nexus_last_visit", new Date().toDateString());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomData(Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 selection:bg-indigo-500 font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* 1. BLACK OVERLAY (Flash Prevention) */}
      {/* This sits on top of everything for the 0.05s it takes to check the date */}
      {isChecking && (
        <div className="fixed inset-0 z-[300] bg-[#020617]" />
      )}

      {/* 2. Preloader Animation (Only shows if isChecking is done AND showPreloader is true) */}
      <AnimatePresence>
        {!isChecking && showPreloader && <Preloader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {/* 3. Main Content - Always Rendered (SEO Friendly) */}
      <motion.div 
        initial={{ opacity: 0 }} 
        // Logic: If checking OR showing preloader -> Hide content visually (opacity 0)
        // Once both are done -> Show content (opacity 1)
        animate={{ opacity: (isChecking || showPreloader) ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
          <Spotlight />
          <ScrollProgress />
          
          {/* NAVBAR */}
          <nav className="fixed top-0 w-full z-[90] border-b border-slate-200 dark:border-white/5 backdrop-blur-xl bg-white/70 dark:bg-[#020617]/70 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Zap className="text-white w-6 h-6 relative z-10" fill="currentColor" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                  Nexus<span className="text-indigo-600 dark:text-indigo-500">Core</span>
                </span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <a href="#monitor" className="hover:text-indigo-600 dark:hover:text-white transition-colors">System</a>
                <a href="#capabilities" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Modules</a>
                <a href="#ecosystem" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Ecosystem</a>
                <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Access</a>
                <ThemeToggle />
              </div>

              <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="hidden md:block bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-xl"
                >
                    Initialize
                </button>
                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 rounded-lg bg-slate-200 dark:bg-white/10"
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </nav>

          {/* MOBILE MENU OVERLAY */}
          <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 z-[80] bg-white dark:bg-[#020617] pt-32 px-6 lg:hidden"
                >
                    <div className="flex flex-col gap-6 text-2xl font-black uppercase italic text-slate-900 dark:text-white">
                        <a onClick={() => setIsMobileMenuOpen(false)} href="#monitor">System Status</a>
                        <a onClick={() => setIsMobileMenuOpen(false)} href="#capabilities">Capabilities</a>
                        <a onClick={() => setIsMobileMenuOpen(false)} href="#pricing">Pricing</a>
                        <div className="flex gap-4 mt-8">
                            <ThemeToggle />
                            <span className="text-sm font-sans font-normal opacity-50">Toggle Theme</span>
                        </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* HERO SECTION */}
          <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-screen flex items-center">
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 z-0 opacity-30 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  System Status: Online v2.4
                </div>
                <h1 className="text-6xl md:text-9xl font-black leading-[0.85] mb-8 italic tracking-tighter text-slate-900 dark:text-white">
                  <GlitchText text="AUTOMATE" /> <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 animate-gradient-x">
                    EVERYTHING.
                  </span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-lg leading-relaxed font-medium">
                  We replace manual chaos with intelligent, self-healing AI architectures. The future isn't coming—it's running on our servers.
                </p>
                <div className="flex flex-wrap gap-6">
                  <button onClick={() => setIsModalOpen(true)} className="group relative bg-indigo-600 px-10 py-5 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-105 shadow-2xl shadow-indigo-600/30">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="flex items-center gap-3"><Rocket className="w-5 h-5" /> Deploy System</span>
                  </button>
                  <button className="border border-slate-300 dark:border-white/10 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-900 dark:text-white flex items-center gap-3">
                    View Demo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* ROTATING 3D ORBITAL */}
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="relative hidden lg:flex justify-center perspective-1000">
                <div className="relative w-[600px] h-[600px] transform-style-3d">
                    <motion.div style={{ rotate }} className="absolute inset-0 border border-slate-300 dark:border-white/5 rounded-full border-dashed" />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute inset-12 border border-indigo-500/20 rounded-full border-dotted" />
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-24 border-2 border-indigo-500/10 rounded-full border-dashed" />
                    
                    {/* Icons */}
                    <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 left-1/2 -translate-x-1/2 bg-white dark:bg-[#020617] p-4 border border-indigo-500 rounded-2xl z-20 shadow-xl">
                        <Database className="text-indigo-500 dark:text-indigo-400 w-8 h-8" />
                    </motion.div>
                    <motion.div animate={{ x: [-15, 15, -15] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-24 left-10 bg-white dark:bg-[#020617] p-4 border border-purple-500 rounded-2xl z-20 shadow-xl">
                        <Lock className="text-purple-500 dark:text-purple-400 w-8 h-8" />
                    </motion.div>
                    <motion.div animate={{ y: [15, -15, 15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-24 right-10 bg-white dark:bg-[#020617] p-4 border border-blue-500 rounded-2xl z-20 shadow-xl">
                        <Code2 className="text-blue-500 dark:text-blue-400 w-8 h-8" />
                    </motion.div>

                    {/* Core */}
                    <div className="absolute inset-0 m-auto w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute inset-0 m-auto w-32 h-32 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-2xl z-10">
                        <Brain className="w-16 h-16 text-indigo-600 dark:text-white" />
                    </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* MARQUEE */}
          <section className="py-10 border-y border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/20 overflow-hidden backdrop-blur-sm">
            <div className="flex gap-20 animate-scroll whitespace-nowrap opacity-50">
                {[...Array(4)].map((_, i) => (
                    <React.Fragment key={i}>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-slate-800">OPENAI</span>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-slate-800">NEXT.JS</span>
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-slate-800">PYTHON</span>
                    </React.Fragment>
                ))}
            </div>
          </section>

          {/* LIVE SYSTEM MONITOR */}
          <section id="monitor" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Live Neural Network</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl">Real-time processing across our client nodes.</p>
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-mono text-xs bg-green-100 dark:bg-green-400/5 px-4 py-2 rounded-full border border-green-200 dark:border-green-400/20">
                    <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                    SYSTEM OPTIMAL
                </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                {/* Visualizer Card */}
                <div className="p-10 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-xl shadow-indigo-500/5">
                    <div className="flex justify-between items-center mb-12">
                        <ServerIcon className="text-indigo-500 w-8 h-8" />
                        <span className="text-xs font-mono text-slate-500">CPU-CORE-01</span>
                    </div>
                    <div className="flex items-end gap-1.5 h-40 mb-6">
                        {randomData.map((h, i) => (
                        <motion.div 
                        key={i} 
                        animate={{ height: `${h}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm opacity-80" 
                        />
                        ))}
                    </div>
                    <div className="text-3xl font-mono text-slate-900 dark:text-white tracking-tighter">42.8 TB <span className="text-slate-400 text-sm block font-sans font-bold tracking-widest mt-1">DATA PROCESSED</span></div>
                </div>

                {/* Active Agents Card */}
                <div className="p-10 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-xl shadow-purple-500/5">
                    <div className="flex justify-between items-center mb-8">
                        <Activity className="text-purple-500 w-8 h-8" />
                        <span className="text-xs font-mono text-slate-500">AGENTS-LIVE</span>
                    </div>
                    <div className="relative w-full h-40 flex items-center justify-center mb-4">
                        <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
                        <div className="text-7xl font-black text-slate-900 dark:text-white z-10 tracking-tighter">842</div>
                    </div>
                    <div className="text-center font-mono text-purple-500 dark:text-purple-400 text-sm">ACTIVE BOTS DEPLOYED</div>
                </div>

                    {/* Terminal Card */}
                    <div className="p-10 rounded-[40px] bg-slate-950 border border-slate-800 dark:border-white/5 relative overflow-hidden font-mono text-xs text-green-400 group">
                    <div className="flex justify-between items-center mb-8">
                        <Command className="text-green-500 w-8 h-8" />
                        <span className="text-slate-500">TERMINAL.EXE</span>
                    </div>
                    <div className="space-y-3 opacity-90">
                        <p>&gt; Initializing Neural Core...</p>
                        <p>&gt; Handshake established (12ms)</p>
                        <p className="text-white">&gt; Encryption: AES-256 [SECURE]</p>
                        <p>&gt; Client_ID_402: Lead Captured</p>
                        <p>&gt; Client_ID_899: Email Sent</p>
                        <p className="animate-pulse">&gt; Awaiting command_</p>
                    </div>
                </div>
                </div>
            </div>
          </section>

          {/* NEW: THE ECOSYSTEM GRID */}
          <section id="ecosystem" className="py-20 px-6 bg-slate-100 dark:bg-slate-900/20">
            <div className="max-w-7xl mx-auto text-center mb-16">
                 <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">The Ecosystem</h2>
                 <p className="text-slate-500 dark:text-slate-400">Our stack powers the world's most advanced agents.</p>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Python', 'React', 'TypeScript', 'Tailwind', 'OpenAI', 'Pinecone', 'Stripe', 'Supabase'].map((tech, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 flex items-center justify-center gap-3 font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-500 transition-colors cursor-default">
                        <Cpu className="w-5 h-5" /> {tech}
                    </div>
                ))}
            </div>
          </section>

          {/* HOLOGRAPHIC TABS SECTION (UPDATED WITH 5 TABS) */}
          <section id="capabilities" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Modular Capabilities</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {['marketing', 'operations', 'support', 'sales', 'engineering'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all ${
                        activeTab === tab 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                        : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                        }`}
                    >
                        {tab}
                    </button>
                    ))}
                </div>
                </div>

                <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'marketing' && (
                    <motion.div 
                        key="marketing"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-indigo-900/40 dark:to-slate-900 border border-slate-200 dark:border-indigo-500/30 relative overflow-hidden shadow-2xl shadow-indigo-500/10">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Content Engine</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">Autonomous content generation that mimics your brand voice perfectly.</p>
                        <ul className="space-y-3 text-indigo-600 dark:text-indigo-200 font-medium">
                            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> SEO Optimization</li>
                            <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> Multi-Language Support</li>
                        </ul>
                        </div>
                        <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-xl">
                            <div className="text-center">
                                <Globe className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                                <div className="text-4xl font-black text-slate-900 dark:text-white">GLOBAL</div>
                                <div className="text-slate-500 uppercase tracking-widest text-sm">Reach</div>
                            </div>
                        </div>
                    </motion.div>
                    )}

                    {activeTab === 'operations' && (
                        <motion.div 
                          key="operations"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                          className="grid md:grid-cols-2 gap-8"
                        >
                          <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-purple-900/40 dark:to-slate-900 border border-slate-200 dark:border-purple-500/30 relative overflow-hidden shadow-2xl">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Data Pipelines</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">Connect your CRM, ERP, and databases into a single source of truth.</p>
                            <ul className="space-y-3 text-purple-600 dark:text-purple-200 font-medium">
                              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> Auto-Invoicing</li>
                              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> Real-time Analytics</li>
                            </ul>
                          </div>
                           <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-xl">
                            <div className="text-center">
                               <div className="text-6xl font-black text-slate-900 dark:text-white mb-2">20hr</div>
                               <div className="text-slate-500 uppercase tracking-widest text-sm">Saved Per Week</div>
                            </div>
                          </div>
                        </motion.div>
                    )}

                    {activeTab === 'support' && (
                        <motion.div 
                          key="support"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                          className="grid md:grid-cols-2 gap-8"
                        >
                          <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-blue-900/40 dark:to-slate-900 border border-slate-200 dark:border-blue-500/30 relative overflow-hidden shadow-2xl">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Support 24/7</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">AI Agents that resolve 80% of tickets instantly.</p>
                            <ul className="space-y-3 text-blue-600 dark:text-blue-200 font-medium">
                              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> Sentiment Analysis</li>
                              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> Instant Refunds</li>
                            </ul>
                          </div>
                           <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-xl">
                            <div className="text-center">
                               <MessageSquare className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                               <div className="text-4xl font-black text-slate-900 dark:text-white">INSTANT</div>
                               <div className="text-slate-500 uppercase tracking-widest text-sm">Replies</div>
                            </div>
                          </div>
                        </motion.div>
                    )}

                    {activeTab === 'sales' && (
                        <motion.div 
                          key="sales"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                          className="grid md:grid-cols-2 gap-8"
                        >
                          <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-green-900/40 dark:to-slate-900 border border-slate-200 dark:border-green-500/30 relative overflow-hidden shadow-2xl">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Sales Outreach</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">Cold email and LinkedIn bots that book meetings while you sleep.</p>
                            <ul className="space-y-3 text-green-600 dark:text-green-200 font-medium">
                              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> Lead Enrichment</li>
                              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> Auto-Followups</li>
                            </ul>
                          </div>
                           <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-xl">
                            <div className="text-center">
                               <Share2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                               <div className="text-4xl font-black text-slate-900 dark:text-white">10x</div>
                               <div className="text-slate-500 uppercase tracking-widest text-sm">Pipeline Growth</div>
                            </div>
                          </div>
                        </motion.div>
                    )}

                    {activeTab === 'engineering' && (
                        <motion.div 
                          key="engineering"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                          className="grid md:grid-cols-2 gap-8"
                        >
                          <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-orange-900/40 dark:to-slate-900 border border-slate-200 dark:border-orange-500/30 relative overflow-hidden shadow-2xl">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Code Generation</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">Agents that write, test, and deploy code for rapid prototyping.</p>
                            <ul className="space-y-3 text-orange-600 dark:text-orange-200 font-medium">
                              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> Unit Testing</li>
                              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5" /> Documentation</li>
                            </ul>
                          </div>
                           <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-xl">
                            <div className="text-center">
                               <Terminal className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                               <div className="text-4xl font-black text-slate-900 dark:text-white">CLEAN</div>
                               <div className="text-slate-500 uppercase tracking-widest text-sm">Architecture</div>
                            </div>
                          </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing" className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Investment Plans</h2>
                </div>
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Standard */}
                <TiltCard className="p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 shadow-xl">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Starter</h3>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-8">$1,500</div>
                    <ul className="space-y-4 text-slate-500 dark:text-slate-400 mb-8">
                        <li>• 1 Custom Automation</li>
                        <li>• Weekly Maintenance</li>
                        <li>• Email Support</li>
                    </ul>
                    <button className="w-full py-4 rounded-xl border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Select</button>
                </TiltCard>

                {/* Premium */}
                <TiltCard className="p-10 rounded-[40px] border border-indigo-500 bg-slate-900 dark:bg-[#0B0F19] relative shadow-2xl shadow-indigo-900/20 transform scale-105 z-10">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-sm tracking-widest uppercase shadow-lg">Most Popular</div>
                    <h3 className="text-3xl font-bold text-white mb-4 italic">Growth Core</h3>
                    <div className="text-6xl font-black text-white mb-2">$3,500</div>
                    <div className="text-slate-500 mb-10 text-sm uppercase font-bold">Per Month</div>
                    <ul className="space-y-5 text-indigo-100 mb-10 font-medium">
                        <li className="flex gap-3"><CheckCircle2 className="text-indigo-500" /> 5 Automations</li>
                        <li className="flex gap-3"><CheckCircle2 className="text-indigo-500" /> Custom LLM</li>
                        <li className="flex gap-3"><CheckCircle2 className="text-indigo-500" /> 24/7 Support</li>
                    </ul>
                    <button className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25">Start Growth Core</button>
                </TiltCard>

                {/* Enterprise */}
                <TiltCard className="p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 shadow-xl">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Enterprise</h3>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-8">Custom</div>
                    <ul className="space-y-4 text-slate-500 dark:text-slate-400 mb-8">
                        <li>• Unlimited Agents</li>
                        <li>• Dedicated Engineer</li>
                        <li>• On-Premise Setup</li>
                    </ul>
                    <button className="w-full py-4 rounded-xl border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Contact Us</button>
                </TiltCard>
                </div>
            </div>
          </section>

          {/* FINAL CTA PORTAL */}
          <section className="py-48 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-900/20" />
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/30 blur-[120px] rounded-full -z-10 animate-pulse" />
              <h2 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white mb-8 italic tracking-tighter dark:mix-blend-overlay">
                READY TO <br /> EVOLVE?
              </h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-900 dark:bg-white text-white dark:text-black px-16 py-8 rounded-full font-black text-2xl hover:scale-105 transition-transform shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:shadow-[0_0_100px_rgba(255,255,255,0.5)]"
              >
                Start Transformation
              </button>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-20 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#020617] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
               <div className="text-4xl font-black text-slate-900 dark:text-white mb-8 italic tracking-tighter uppercase">Nexus<span className="text-indigo-600 dark:text-indigo-500">Core</span></div>
               <div className="flex justify-center gap-8 mb-12 text-slate-500 font-bold uppercase tracking-widest text-xs">
                 <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Privacy</a>
                 <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Terms</a>
                 <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Twitter</a>
                 <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">LinkedIn</a>
               </div>
               <p className="text-slate-500 dark:text-slate-600 text-[10px] font-mono uppercase tracking-[0.2em]">
                 System Version 2.4 // Status: Operational // © 2026
               </p>
            </div>
          </footer>

          {/* CONTACT MODAL (Now triggered by buttons) */}
          <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </motion.div>
    </div>
  );
}