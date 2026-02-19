# PharmaGuard: Pharmacogenomic Risk Prediction

## Project Overview
PharmaGuard is an AI-powered precision medicine application designed to prevent adverse drug reactions. It analyzes patient genetic data (VCF files) against specific drugs to predict pharmacogenomic risks.

**Features:**
- **VCF Parsing**: Extracts key pharmacogenomic variants from standard `.vcf` files.
- **Risk Prediction**: Uses CPIC-guideline based logic to determine phenotypes and risk levels.
- **AI Explanations**: Integrates Google Gemini to provide clinical explanations and biological mechanisms.
- **Privacy First**: All analysis happens in a secure session; no data is stored permanently.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Icons**: Lucide React

## Architecture
1. **Frontend**: Next.js Client Components (React) handle file uploads and state.
2. **API Route**: `/api/analyze` handles the logic.
   - **VCF Parser**: Reads the file buffer.
   - **Knowledge Base**: Static JSON definitions of Gene-Drug interactions.
   - **Risk Engine**: Determines phenotype (PM/IM/NM/RM) and maps to risk.
   - **LLM Service**: Generates human-readable clinical context.

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pharmaguard.git
   cd pharmaguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Add your Google Gemini API Key:
     ```
     GEMINI_API_KEY=your_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## usage
1. **Upload VCF**: Use the provided `sample_data/high_risk_cyp2c19.vcf` file.
2. **Select Drug**: Choose "Clopidogrel" (Expected Risk: **Ineffective** due to CYP2C19 *2/*2).
3. **Analyze**: View the dashboard for risk assessment and AI explanation.

## API Documentation
**POST** `/api/analyze`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: (.vcf) The patient's genetic file.
  - `drugs`: (string) Comma-separated list of drug names.
- **Response**: JSON Array of `AnalysisResult` objects.

## Team
- **Developer**: Alok M
- **Role**: Full Stack Engineer
