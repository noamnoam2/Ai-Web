# יצירת קובץ .env.local - מדריך מהיר

## אופציה 1: שימוש בסקריפט (מומלץ)

הריצו בטרמינל PowerShell:

```powershell
.\create-env.ps1
```

הסקריפט יבקש מכם את המפתחות ויצור את הקובץ אוטומטית.

## אופציה 2: יצירה ידנית

### שלב 1: קבלת המפתחות מ-Supabase

1. היכנסו ל-[supabase.com](https://supabase.com) והתחברו
2. בחרו את הפרויקט שלכם (או צרו פרויקט חדש)
3. לחצו על **Settings** (⚙️) בתפריט השמאלי
4. לחצו על **API**
5. העתיקו את המידע הבא:
   - **Project URL** → זה ה-`NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → זה ה-`NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → זה ה-`SUPABASE_SERVICE_ROLE_KEY` (⚠️ שמרו בסוד!)

### שלב 2: יצירת הקובץ

1. פתחו את התיקייה `C:\AIWEB` ב-VS Code או עורך טקסט
2. צרו קובץ חדש בשם: `.env.local`
3. העתיקו את התוכן הבא והחליפו את הערכים:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**דוגמה:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM4OTY3MjkwLCJleHAiOjE5NTQ1NDMyOTB9.xxxxx
```

### שלב 3: הפעלה מחדש

**חשוב!** אחרי יצירת הקובץ, הפעילו מחדש את השרת:

1. עצרו את השרת (Ctrl+C)
2. הריצו שוב: `npm run dev`

## אם עדיין אין לכם פרויקט ב-Supabase

1. היכנסו ל-[supabase.com](https://supabase.com)
2. לחצו **"New Project"**
3. מלאו פרטים (שם, סיסמה למסד נתונים)
4. חכו 2-3 דקות שהפרויקט יסתיים
5. הרצו את `supabase/schema.sql` ב-SQL Editor
6. קבלו את המפתחות מ-Settings > API

## בדיקה שהקובץ נוצר

הריצו בטרמינל:

```powershell
Test-Path .env.local
```

אם זה מחזיר `True`, הקובץ קיים! ✅
