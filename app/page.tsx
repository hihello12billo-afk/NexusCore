"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Command,
  Cpu,
  Database,
  Globe,
  Lock,
  Menu,
  MessageSquare,
  Moon,
  Rocket,
  Send,
  Server as ServerIcon,
  Share2,
  Sun,
  Terminal,
  X,
  Zap,
  Sparkles,
  Shield,
  Layers,
  Gauge,
  Stars,
  Search,
  ChevronDown,
} from "lucide-react";
import ContactModal from "@/components/ContactModal";

/* -------------------------------------------
   NEW: Neon Particle Network Background
-------------------------------------------- */
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number; // alpha
};

const NeonParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    const MAX = 90;
    const LINK_DIST = 120;
    const MOUSE_PULL = 0.03;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dprRef.current = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(rect.width * dprRef.current);
      canvas.height = Math.floor(rect.height * dprRef.current);
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

      // reset particles on resize (prevents weird stretching)
      particles.length = 0;
      for (let i = 0; i < MAX; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: 1.2 + Math.random() * 1.6,
          a: 0.12 + Math.random() * 0.25,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // subtle vignette haze
      const g = ctx.createRadialGradient(
        rect.width * 0.55,
        rect.height * 0.3,
        40,
        rect.width * 0.55,
        rect.height * 0.3,
        rect.width * 0.9
      );
      g.addColorStop(0, "rgba(99,102,241,0.10)");
      g.addColorStop(0.45, "rgba(168,85,247,0.06)");
      g.addColorStop(1, "rgba(2,6,23,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // animate particles
      for (const p of particles) {
        // mouse pull
        const dxm = mouse.current.x - p.x;
        const dym = mouse.current.y - p.y;
        const distm = Math.hypot(dxm, dym);

        if (distm < 240) {
          p.vx += dxm * MOUSE_PULL * 0.0008;
          p.vy += dym * MOUSE_PULL * 0.0008;
        }

        p.x += p.vx;
        p.y += p.vy;

        // boundary wrap
        if (p.x < -20) p.x = rect.width + 20;
        if (p.x > rect.width + 20) p.x = -20;
        if (p.y < -20) p.y = rect.height + 20;
        if (p.y > rect.height + 20) p.y = -20;
      }

      // lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const t = 1 - d / LINK_DIST;
            ctx.strokeStyle = `rgba(99,102,241,${0.06 + t * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // dots
      for (const p of particles) {
        ctx.fillStyle = `rgba(167,139,250,${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[0]">
      <canvas ref={canvasRef} className="h-full w-full opacity-60 dark:opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_20%,rgba(99,102,241,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_80%,rgba(168,85,247,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
    </div>
  );
};

/* -------------------------------------------
   Existing Spotlight (kept)
-------------------------------------------- */
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
        background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.16), transparent 75%)`,
      }}
    />
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

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
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-indigo-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-75">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-purple-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-75 delay-75">
        {text}
      </span>
    </div>
  );
};

/* -------------------------------------------
   NEW: ScrollSpy + Active Section Indicator
-------------------------------------------- */
const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState(ids[0] || "hero");

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // pick the most visible intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, threshold: [0.18, 0.25, 0.35, 0.5] }
    );

    for (const el of els) obs.observe(el);
    return () => obs.disconnect();
  }, [ids]);

  return active;
};

const NavPill = ({
  label,
  href,
  active,
  onClick,
}: {
  label: string;
  href: string;
  active: boolean;
  onClick?: () => void;
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.18em] transition-all ${
        active
          ? "text-white"
          : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white"
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 shadow-[0_0_30px_rgba(99,102,241,0.35)]"
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </a>
  );
};

/* -------------------------------------------
   Preloader (kept)
-------------------------------------------- */
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("INITIALIZING CORE...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 18);

    const texts = ["LOADING NEURAL NET...", "CONNECTING NODES...", "DECRYPTING KEYS...", "SYSTEM READY"];
    let i = 0;
    const textTimer = setInterval(() => {
      if (i < texts.length) setText(texts[i++]);
    }, 420);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) setTimeout(onComplete, 500);
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#020617] w-screen h-screen flex flex-col items-center justify-center font-mono"
    >
      <div className="flex flex-col items-center">
        <div className="w-72 mb-4 text-xs text-indigo-300 flex justify-between">
          <span>{text}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-72 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-6 text-[10px] tracking-[0.35em] text-slate-500 uppercase">
          Neural shimmer engaged
        </div>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------
   Tilt Card (kept)
-------------------------------------------- */
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [18, -18]);
  const rotateY = useTransform(x, [-100, 100], [-18, 18]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragElastic={0.14}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      whileHover={{ cursor: "grabbing" }}
      className={`transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* -------------------------------------------
   Theme Toggle (kept, polished)
-------------------------------------------- */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative p-2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white transition-transform hover:scale-110"
      aria-label="Toggle Theme"
    >
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.35),transparent_60%)]" />
      <span className="relative z-10">{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</span>
    </button>
  );
};

/* -------------------------------------------
   NEW: Animated Counter
-------------------------------------------- */
const AnimatedNumber = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number | null = null;
    const start = performance.now();
    const from = 0;
    const to = value;
    const dur = 900;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const n = Math.floor(from + (to - from) * eased);
      setDisplay(n);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
};

/* -------------------------------------------
   NEW: Command Palette (Ctrl/⌘ K)
-------------------------------------------- */
type PaletteAction = {
  label: string;
  hint?: string;
  onRun: () => void;
  icon?: React.ReactNode;
};

const CommandPalette = ({
  isOpen,
  onClose,
  actions,
}: {
  isOpen: boolean;
  onClose: () => void;
  actions: PaletteAction[];
}) => {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [isOpen]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(s) || (a.hint || "").toLowerCase().includes(s));
  }, [q, actions]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[160] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(99,102,241,0.18)] overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Search className="w-5 h-5 text-indigo-300" />
              </div>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type to jump… (e.g. pricing, cases, faq)"
                className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 text-sm"
              />
              <kbd className="text-[10px] text-slate-400 border border-white/10 rounded-lg px-2 py-1">ESC</kbd>
            </div>

            <div className="p-2 max-h-[380px] overflow-y-auto custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="p-6 text-sm text-slate-400">No matches.</div>
              ) : (
                filtered.map((a, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      a.onRun();
                      onClose();
                    }}
                    className="w-full text-left flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {a.icon ?? <Sparkles className="w-4 h-4 text-indigo-300" />}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{a.label}</div>
                        {a.hint && <div className="text-[11px] text-slate-400">{a.hint}</div>}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-600 -rotate-90" />
                  </button>
                ))
              )}
            </div>

            <div className="p-3 border-t border-white/10 text-[10px] tracking-[0.25em] uppercase text-slate-500">
              Tip: Press <span className="text-indigo-300">Ctrl/⌘</span> + <span className="text-indigo-300">K</span> anytime
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* -------------------------------------------
   Upgraded AI Chat Assistant (chips + polish)
-------------------------------------------- */
const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Neural link established. I am the NexusCore Assistant. What should we automate today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const getAIResponse = (input: string) => {
    const lowInput = input.toLowerCase().trim();

    if (["hi", "hello", "hey"].includes(lowInput)) {
      return "Greetings. Systems are stable. Tell me what you want to automate (sales, support, operations, or engineering).";
    }
    if (lowInput.includes("price") || lowInput.includes("cost")) {
      return "Pricing is modular. Starter begins at $1,500. Growth Core is $3,500/mo. Enterprise is custom. Want me to recommend the best plan for your goal?";
    }
    if (lowInput.includes("chatbot") || lowInput.includes("agent")) {
      return "We build self-healing agents (RAG + tools + monitoring). They can handle support, lead capture, qualification, and follow-ups—continuously improving.";
    }
    if (lowInput.includes("stack") || lowInput.includes("tech") || lowInput.includes("python")) {
      return "Stack: Next.js + Tailwind + Framer Motion for UI, Python for automation, and OpenAI-based reasoning with vector search (Supabase/Pinecone).";
    }
    if (lowInput.includes("book") || lowInput.includes("call") || lowInput.includes("talk")) {
      return "Perfect. Click “Initialize” and our engineering team will respond fast with architecture options and timeline.";
    }

    const fallbacks = [
      `Processing "${input}"… I can propose a workflow + components + integration plan. What’s your industry?`,
      `Nice. For "${input}", a modular agent system is best. Want a quick blueprint (data → actions → monitoring)?`,
      `Understood. I flagged "${input}" for optimization. Click Initialize and we’ll map the system together.`,
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const quickChips = [
    "Pricing",
    "Build a chatbot",
    "Automate outreach",
    "Connect CRM + support",
    "Tech stack",
  ];

  const send = (text: string) => {
    const userMessage = text.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = getAIResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    }, 900);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    send(inputValue);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 18 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="mb-4 w-80 md:w-96 h-[540px] bg-white/10 dark:bg-slate-950/75 backdrop-blur-2xl rounded-3xl border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.18)] flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-white" />
                <span className="text-white font-black tracking-widest uppercase text-[10px]">NexusCore Intelligence</span>
                <span className="ml-2 w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-white/10 bg-black/10">
              <div className="flex flex-wrap gap-2">
                {quickChips.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    className="text-[10px] px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:border-indigo-400/40 hover:bg-indigo-500/10 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20 shadow-lg"
                        : "bg-slate-100/80 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none border border-white/5 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 animate-pulse text-[10px] text-indigo-300 font-mono">
                    ANALYZING PROTOCOLS...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-2 bg-black/10">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a command..."
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 rounded-xl text-white hover:scale-105 transition-transform shadow-[0_0_25px_rgba(99,102,241,0.35)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-600/30 border border-white/20 relative group"
        aria-label="Open AI Assistant"
      >
        <div className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20 group-hover:hidden" />
        <div className="absolute -inset-1 rounded-full blur-xl bg-indigo-600/25 opacity-60 group-hover:opacity-90 transition-opacity" />
        {isOpen ? <X className="text-white relative z-10" /> : <MessageSquare className="text-white relative z-10" />}
      </motion.button>
    </div>
  );
};

/* -------------------------------------------
   NEW: FAQ
-------------------------------------------- */
const FAQ = () => {
  const items = [
    {
      q: "How fast can we deploy?",
      a: "Starter systems ship in days. Growth Core builds in 2–3 weeks depending on integrations. Enterprise is custom.",
    },
    {
      q: "Do your agents use my data securely?",
      a: "Yes. We design least-privilege access, encryption, audit logs, and scoped retrieval (RAG) so models only see what they need.",
    },
    {
      q: "What can you integrate with?",
      a: "CRMs, helpdesks, inboxes, Slack/Teams, databases, Stripe, calendars, and any API you can expose securely.",
    },
    {
      q: "Can you monitor and improve over time?",
      a: "That’s the point: live metrics, evals, tracing, and self-healing automations with guardrails.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <button
            key={i}
            onClick={() => setOpen(isOpen ? null : i)}
            className="text-left p-7 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl hover:border-indigo-500/40 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="font-black text-slate-900 dark:text-white">{it.q}</div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{it.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
};

/* -------------------------------------------
   NEW: Testimonials
-------------------------------------------- */
const Testimonials = () => {
  const quotes = [
    {
      name: "Ops Director",
      role: "Logistics",
      text: "We cut manual work by 70% in two weeks. The dashboards + self-healing flows are unreal.",
    },
    {
      name: "Head of Sales",
      role: "B2B SaaS",
      text: "Outbound doubled and meetings tripled. The follow-up agent never forgets and never sleeps.",
    },
    {
      name: "Support Lead",
      role: "E-commerce",
      text: "Ticket deflection jumped instantly. Refund workflows became safe + automatic with guardrails.",
    },
  ];

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % quotes.length), 4200);
    return () => clearInterval(t);
  }, [quotes.length]);

  const q = quotes[idx];

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[44px] bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.24),transparent_60%)] blur-2xl" />
      <div className="relative p-10 rounded-[44px] border border-indigo-500/25 bg-slate-950/60 backdrop-blur-2xl shadow-[0_0_70px_rgba(99,102,241,0.12)] overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            <div className="text-indigo-200 text-sm font-mono tracking-[0.25em] uppercase mb-6">
              Signal from the field
            </div>
            <div className="text-2xl md:text-3xl font-black text-white leading-tight">
              “{q.text}”
            </div>
            <div className="mt-8 flex items-center justify-between gap-6">
              <div>
                <div className="text-white font-black">{q.name}</div>
                <div className="text-slate-400 text-sm">{q.role}</div>
              </div>
              <div className="flex gap-2">
                {quotes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === idx ? "bg-indigo-400 shadow-[0_0_18px_rgba(99,102,241,0.6)] scale-110" : "bg-white/20"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* -------------------------------------------
   MAIN PAGE
-------------------------------------------- */
export default function LandingPage() {
  const [isChecking, setIsChecking] = useState(true);
  const [showPreloader, setShowPreloader] = useState(false);

  const [activeTab, setActiveTab] = useState("marketing");
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const [randomData, setRandomData] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NEW: Pricing toggle
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  // NEW: Command palette
  const [paletteOpen, setPaletteOpen] = useState(false);

  const sectionIds = useMemo(
    () => ["hero", "monitor", "ecosystem", "how", "capabilities", "cases", "testimonials", "pricing", "faq"],

    []
  );
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem("nexus_last_visit");
    setShowPreloader(lastVisitDate !== today);
    setIsChecking(false);
  }, []);

  const handleLoaderComplete = () => {
    setShowPreloader(false);
    localStorage.setItem("nexus_last_visit", new Date().toDateString());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomData(Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Command palette hotkeys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      const isEsc = e.key === "Escape";
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (isEsc) setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const paletteActions: PaletteAction[] = useMemo(
    () => [
      { label: "Jump: System Monitor", hint: "#monitor", onRun: () => jump("monitor"), icon: <Gauge className="w-4 h-4 text-indigo-300" /> },
      { label: "Jump: Modules", hint: "#capabilities", onRun: () => jump("capabilities"), icon: <Layers className="w-4 h-4 text-indigo-300" /> },
      { label: "Jump: Ecosystem", hint: "#ecosystem", onRun: () => jump("ecosystem"), icon: <Cpu className="w-4 h-4 text-indigo-300" /> },
      { label: "Jump: Use Cases", hint: "#cases", onRun: () => jump("cases"), icon: <Stars className="w-4 h-4 text-indigo-300" /> },
      { label: "Jump: Testimonials", hint: "#testimonials", onRun: () => jump("testimonials"), icon: <Sparkles className="w-4 h-4 text-indigo-300" /> },
      { label: "Jump: Pricing", hint: "#pricing", onRun: () => jump("pricing"), icon: <Zap className="w-4 h-4 text-indigo-300" /> },
      { label: "Jump: FAQ", hint: "#faq", onRun: () => jump("faq"), icon: <Shield className="w-4 h-4 text-indigo-300" /> },
      { label: "Action: Initialize / Contact", hint: "Open modal", onRun: () => setIsModalOpen(true), icon: <Rocket className="w-4 h-4 text-indigo-300" /> },
      {
        label: `Action: Billing (${billing === "monthly" ? "Switch to annual" : "Switch to monthly"})`,
        hint: "Pricing toggle",
        onRun: () => setBilling((b) => (b === "monthly" ? "annual" : "monthly")),
        icon: <Zap className="w-4 h-4 text-indigo-300" />,
      },
    ],
    [billing]
  );

  const price = useMemo(() => {
    // simple values just for display
    const starter = billing === "monthly" ? 1500 : 1500 * 10; // annual “deal”
    const growth = billing === "monthly" ? 3500 : 3500 * 10;
    return { starter, growth };
  }, [billing]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 selection:bg-indigo-500 font-sans overflow-x-hidden transition-colors duration-300">
      {/* Global animations for glow/shimmer/gradient */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 6s ease-in-out infinite; }

        @keyframes scrollMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scrollMarquee 28s linear infinite; }

        @keyframes shimmer { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>

      {isChecking && <div className="fixed inset-0 z-[300] bg-[#020617]" />}

      <AnimatePresence>{!isChecking && showPreloader && <Preloader onComplete={handleLoaderComplete} />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isChecking || showPreloader ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Spotlight />
        <ScrollProgress />

        {/* NEW: Command Palette */}
        <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} actions={paletteActions} />

        <nav className="fixed top-0 w-full z-[90] border-b border-slate-200 dark:border-white/5 backdrop-blur-xl bg-white/70 dark:bg-[#020617]/70 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Zap className="text-white w-6 h-6 relative z-10" fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                Nexus<span className="text-indigo-600 dark:text-indigo-500">Core</span>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <NavPill label="System" href="#monitor" active={activeSection === "monitor"} />
                <NavPill label="Modules" href="#capabilities" active={activeSection === "capabilities"} />
                <NavPill label="Ecosystem" href="#ecosystem" active={activeSection === "ecosystem"} />
                <NavPill label="Cases" href="#cases" active={activeSection === "cases"} />
                <NavPill label="Proof" href="#testimonials" active={activeSection === "testimonials"} />
                <NavPill label="Access" href="#pricing" active={activeSection === "pricing"} />
                <NavPill label="FAQ" href="#faq" active={activeSection === "faq"} />
                <NavPill label="How" href="#how" active={activeSection === "how"} />

              </div>

              <div className="ml-3 flex items-center gap-3">
                <button
                  onClick={() => setPaletteOpen(true)}
                  className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-indigo-400/40 transition-colors text-xs font-bold"
                >
                  <Command className="w-4 h-4" />
                  <span>Command</span>
                  <kbd className="ml-1 text-[10px] opacity-70 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1">
                    Ctrl K
                  </kbd>
                </button>
                <ThemeToggle />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden md:block bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-black hover:scale-105 transition-all shadow-xl"
              >
                Initialize
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-200 dark:bg-white/10"
                aria-label="Open menu"
              >
                <a onClick={() => setIsMobileMenuOpen(false)} href="#how">How it works</a>

                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-[80] bg-white dark:bg-[#020617] pt-32 px-6 lg:hidden"
            >
              <div className="flex flex-col gap-6 text-2xl font-black uppercase italic text-slate-900 dark:text-white">
                <a onClick={() => setIsMobileMenuOpen(false)} href="#monitor">
                  System Status
                </a>
                <a onClick={() => setIsMobileMenuOpen(false)} href="#capabilities">
                  Modules
                </a>
                <a onClick={() => setIsMobileMenuOpen(false)} href="#ecosystem">
                  Ecosystem
                </a>
                <a onClick={() => setIsMobileMenuOpen(false)} href="#cases">
                  Use Cases
                </a>
                <a onClick={() => setIsMobileMenuOpen(false)} href="#pricing">
                  Pricing
                </a>
                <a onClick={() => setIsMobileMenuOpen(false)} href="#faq">
                  FAQ
                </a>
                <div className="flex gap-4 mt-8 items-center">
                  <ThemeToggle />
                  <button
                    onClick={() => setPaletteOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-sm font-bold"
                  >
                    <Command className="w-4 h-4" /> Command
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO */}
        <section id="hero" className="relative pt-48 pb-32 px-6 overflow-hidden min-h-screen flex items-center">
          <NeonParticleNetwork />

          <div className="absolute inset-0 z-0 opacity-30 dark:opacity-100 transition-opacity duration-500">
            <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-200 text-xs font-black uppercase tracking-[0.2em] mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                System Status: Online v3.0
              </div>

              <h1 className="text-6xl md:text-9xl font-black leading-[0.85] mb-8 italic tracking-tighter text-slate-900 dark:text-white">
                <GlitchText text="AUTOMATE" /> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-300 dark:via-purple-300 dark:to-indigo-300 animate-gradient-x">
                  EVERYTHING.
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed font-medium">
                Replace manual chaos with intelligent, self-healing AI architectures — tracked, monitored, and optimized in real time.
              </p>

              <div className="flex flex-wrap gap-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative bg-indigo-600 px-10 py-5 rounded-2xl font-black text-lg text-white overflow-hidden transition-all hover:scale-105 shadow-2xl shadow-indigo-600/30"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-[shimmer_1.4s_infinite]" />
                  <span className="relative z-10 flex items-center gap-3">
                    <Rocket className="w-5 h-5" /> Deploy System
                  </span>
                </button>

                <button
                  onClick={() => setPaletteOpen(true)}
                  className="border border-slate-300 dark:border-white/10 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-900 dark:text-white flex items-center gap-3"
                >
                  Open Command <Command className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
                <div className="p-5 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">Bots Live</div>
                  <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    <AnimatedNumber value={842} />
                  </div>
                </div>
                <div className="p-5 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">Tickets Saved</div>
                  <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    <AnimatedNumber value={12840} />
                  </div>
                </div>
                <div className="p-5 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">Latency</div>
                  <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">12ms</div>
                </div>
              </div>
            </div>

            {/* Orb Visual */}
            <div className="relative hidden lg:flex justify-center">
              <div className="relative w-[620px] h-[620px]">
                <motion.div style={{ rotate }} className="absolute inset-0 border border-slate-300 dark:border-white/5 rounded-full border-dashed" />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-12 border border-indigo-500/20 rounded-full border-dotted"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-24 border-2 border-indigo-500/10 rounded-full border-dashed"
                />

                <motion.div
                  animate={{ y: [-12, 12, -12] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#020617] p-4 border border-indigo-500 rounded-2xl z-20 shadow-xl"
                >
                  <Database className="text-indigo-500 dark:text-indigo-300 w-8 h-8" />
                </motion.div>

                <motion.div
                  animate={{ x: [-12, 12, -12] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-28 left-14 bg-white dark:bg-[#020617] p-4 border border-purple-500 rounded-2xl z-20 shadow-xl"
                >
                  <Lock className="text-purple-500 dark:text-purple-300 w-8 h-8" />
                </motion.div>

                <motion.div
                  animate={{ y: [12, -12, 12] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-28 right-14 bg-white dark:bg-[#020617] p-4 border border-blue-500 rounded-2xl z-20 shadow-xl"
                >
                  <Terminal className="text-blue-500 dark:text-blue-300 w-8 h-8" />
                </motion.div>

                <div className="absolute inset-0 m-auto w-56 h-56 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute inset-0 m-auto w-36 h-36 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-2xl z-10">
                  <Brain className="w-16 h-16 text-indigo-600 dark:text-white" />
                </div>

                <div className="absolute -inset-10 rounded-full blur-2xl bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.18),transparent_55%)]" />
              </div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section className="py-10 border-y border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/20 overflow-hidden backdrop-blur-sm">
          <div className="flex gap-20 animate-scroll whitespace-nowrap opacity-60">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-slate-800">
                  OPENAI
                </span>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-slate-800">
                  NEXT.JS
                </span>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-slate-800">
                  PYTHON
                </span>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-slate-800">
                  OBSERVABILITY
                </span>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* MONITOR */}
        <section id="monitor" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                  Live Neural Network
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                  Real-time processing across client nodes with tracing, alerts, and self-healing fallbacks.
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-300 font-mono text-xs bg-green-100 dark:bg-green-400/5 px-4 py-2 rounded-full border border-green-200 dark:border-green-400/20">
                <span className="w-2 h-2 bg-green-500 dark:bg-green-300 rounded-full animate-pulse" />
                SYSTEM OPTIMAL
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="p-10 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-xl shadow-indigo-500/5">
                <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.18),transparent_50%)] blur-2xl" />
                <div className="relative">
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
                        className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm opacity-85"
                      />
                    ))}
                  </div>
                  <div className="text-3xl font-mono text-slate-900 dark:text-white tracking-tighter">
                    42.8 TB{" "}
                    <span className="text-slate-400 text-sm block font-sans font-black tracking-widest mt-1">
                      DATA PROCESSED
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-10 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-xl shadow-purple-500/5">
                <div className="absolute -inset-10 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.18),transparent_55%)] blur-2xl" />
                <div className="relative">
                  <div className="flex justify-between items-center mb-8">
                    <Activity className="text-purple-500 w-8 h-8" />
                    <span className="text-xs font-mono text-slate-500">AGENTS-LIVE</span>
                  </div>
                  <div className="relative w-full h-40 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
                    <div className="text-7xl font-black text-slate-900 dark:text-white z-10 tracking-tighter">
                      <AnimatedNumber value={842} />
                    </div>
                  </div>
                  <div className="text-center font-mono text-purple-500 dark:text-purple-300 text-sm">
                    ACTIVE BOTS DEPLOYED
                  </div>
                </div>
              </div>

              <div className="p-10 rounded-[40px] bg-slate-950 border border-slate-800 dark:border-white/10 relative overflow-hidden font-mono text-xs text-green-400 group">
                <div className="absolute -inset-10 bg-[radial-gradient(circle_at_40%_20%,rgba(34,197,94,0.10),transparent_55%)] blur-2xl" />
                <div className="relative">
                  <div className="flex justify-between items-center mb-8">
                    <Command className="text-green-400 w-8 h-8" />
                    <span className="text-slate-500">TERMINAL.EXE</span>
                  </div>
                  <div className="space-y-3 opacity-90">
                    <p>&gt; Booting observability layer...</p>
                    <p>&gt; Tracing enabled (12ms)</p>
                    <p className="text-white">&gt; Guardrails: Active [SECURE]</p>
                    <p>&gt; Lead captured → enriched → scheduled</p>
                    <p>&gt; Ticket resolved → sentiment logged</p>
                    <p className="animate-pulse">&gt; Awaiting command_</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ECOSYSTEM */}
        <section id="ecosystem" className="py-20 px-6 bg-slate-100 dark:bg-slate-900/20">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">The Ecosystem</h2>
            <p className="text-slate-500 dark:text-slate-400">Your agents run on a modern stack with security + monitoring.</p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Python", "React", "TypeScript", "Tailwind", "OpenAI", "Vector DB", "Stripe", "Supabase"].map((tech, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 flex items-center justify-center gap-3 font-black text-slate-700 dark:text-slate-300 hover:border-indigo-500/50 hover:text-indigo-500 transition-colors cursor-default"
              >
                <Cpu className="w-5 h-5" /> {tech}
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
<section id="how" className="py-32 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">How it Works</h2>
      <p className="text-slate-500 dark:text-slate-400">
        Three steps. Full automation. Continuous improvement.
      </p>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      {[
        {
          step: "01",
          title: "Connect your data",
          desc: "Plug in CRM, inbox, helpdesk, docs, and databases. We scope permissions + retrieval.",
          icon: <Database className="w-6 h-6 text-indigo-300" />,
        },
        {
          step: "02",
          title: "Deploy agents + workflows",
          desc: "Ship self-healing automations with guardrails: lead capture, support, ops, and outreach.",
          icon: <Rocket className="w-6 h-6 text-indigo-300" />,
        },
        {
          step: "03",
          title: "Monitor + optimize",
          desc: "Tracing, evals, alerts, and continuous tuning so performance keeps improving over time.",
          icon: <Activity className="w-6 h-6 text-indigo-300" />,
        },
      ].map((s, i) => (
        <motion.div
          key={s.step}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          className="relative p-10 rounded-[40px] border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl overflow-hidden group"
        >
          <div className="absolute -inset-16 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.20),transparent_55%)]" />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-slate-500">
                Step {s.step}
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{s.title}</div>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                {s.desc}
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.18)]">
              {s.icon}
            </div>
          </div>

          


          {/* connector line for desktop */}
          {i < 2 && (
            <div className="hidden lg:block absolute top-1/2 right-[-26px] w-14 h-[2px] bg-gradient-to-r from-indigo-500/40 to-transparent" />
          )}
        </motion.div>
      ))}
    </div>

    {/* CTA row */}
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.25)]"
      >
        Initialize
      </button>
      <button
        onClick={() => jump("pricing")}
        className="px-10 py-4 rounded-2xl border border-slate-300 dark:border-white/10 font-black text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
      >
        View Pricing
      </button>
    </div>
  </div>
</section>

{/* PRODUCT PREVIEW (NO IMAGES NEEDED) */}
<section id="gallery" className="py-32 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
        Inside NexusCore
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        A preview of the system UI — dashboards, agents, and monitoring.
      </p>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      {/* Dashboard Mock */}
      <div className="rounded-[36px] border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl overflow-hidden relative group">
        <div className="absolute -inset-16 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.22),transparent_55%)]" />

        <div className="relative p-6 border-b border-slate-200 dark:border-white/10">
          <div className="text-lg font-black text-slate-900 dark:text-white">Command Center</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Live system status + tracing + alerts.
          </div>
        </div>

        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">
              Nodes Online
            </div>
            <div className="text-green-600 dark:text-green-300 font-black">842</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[72, 48, 91].map((v, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">
                  CPU
                </div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">{v}%</div>
              </div>
            ))}
          </div>

          <div className="h-28 rounded-2xl bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 overflow-hidden p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 mb-3">
              Trace
            </div>
            <div className="flex items-end gap-1 h-12">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-600/80 to-indigo-300/80"
                  style={{ height: `${20 + (i % 6) * 12}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Builder Mock */}
      <div className="rounded-[36px] border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl overflow-hidden relative group">
        <div className="absolute -inset-16 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.18),transparent_55%)]" />

        <div className="relative p-6 border-b border-slate-200 dark:border-white/10">
          <div className="text-lg font-black text-slate-900 dark:text-white">Agent Builder</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Tools, memory, and workflows in one place.
          </div>
        </div>

        <div className="relative p-6 space-y-4">
          {[
            { title: "Lead Capture", status: "ACTIVE" },
            { title: "Follow-up Agent", status: "RUNNING" },
            { title: "Refund Guardrails", status: "SECURE" },
          ].map((a, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 flex items-center justify-between"
            >
              <div>
                <div className="font-black text-slate-900 dark:text-white">{a.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">RAG + tools + monitoring</div>
              </div>
              <div className="text-[10px] font-mono px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                {a.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Mock */}
      <div className="rounded-[36px] border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl overflow-hidden relative group">
        <div className="absolute -inset-16 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.16),transparent_55%)]" />

        <div className="relative p-6 border-b border-slate-200 dark:border-white/10">
          <div className="text-lg font-black text-slate-900 dark:text-white">Performance Analytics</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Outcomes, evals, and continuous improvement.
          </div>
        </div>

        <div className="relative p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Deflection", val: "68%" },
              { label: "Latency", val: "12ms" },
              { label: "Accuracy", val: "94%" },
              { label: "Escalations", val: "3%" },
            ].map((m, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">
                  {m.label}
                </div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">{m.val}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 mb-3">
              Trend
            </div>
            <div className="h-12 rounded-xl bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-indigo-600/30" />
          </div>
        </div>
      </div>
    </div>

    <div className="mt-12 flex justify-center">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.25)]"
      >
        Request Full Demo
      </button>
    </div>
  </div>
</section>



        {/* CAPABILITIES */}
        <section id="capabilities" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Modular Capabilities</h2>

              <div className="flex flex-wrap justify-center gap-4">
                {["marketing", "operations", "support", "sales", "engineering"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all ${
                      activeTab === tab
                        ? "bg-indigo-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.35)]"
                        : "bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[420px]">
              <AnimatePresence mode="wait">
                {activeTab === "marketing" && (
                  <motion.div
                    key="marketing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-8"
                  >
                    <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-indigo-900/40 dark:to-slate-900 border border-slate-200 dark:border-indigo-500/30 relative overflow-hidden shadow-2xl shadow-indigo-500/10">
                      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.35),transparent_60%)]" />
                      <div className="relative">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Content Engine</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
                          Autonomous content generation + distribution that matches your brand.
                        </p>
                        <ul className="space-y-3 text-indigo-600 dark:text-indigo-200 font-bold">
                          <li className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5" /> SEO Optimization
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5" /> Multi-Language Support
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5" /> Campaign Automation
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xl relative overflow-hidden">
                      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.18),transparent_60%)] blur-2xl" />
                      <div className="text-center relative">
                        <Globe className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                        <div className="text-4xl font-black text-slate-900 dark:text-white">GLOBAL</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm">Reach</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "operations" && (
                  <motion.div
                    key="operations"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-8"
                  >
                    <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-purple-900/40 dark:to-slate-900 border border-slate-200 dark:border-purple-500/30 relative overflow-hidden shadow-2xl">
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Data Pipelines</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
                        Connect CRM, ERP, and databases into one source of truth (with audit logs).
                      </p>
                      <ul className="space-y-3 text-purple-600 dark:text-purple-200 font-bold">
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Auto-Invoicing
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Real-time Analytics
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Approval Workflows
                        </li>
                      </ul>
                    </div>
                    <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xl">
                      <div className="text-center">
                        <div className="text-6xl font-black text-slate-900 dark:text-white mb-2">20hr</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm">Saved Per Week</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "support" && (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-8"
                  >
                    <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-blue-900/40 dark:to-slate-900 border border-slate-200 dark:border-blue-500/30 relative overflow-hidden shadow-2xl">
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Support 24/7</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
                        Agents that resolve most tickets instantly with guardrails + escalation.
                      </p>
                      <ul className="space-y-3 text-blue-600 dark:text-blue-200 font-bold">
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Sentiment Analysis
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Safe Refund Workflows
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Human Escalation
                        </li>
                      </ul>
                    </div>
                    <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xl">
                      <div className="text-center">
                        <MessageSquare className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <div className="text-4xl font-black text-slate-900 dark:text-white">INSTANT</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm">Replies</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "sales" && (
                  <motion.div
                    key="sales"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-8"
                  >
                    <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-green-900/40 dark:to-slate-900 border border-slate-200 dark:border-green-500/30 relative overflow-hidden shadow-2xl">
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Sales Outreach</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
                        Automated outreach that enriches leads, personalizes messages, and follows up safely.
                      </p>
                      <ul className="space-y-3 text-green-600 dark:text-green-200 font-bold">
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Lead Enrichment
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Auto-Followups
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Meeting Booking
                        </li>
                      </ul>
                    </div>
                    <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xl">
                      <div className="text-center">
                        <Share2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <div className="text-4xl font-black text-slate-900 dark:text-white">10x</div>
                        <div className="text-slate-500 uppercase tracking-widest text-sm">Pipeline Growth</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "engineering" && (
                  <motion.div
                    key="engineering"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid md:grid-cols-2 gap-8"
                  >
                    <div className="p-12 rounded-[40px] bg-white dark:bg-gradient-to-br dark:from-orange-900/40 dark:to-slate-900 border border-slate-200 dark:border-orange-500/30 relative overflow-hidden shadow-2xl">
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Code Generation</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
                        Agents that write, test, and deploy safely — with evals + monitoring baked in.
                      </p>
                      <ul className="space-y-3 text-orange-600 dark:text-orange-200 font-bold">
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Unit Testing
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Documentation
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5" /> CI/CD Hooks
                        </li>
                      </ul>
                    </div>
                    <div className="p-12 rounded-[40px] bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xl">
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

        {/* NEW: USE CASES */}
        <section id="cases" className="py-32 px-6 bg-slate-100/60 dark:bg-black/20 border-y border-slate-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Use Cases</h2>
              <p className="text-slate-500 dark:text-slate-400">Pick a mission — we’ll build the system around it.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Sparkles className="w-6 h-6 text-indigo-300" />,
                  title: "Lead Capture → Qualification",
                  body: "Chat + forms + enrichment + calendar booking with safe follow-ups.",
                },
                {
                  icon: <Shield className="w-6 h-6 text-indigo-300" />,
                  title: "Support Deflection + Refunds",
                  body: "Instant answers, ticket triage, and policy-safe refunds with escalation.",
                },
                {
                  icon: <Gauge className="w-6 h-6 text-indigo-300" />,
                  title: "Ops Automation + Reporting",
                  body: "Data pipelines, alerts, approvals, and dashboards your team trusts.",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="p-8 rounded-[36px] border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl hover:border-indigo-500/40 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.22),transparent_55%)]" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.14)]">
                      {c.icon}
                    </div>
                    <div className="mt-5 text-xl font-black text-slate-900 dark:text-white">{c.title}</div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.body}</div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300 hover:translate-x-1 transition-transform"
                    >
                      Initialize <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEW: TESTIMONIALS */}
        <section id="testimonials" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Proof</h2>
              <p className="text-slate-500 dark:text-slate-400">
  Signal &gt; noise. Here’s what changes after deployment.
</p>

            </div>
            <Testimonials />
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">Investment Plans</h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400">Choose the velocity. Upgrade anytime.</p>
            </div>

            <div className="flex justify-center mb-14">
              <div className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl flex items-center gap-2">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    billing === "monthly"
                      ? "bg-indigo-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.35)]"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling("annual")}
                  className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    billing === "annual"
                      ? "bg-indigo-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.35)]"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10"
                  }`}
                >
                  Annual <span className="ml-2 text-[10px] opacity-80">(-2 mo)</span>
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <TiltCard className="p-8 rounded-[40px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 shadow-xl">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Starter</h3>
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                  ${price.starter.toLocaleString()}
                </div>
                <div className="text-slate-500 text-xs font-mono uppercase tracking-[0.25em] mb-8">
                  {billing === "monthly" ? "One-time" : "Annual bundle"}
                </div>
                <ul className="space-y-4 text-slate-500 dark:text-slate-400 mb-8 font-bold">
                  <li>• 1 Custom Automation</li>
                  <li>• Weekly Maintenance</li>
                  <li>• Email Support</li>
                </ul>
                <button className="w-full py-4 rounded-xl border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-black hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Select
                </button>
              </TiltCard>

              <TiltCard className="p-10 rounded-[40px] border border-indigo-500 bg-slate-900 dark:bg-[#0B0F19] relative shadow-[0_0_90px_rgba(99,102,241,0.18)] transform scale-105 z-10">

                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full font-black text-sm tracking-widest uppercase shadow-lg">
                  Most Popular
                </div>
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_35%_25%,rgba(99,102,241,0.45),transparent_55%)]" />
                <h3 className="relative text-3xl font-black text-white mb-4 italic">Growth Core</h3>
                <div className="relative text-6xl font-black text-white mb-2">${price.growth.toLocaleString()}</div>
                <div className="relative text-slate-400 mb-10 text-sm uppercase font-black">
                  {billing === "monthly" ? "Per Month" : "Annual bundle"}
                </div>
                <ul className="relative space-y-5 text-indigo-100 mb-10 font-bold">
                  <li className="flex gap-3">
                    <CheckCircle2 className="text-indigo-400" /> 5 Automations
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="text-indigo-400" /> Custom LLM + RAG
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="text-indigo-400" /> Monitoring + Evals
                  </li>
                </ul>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="relative w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25"
                >
                  Start Growth Core
                </button>
              </TiltCard>

              <TiltCard className="p-8 rounded-[40px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 shadow-xl">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Enterprise</h3>
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-8">Custom</div>
                <ul className="space-y-4 text-slate-500 dark:text-slate-400 mb-8 font-bold">
                  <li>• Unlimited Agents</li>
                  <li>• Dedicated Engineer</li>
                  <li>• On-Premise Setup</li>
                </ul>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 rounded-xl border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-black hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Contact Us
                </button>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-32 px-6 bg-slate-100/60 dark:bg-black/20 border-y border-slate-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">FAQ</h2>
              <p className="text-slate-500 dark:text-slate-400">Clear answers. Fast deployment. Safe systems.</p>
            </div>
            <FAQ />
          </div>
        </section>

        {/* CTA */}
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

        {/* Footer */}
        <footer className="py-20 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#020617] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-8 italic tracking-tighter uppercase">
              Nexus<span className="text-indigo-600 dark:text-indigo-500">Core</span>
            </div>
            <div className="flex justify-center gap-8 mb-12 text-slate-500 font-black uppercase tracking-widest text-xs">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                LinkedIn
              </a>
            </div>
            <p className="text-slate-500 dark:text-slate-600 text-[10px] font-mono uppercase tracking-[0.2em]">
              System Version 3.0 // Status: Operational // © 2026
            </p>
          </div>
        </footer>

        <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <AIChatAssistant />
      </motion.div>
    </div>
  );
}
