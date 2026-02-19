import Link from "next/link";
import { Dna, ShieldCheck, Zap, Brain, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans selection:bg-teal-100 selection:text-teal-900">

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-teal-400/10 blur-[150px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-blue-500/10 blur-[150px] animate-blob animation-delay-2000" />
        <div className="absolute top-[20%] left-[30%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[150px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative p-2.5 bg-gradient-to-tr from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300 ease-out">
              <Dna className="w-6 h-6 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
              PharmaGuard
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors">How it Works</a>
            <Link
              href="/analyze"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-48 relative z-10">

        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-32">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              The Future of Personalized Medicine is Here
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Precision Medicine, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-600 animate-gradient-x">
              Decoded by AI.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Upload your genomic data. Let our advanced AI analyze interactions between your DNA and medications to prevent adverse reactions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link
              href="/analyze"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-teal-600 rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 hover:-translate-y-1"
            >
              Start Analysis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
            </Link>

            <button className="px-8 py-4 text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-lg">
              View Sample Report
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "Privacy First",
              desc: "Your genetic data is analyzed securely in-memory. We never store your VCF files—once the session ends, your data is gone forever.",
              icon: ShieldCheck,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              delay: "delay-0"
            },
            {
              title: "AI Explanations",
              desc: "Understand the 'why' behind your results. Our AI interprets complex gene-drug interactions into clear, clinical insights you can actually read.",
              icon: Brain,
              color: "text-blue-600",
              bg: "bg-blue-50",
              delay: "delay-100"
            },
            {
              title: "CPIC Guidelines",
              desc: "Actionable recommendations based on the latest Clinical Pharmacogenetics Implementation Consortium standards.",
              icon: ActivityIcon,
              color: "text-violet-600",
              bg: "bg-violet-50",
              delay: "delay-200"
            }
          ].map((feature, i) => (
            <GlassCard key={i} className={`p-8 hover:-translate-y-2 duration-500 ${feature.delay} border border-slate-200/50 dark:border-slate-800/50`}>
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 ${feature.color} ring-4 ring-white dark:ring-slate-900 shadow-sm`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {feature.desc}
              </p>
            </GlassCard>
          ))}
        </div>

      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <Dna className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-slate-900 dark:text-white">PharmaGuard</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 PharmaGuard. Analysis for educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
