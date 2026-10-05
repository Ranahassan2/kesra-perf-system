# Kesra Performance Management System

## About The Project
Kesra Performance System is a comprehensive web application designed to manage, evaluate, and track employee performance. It features role-based dashboards (Team Leaders, Head Technical, etc.), AI-powered insights, and real-time data management. The system streamlines the evaluation process and provides actionable recommendations to improve employee productivity.

## Key Features
- **Role-Based Dashboards:** Distinct and secure dashboards for different roles (e.g., Team Leader Dashboard, Head Technical Dashboard).
- **Employee Evaluation:** A complete system to create, submit, and manage employee performance evaluations based on specific KPIs.
- **AI Insights & Recommendations:** Integrated with Google Gemini AI to analyze performance data, provide intelligent recommendations, and highlight areas for improvement.
- **Interactive Data Visualization:** Dynamic charts and graphs for real-time statistical overviews and data tracking.
- **Audit & History Logs:** A comprehensive audit trail to track system changes and historical evaluation records.
- **Bilingual Support:** Full support for both English and Arabic interfaces within the app.

## Tech Stack
- **Frontend:** React.js, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Charts & UI:** Recharts, Lucide React
- **Backend/Database:** Supabase (PostgreSQL)
- **AI Engine:** Google GenAI (Gemini 2.5)

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ranahassan2/kesra-perf-system.git
   cd kesra-perf-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the required keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_google_gemini_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
