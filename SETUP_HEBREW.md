# מדריך התקנה בעברית - AI Tool Finder

## שלב 1: התקנת התלויות ✅
**הושלם!** התלויות כבר הותקנו.

## שלב 2: הגדרת Supabase

### 2.1 יצירת פרויקט ב-Supabase

1. היכנסו ל-[supabase.com](https://supabase.com)
2. הירשמו/התחברו
3. לחצו על **"New Project"**
4. מלאו את הפרטים:
   - שם הפרויקט (למשל: "ai-tool-finder")
   - סיסמה למסד הנתונים (שמרו אותה!)
   - אזור (בחרו את הקרוב אליכם)
5. לחצו **"Create new project"**
6. חכו כמה דקות עד שהפרויקט מוכן

### 2.2 הרצת סכמת המסד נתונים

1. ב-Supabase Dashboard, לחצו על **"SQL Editor"** בתפריט השמאלי
2. לחצו על **"New query"**
3. פתחו את הקובץ `supabase/schema.sql` מהפרויקט שלכם
4. העתיקו את כל התוכן והדביקו ב-SQL Editor
5. לחצו **"Run"** (או Ctrl+Enter)
6. אמורה להופיע הודעה "Success"

### 2.3 קבלת מפתחות API

1. ב-Supabase Dashboard, לחצו על **"Settings"** (⚙️)
2. לחצו על **"API"** בתפריט
3. העתיקו את המידע הבא:
   - **Project URL** - זה ה-`NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key - זה ה-`NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key - זה ה-`SUPABASE_SERVICE_ROLE_KEY` (⚠️ שמרו בסוד!)

## שלב 3: יצירת קובץ .env.local

1. פתחו את התיקייה `C:\AIWEB` ב-VS Code או עורך טקסט
2. צרו קובץ חדש בשם `.env.local`
3. העתיקו את התוכן הבא והחליפו את הערכים:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**דוגמה:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## שלב 4: הרצת השרת

פתחו טרמינל (PowerShell או Command Prompt) והריצו:

```bash
cd C:\AIWEB
npm run dev
```

אמורה להופיע הודעה:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

פתחו את הדפדפן בכתובת: **http://localhost:3000**

## שלב 5: הוספת כלים ראשונים

### אופציה א': דרך דף הניהול

1. פתחו: http://localhost:3000/admin
2. מלאו את הטופס עם פרטי כלי AI
3. לחצו "Create Tool"

### אופציה ב': הרצת סקריפט זריעה

פתחו טרמינל חדש והריצו:

```bash
cd C:\AIWEB
npx tsx scripts/seed.ts
```

זה יוסיף 8 כלי AI לדוגמה.

## פתרון בעיות

### שגיאת חיבור למסד נתונים
- ודאו שהמפתחות ב-`.env.local` נכונים
- ודאו שהסכמה רצה בהצלחה ב-Supabase
- בדקו שהפרויקט ב-Supabase פעיל (לא מושעה)

### שגיאות API
- בדקו את הקונסולה בדפדפן (F12)
- ודאו שכל המשתנים מתחילים ב-`NEXT_PUBLIC_`
- בדקו את הלוגים ב-Supabase Dashboard

### שגיאות Build
- הריצו `npm install` שוב
- מחקו את התיקייה `.next` והריצו `npm run dev` שוב

## מה הלאה?

✅ האתר מוכן לשימוש!
- דף הבית: חיפוש וסינון כלים
- דף כלי: פרטים מלאים ודירוג
- דף השוואה: השוואת עד 3 כלים
- דף ניהול: הוספת כלים חדשים

**בהצלחה! 🚀**
