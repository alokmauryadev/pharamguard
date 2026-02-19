import Link from "next/link";
import { Dna, ShieldCheck, Brain, ArrowRight, Activity, FlaskConical, Dices } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "var(--background)" }}>

      {/* ── Navbar ──────────────────────────────── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div
          className="flex items-center justify-between px-6 h-14 glass"
          style={{ borderRadius: "var(--radius-pill)", boxShadow: "var(--shadow-navbar)" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-8 h-8"
              style={{ background: "var(--primary)", borderRadius: "var(--radius-md)" }}
            >
              <Dna className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base" style={{ color: "var(--foreground)", fontFamily: "var(--font-inter)" }}>
              PharmaGuard
            </span>
            {/* Active dot indicator */}
            <span className="flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="ds-nav-link">Features</a>
            <a href="#how-it-works" className="ds-nav-link">How It Works</a>
          </div>

          {/* CTA */}
          <Link href="/analyze" className="ds-btn-primary" style={{ padding: "8px 20px", fontSize: "13px" }}>
            Launch App
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────── */}
      <main className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto">

        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-30 animate-blob"
            style={{ background: "radial-gradient(circle, #C8E6C9, transparent)" }} />
          <div className="absolute bottom-[-5%] right-[-5%] w-[50vw] h-[50vw] rounded-full opacity-20 animate-blob animation-delay-2000"
            style={{ background: "radial-gradient(circle, #FFF3E0, transparent)" }} />
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="ds-pill-tag animate-float" style={{ fontSize: "12px" }}>
            <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--primary)" }} />
            AI-Powered Pharmacogenomic Analysis · CPIC Clinical Guidelines
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-center text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-playfair)" }}
        >
          Your Health,{" "}
          <br />
          <span
            className="animate-gradient-x"
            style={{
              background: "linear-gradient(135deg, var(--primary), #81C784, var(--accent-blue))",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 200%",
            }}
          >
            Our Priority
          </span>
          {" "}—{" "}
          <span style={{ color: "var(--foreground)" }}>Precision Medicine</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-center text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--gray-500)" }}
        >
          Upload your VCF genomic data. Our AI cross-references your genetic profile against CPIC drug-gene interaction databases and delivers clinical-grade pharmacogenomic risk reports.
        </p>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/analyze" className="ds-btn-primary" style={{ fontSize: "15px", padding: "14px 32px" }}>
            Start Analysis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="ds-btn-secondary" style={{ fontSize: "15px", padding: "14px 32px" }}>
            See How It Works
          </a>
        </div>

        {/* ── Floating Feature Tags + Hero Visual ─── */}
        <div className="relative flex items-center justify-center mb-24" style={{ minHeight: "320px" }}>

          {/* Center visual */}
          <div
            className="relative z-10 flex flex-col items-center justify-center w-64 h-64 md:w-80 md:h-80"
            style={{
              background: "radial-gradient(circle, #E8F5E9 0%, #F0F1F3 70%)",
              borderRadius: "50%",
            }}
          >
            <div
              className="flex items-center justify-center w-24 h-24 mb-3"
              style={{ background: "var(--primary)", borderRadius: "50%", boxShadow: "0 8px 32px rgba(76,175,80,0.30)" }}
            >
              <Dna className="w-12 h-12 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: "var(--primary-dark)" }}>Genomic Analysis</span>
            <span className="text-xs mt-1" style={{ color: "var(--gray-400)" }}>Real-time · AI-powered</span>
          </div>

          {/* Floating tags — left */}
          <div className="absolute left-0 top-1/4 animate-float ds-pill-tag hidden md:flex">
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ background: "var(--accent-orange)" }}>+</span>
            Gene-Drug Interaction Check
          </div>
          <div className="absolute left-4 bottom-1/4 animate-float-delay ds-pill-tag hidden md:flex">
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ background: "var(--accent-orange)" }}>+</span>
            VCF File Upload
          </div>

          {/* Floating tags — right */}
          <div className="absolute right-0 top-1/4 animate-float-delay ds-pill-tag hidden md:flex">
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ background: "var(--accent-orange)" }}>+</span>
            CPIC Guidelines
          </div>
          <div className="absolute right-4 bottom-1/4 animate-float ds-pill-tag hidden md:flex">
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ background: "var(--accent-orange)" }}>+</span>
            PDF Risk Reports
          </div>
        </div>

        {/* ── Stats Bar ───────────────────────────── */}
        <div id="how-it-works" className="grid md:grid-cols-3 gap-5 mb-20">
          {[
            {
              label: "Analysis Accuracy",
              value: "CPIC",
              detail: "Based on Clinical Pharmacogenomics Implementation Consortium standards",
              progress: 95,
              icon: Activity,
              iconBg: "var(--primary-light)",
              iconColor: "var(--primary-dark)",
            },
            {
              label: "Supported Drugs",
              value: "6+",
              detail: "From antidepressants and anticoagulants to chemotherapy agents",
              progress: 75,
              icon: FlaskConical,
              iconBg: "var(--accent-orange-light)",
              iconColor: "var(--accent-orange-dark)",
            },
            {
              label: "Risk Categories",
              value: "4 Levels",
              detail: "Critical · High · Moderate · Low severity pathways",
              progress: 85,
              icon: Dices,
              iconBg: "var(--accent-blue-light)",
              iconColor: "var(--accent-blue-dark)",
            },
          ].map((stat, i) => (
            <div key={i} className="ds-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--gray-400)" }}>
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>{stat.value}</p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{ background: stat.iconBg }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.iconColor }} />
                </div>
              </div>
              <p className="text-xs mb-4" style={{ color: "var(--gray-400)" }}>{stat.detail}</p>
              <div className="ds-progress-track">
                <div className="ds-progress-fill" style={{ width: `${stat.progress}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: "var(--gray-400)" }}>0</span>
                <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>+{stat.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Features Grid ──────────────────────── */}
        <div id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--foreground)", fontFamily: "var(--font-playfair)" }}
            >
              Why PharmaGuard?
            </h2>
            <p style={{ color: "var(--gray-500)" }}>Built for clinicians and researchers who need reliable genomic risk insights.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Privacy First",
                desc: "Your genetic data is processed in-memory only. We never store VCF files — data is gone after the session.",
                icon: ShieldCheck,
                iconBg: "var(--primary-light)",
                iconColor: "var(--primary)",
                tag: "Zero Data Retention",
              },
              {
                title: "AI Clinical Insights",
                desc: "Understand the 'why' behind every risk flag. Our AI explains complex gene-drug interactions in plain clinical language.",
                icon: Brain,
                iconBg: "var(--accent-blue-light)",
                iconColor: "var(--accent-blue)",
                tag: "LLM-Powered",
              },
              {
                title: "CPIC Standards",
                desc: "Every recommendation follows the latest Clinical Pharmacogenetics Implementation Consortium published guidelines.",
                icon: Activity,
                iconBg: "var(--accent-orange-light)",
                iconColor: "var(--accent-orange)",
                tag: "Evidence-Based",
              },
            ].map((f, i) => (
              <div key={i} className="ds-card-lg ds-feature-card p-8 cursor-default">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                  style={{ background: f.iconBg }}>
                  <f.icon className="w-7 h-7" style={{ color: f.iconColor }} />
                </div>
                <div className="mb-3">
                  <span className="ds-pill-tag text-xs" style={{ padding: "4px 10px", fontSize: "11px", background: f.iconBg, borderColor: "transparent", color: f.iconColor }}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "var(--foreground)" }}>{f.title}</h3>
                <p className="leading-relaxed" style={{ color: "var(--gray-500)", fontSize: "14px" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Community Strip ─────────────────────── */}
        <div
          className="rounded-3xl p-10 text-center mb-16 overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--primary))" }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white, transparent 50%), radial-gradient(circle at 80% 20%, white, transparent 40%)" }} />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 relative z-10" style={{ fontFamily: "var(--font-playfair)" }}>
            Open Source. Clinically Aligned.
          </h3>
          <p className="text-green-100 mb-8 relative z-10">
            Join clinicians, researchers, and bioinformaticians using PharmaGuard to improve patient safety.
          </p>
          <div className="flex items-center justify-center gap-4 relative z-10">
            <Link href="/analyze" className="ds-btn-primary" style={{ background: "var(--accent-orange)", fontSize: "14px", padding: "12px 28px" }}>
              Start Free Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7" style={{ background: "var(--primary)", borderRadius: "var(--radius-md)" }}>
              <Dna className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>PharmaGuard</span>
          </div>
          <p className="text-xs" style={{ color: "var(--gray-400)" }}>
            © 2026 PharmaGuard · Analysis is for educational and research purposes only, not a substitute for clinical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
