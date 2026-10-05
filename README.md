# Kesra Performance Management System (نظام كسرة لتقييم الأداء)

## 📌 About The Project (نبذة عن المشروع)
Kesra Performance System is a comprehensive web application designed to manage, evaluate, and track employee performance. It features role-based dashboards (Team Leaders, Head Technical, etc.), AI-powered insights, and real-time data management.

نظام "كسرة" لتقييم الأداء هو تطبيق ويب متكامل مصمم لإدارة وتقييم وتتبع أداء الموظفين في الشركة. يحتوي النظام على لوحات تحكم (Dashboards) مخصصة حسب الصلاحيات (مثل قادة الفِرق والمديرين)، بالإضافة إلى ميزات الذكاء الاصطناعي لتحليل الأداء واستخراج التوصيات، مع إدارة البيانات وتخزينها سحابياً.

## 🚀 Key Features (أهم المميزات)
- **Role-Based Dashboards:** لوحات تحكم مختلفة الصلاحيات (Team Leader Dashboard, Head Technical Dashboard).
- **Employee Evaluation:** نظام كامل لإنشاء وإدارة تقييمات الموظفين بناءً على مؤشرات الأداء (KPIs).
- **AI Insights & Recommendations:** متكامل مع تقنيات الذكاء الاصطناعي (Google Gemini) لتقديم تحليلات ذكية لأداء الموظفين وتوصيات للتطوير.
- **Interactive Data Visualization:** رسوم بيانية تفاعلية لعرض البيانات والإحصائيات.
- **Audit & History Logs:** سجل تدقيق لتتبع التغييرات وتاريخ التقييمات.
- **Bilingual Support:** يدعم اللغتين العربية والإنجليزية.

## 🛠️ Tech Stack (التقنيات المستخدمة)
- **Frontend:** React.js, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Charts & UI:** Recharts, Lucide React
- **Backend/Database:** Supabase (PostgreSQL)
- **AI Engine:** Google GenAI (Gemini 2.5)

## 💻 How to Run Locally (طريقة التشغيل)

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
   Create a `.env` file and add the required keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_google_gemini_key
   ```

4. **Start the app:**
   ```bash
   npm run dev
   ```
