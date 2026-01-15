# מדריך לפרסום האתר לאינטרנט

## אפשרות 1: Vercel (מומלץ - הכי קל ל-Next.js)

### שלב 1: הכנה
1. ודא שיש לך חשבון GitHub/GitLab/Bitbucket
2. ודא שהפרויקט שלך ב-Git repository

### שלב 2: העלה את הקוד ל-GitHub
```bash
# אם עדיין לא יצרת repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### שלב 3: פרסם ב-Vercel
1. לך ל-https://vercel.com
2. היכנס עם חשבון GitHub שלך
3. לחץ על "Add New Project"
4. בחר את ה-repository שלך
5. בהגדרות הפרויקט:
   - **Framework Preset**: Next.js (יוזהה אוטומטית)
   - **Root Directory**: `./` (או השאר ריק)
   - **Build Command**: `npm run build` (ברירת מחדל)
   - **Output Directory**: `.next` (ברירת מחדל)

### שלב 4: הוסף משתני סביבה
ב-Vercel, תחת "Environment Variables", הוסף:
- `SUPABASE_URL` - הכתובת של Supabase שלך
- `SUPABASE_SERVICE_ROLE_KEY` - המפתח של Supabase שלך
- `NEXT_PUBLIC_SUPABASE_URL` - אותו כמו SUPABASE_URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - המפתח הציבורי של Supabase

### שלב 5: פרסום
1. לחץ על "Deploy"
2. אחרי שהבנייה מסתיימת, תקבל כתובת כמו: `your-project.vercel.app`

### שלב 6: חיבור דומיין מותאם אישית
1. ב-Vercel Dashboard, לך ל-"Settings" > "Domains"
2. לחץ על "Add Domain"
3. הכנס את הדומיין שלך (למשל: `aitools.com`)
4. עקוב אחר ההוראות להגדרת DNS:
   - הוסף CNAME record: `@` → `cname.vercel-dns.com`
   - או A record: `@` → כתובת IP של Vercel

---

## אפשרות 2: Netlify

### שלב 1: העלה ל-GitHub (כמו למעלה)

### שלב 2: פרסם ב-Netlify
1. לך ל-https://netlify.com
2. היכנס עם חשבון GitHub
3. לחץ על "Add new site" > "Import an existing project"
4. בחר את ה-repository שלך
5. בהגדרות:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### שלב 3: הוסף משתני סביבה
ב-Netlify, תחת "Site settings" > "Environment variables", הוסף את אותם משתנים כמו ב-Vercel

---

## אפשרות 3: Railway

1. לך ל-https://railway.app
2. היכנס עם GitHub
3. לחץ על "New Project" > "Deploy from GitHub repo"
4. בחר את ה-repository
5. הוסף משתני סביבה תחת "Variables"
6. האתר יתפרסם אוטומטית

---

## בדיקות אחרי הפרסום

1. ודא שהאתר נטען: `https://your-domain.com`
2. בדוק שהחיפוש עובד
3. בדוק שהדירוגים נשמרים
4. בדוק שהתמונות נטענות

---

## הערות חשובות

- **Supabase**: ודא שהמסד נתונים Supabase שלך נגיש מהאינטרנט (ברירת מחדל כן)
- **CORS**: אם יש בעיות, ודא ב-Supabase Dashboard > Settings > API שהכתובת שלך מורשית
- **Environment Variables**: לעולם אל תעלה את קובץ `.env` ל-GitHub! השתמש במשתני סביבה של הפלטפורמה

---

## פתרון בעיות

### האתר לא נבנה
- בדוק את ה-logs ב-Vercel/Netlify
- ודא שכל ה-dependencies מותקנים
- ודא שכל משתני הסביבה מוגדרים

### שגיאות Supabase
- ודא שהמשתנים `SUPABASE_URL` ו-`SUPABASE_SERVICE_ROLE_KEY` מוגדרים נכון
- בדוק ב-Supabase Dashboard שהמפתחות תקפים

### תמונות לא נטענות
- זה נורמלי - התמונות נטענות מ-Clearbit/Google Favicon
- אם יש בעיות CORS, זה יכול להיות בגלל מדיניות של Clearbit
