# PharmaGuard: AI-Powered Pharmacogenomic Risk Prediction

PharmaGuard is a precision medicine platform that analyzes genomic data to prevent adverse drug reactions. By cross-referencing patient VCF files against clinical knowledge bases, it provides real-time, AI-driven risk assessments.

**🌐 Live Demo:** [https://pharamguard-mu.vercel.app/](https://pharamguard-mu.vercel.app/)

**🎥 Watch Demo Video:** [LinkedIn Post](https://www.linkedin.com/posts/alokmauryadev_rift2026-rift2026-pharmaguard-activity-7430380687788060672-NC2z?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAF9SP4YB3ImI6jMy_FMbQJNnXj92SAKZ9q8)

---

## 🚀 Modern Tech Stack

*   **Frontend Ecosystem:** Built with **Next.js 16** (App Router) and **React 19** for optimized server-side rendering and a fluid, "App-like" user experience.
*   **Design Language:** A clinical-grade UI implemented via **Tailwind CSS**, featuring a modern design system with glassmorphism and focus on high-density data readability.
*   **Server Architecture:** High-performance, edge-ready **Next.js Server Functions** providing a unified API layer with minimal latency.
*   **Intelligence Layer:** Integrated with **Stepfun Flash** via **OpenRouter**, delivering rapid, LLM-powered clinical insights and pharmacogenomic risk summaries.
*   **Genomic Processing:** Proprietary **VCF Parsing Engine** paired with a high-fidelity **CPIC-aligned Knowledge Base** for precise variant-to-drug mapping.
*   **Reporting Suite:** Secure, client-side PDF synthesis using **jsPDF** and **html2canvas**, ensuring sensitive health data remains on-device during report generation.

---

## 🛠️ Architecture

1.  **Frontend**: Next.js 16 Client Components handle genomic data ingestion and state management.
2.  **API Route**: `/api/analyze` orchestrates the analysis pipeline:
    *   **VCF Parser**: High-speed buffer processing for variant identification.
    *   **Knowledge Base**: JSON-driven clinical definitions of Gene-Drug interactions (CPIC-aligned).
    *   **Risk Engine**: Deterministic mapping of genotypes to clinical phenotypes (PM/IM/NM/RM).
    *   **LLM Service**: Generates structured clinical context using Stepfun Flash.

---

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/alokmauryadev/pharamguard.git
    cd pharamguard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    - Copy `.env.example` to `.env.local`
    - Add your OpenRouter API Key:
      ```
      OPENROUTER_API_KEY=your_key_here
      ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Usage & Testing

1.  **Upload VCF**: Use the sample data in `sample_data/high_risk_simvastatin.vcf`.
2.  **Select Drug**: Choose "Simvastatin" (Expected: Risk assessment based on SLCO1B1).
3.  **Analyze**: View the dashboard for colored risk badges, AI clinical insights, and one-click PDF export.

---

## 📄 API Documentation
**POST** `/api/analyze`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: (.vcf) The patient's genetic file.
  - `drugs`: (string) Comma-separated list of drug names.
- **Response**: JSON Array of `AnalysisResult` objects.

---

## 🛡️ Privacy & Security
PharmaGuard is designed with a **Privacy-First** architecture. Genetic data is processed in-memory during the session and is **never stored** on our servers or databases. PDF reports are generated entirely in the browser to ensure sensitive data never leaves the patient's device.

---

## 👨‍💻 Team
- **Developer**: Alok M
- **Role**: Lead Full Stack Engineer
