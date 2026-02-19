import Link from "next/link";
import { Dna, ShieldCheck, Zap, Brain, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg shadow-lg shadow-teal-500/20">
            <Dna className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PharmaGuard</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How it Works</a>
          <Link href="/analyze" className="px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:scale-105 active:scale-95">
            Launch App
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-32">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap className="w-4 h-4 fill-current" />
            <span>AI-Powered Pharmacogenomics</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
            Precision Medicine, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">Simplified.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Prevent adverse drug reactions with advanced genetic analysis. Upload your VCF data and let our AI explain your risks in plain English.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link
              href="/analyze"
              className="group flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-full font-semibold text-lg shadow-xl shadow-teal-500/30 hover:bg-teal-500 hover:scale-105 transition-all duration-300"
            >
              Start Analysis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              View Sample Report
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <GlassCard className="hover:-translate-y-2 duration-500">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-6 text-teal-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Privacy First</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Your genetic data is analyzed securely in-memory. We never store your VCF files—once the session ends, your data is gone.
            </p>
          </GlassCard>

          <GlassCard className="hover:-translate-y-2 duration-500 delay-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 text-blue-600">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Explanations</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Understand the "why" behind your results. Our AI interprets complex gene-drug interactions into clear, clinical insights.
            </p>
          </GlassCard>

          <GlassCard className="hover:-translate-y-2 duration-500 delay-200">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 text-purple-600">
              <ActivityIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">CPIC Guidelines</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Actionable recommendations based on the latest Clinical Pharmacogenetics Implementation Consortium standards.
            </p>
          </GlassCard>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
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
