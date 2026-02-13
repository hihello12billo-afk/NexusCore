"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Code2, Terminal, Cpu, Gamepad2, Shield } from 'lucide-react';

// --- PROJECT DATA (Edit this with your real projects!) ---
const projects = [
  {
    id: 1,
    title: "Sentinal AI Security",
    category: "Cybersecurity",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
    tech: ["Python", "Cryptography", "React"],
    desc: "A pro-grade security dashboard for recovering compromised social accounts using AI pattern recognition."
  },
  {
    id: 2,
    title: "Luxe E-Commerce",
    category: "Web Dev",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tech: ["Next.js", "Stripe", "Tailwind"],
    desc: "High-performance luxury retail platform with 3D product previews and AI-driven recommendations."
  },
  {
    id: 3,
    title: "Nebula RPG Engine",
    category: "Game Dev",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800",
    tech: ["Lua", "Roblox Studio", "C++"],
    desc: "A custom physics engine built for open-world exploration games, featuring real-time multiplayer syncing."
  },
  {
    id: 4,
    title: "Nexus Automation",
    category: "AI Agents",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800",
    tech: ["OpenAI API", "Python", "Pinecone"],
    desc: "Autonomous email sorting and lead qualification bot that saves agencies 20+ hours per week."
  },
];

const categories = ["All", "Web Dev", "AI Agents", "Game Dev", "Cybersecurity"];

export default function WorkPage() {
  const [filter, setFilter] = useState("All");

  const filteredProjects = projects.filter(p => filter === "All" || p.category === filter);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500 font-sans">
      {/* Background Noise */}
      <div className="fixed inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-md bg-[#020617]/80">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-white transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </a>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
            Nexus<span className="text-indigo-500">Work</span>
          </span>
        </div>
      </nav>

      {/* HEADER */}
      <section className="pt-48 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-8xl font-black mb-8 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800">
              SELECTED <br /> MISSIONS.
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              A collection of high-performance systems deployed across the digital frontier.
            </p>
          </motion.div>

          {/* FILTER TABS */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs border transition-all ${
                  filter === cat 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                  : 'bg-transparent border-white/10 text-slate-500 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECT GRID */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-[40px] overflow-hidden bg-slate-900 border border-white/5 hover:border-indigo-500/50 transition-all"
              >
                {/* Image Overlay */}
                <div className="aspect-video overflow-hidden relative">
                   <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-transparent transition-colors z-10" />
                   <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                   />
                </div>

                {/* Content */}
                <div className="p-8 relative z-20 bg-[#020617]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-indigo-500 font-bold text-xs uppercase tracking-widest mb-2 block">{project.category}</span>
                      <h3 className="text-3xl font-bold text-white mb-2">{project.title}</h3>
                    </div>
                    <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-white">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  
                  <p className="text-slate-400 mb-6">{project.desc}</p>
                  
                  <div className="flex gap-3">
                    {project.tech.map((t, i) => (
                      <span key={i} className="px-3 py-1 rounded-md bg-white/5 text-slate-300 text-xs font-mono border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center relative z-10">
        <h2 className="text-4xl font-bold text-white mb-8">Ready to start your mission?</h2>
        <a href="/" className="inline-block bg-white text-black px-12 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform">
          Initiate Protocol
        </a>
      </section>
    </div>
  );
}