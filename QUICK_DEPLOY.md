# 🚀 פרסום מהיר לאתר אמיתי

## שלב 1: יצירת Git Repository

פתח PowerShell או Terminal והרץ:

```powershell
cd C:\AIWEB
git init
git add .
git commit -m "Initial commit - AI Tool Finder"
```

## שלב 2: העלאה ל-GitHub

1. לך ל-https://github.com
2. לחץ על "New repository"
3. תן שם (למשל: `ai-tool-finder`)
4. **אל תסמן** "Initialize with README"
5. לחץ "Create repository"
6. הרץ את הפקודות שהאתר מציג:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/ai-tool-finder.git
git branch -M main
git push -u origin main
```

## שלב 3: פרסום ב-Vercel (5 דקות!)

1. לך ל-https://vercel.com
2. לחץ "Sign Up" והיכנס עם GitHub
3. לחץ "Add New Project"
4. בחר את ה-repository שיצרת
5. לחץ "Deploy" (הכל כבר מוגדר!)

## שלב 4: הוספת משתני סביבה

אחרי שהפרסום מסתיים:

1. ב-Vercel Dashboard, לך ל-"Settings" > "Environment Variables"
2. הוסף את המשתנים הבאים:

```
NEXT_PUBLIC_SUPABASE_URL = [הכתובת שלך מ-.env]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [המפתח שלך מ-.env]
SUPABASE_SERVICE_ROLE_KEY = [המפתח שלך מ-.env]
```

3. לחץ "Save"
4. לך ל-"Deployments" ולחץ על ה-3 נקודות של ה-deployment האחרון
5. בחר "Redeploy"

## שלב 5: חיבור דומיין (אופציונלי)

1. ב-Vercel Dashboard, לך ל-"Settings" > "Domains"
2. לחץ "Add Domain"
3. הכנס את הדומיין שלך
4. עקוב אחר ההוראות להגדרת DNS

---

## ✅ אחרי הפרסום

האתר שלך יהיה זמין בכתובת:
- `https://your-project-name.vercel.app`

או אם חיברת דומיין:
- `https://your-domain.com`

---

## ⚠️ חשוב!

- **אל תעלה את קובץ `.env` ל-GitHub!** הוא כבר ב-.gitignore
- ודא שהמשתנים ב-Vercel זהים לאלה ב-.env שלך
- אם יש שגיאות, בדוק את ה-Logs ב-Vercel
