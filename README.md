# AI Resume Builder (GenAI Buildathon)

Welcome

This is a **Beginner-Friendly AI Resume Builder Project** built using:

- Next.js (Frontend)
- Supabase (Database + Login)
- Gemini API (AI Features)

---

## IMPORTANT

This project is **NOT fully complete** on purpose.

Your goal is to:
- Fix errors
- Complete missing features
- Make the app fully working

---

# WHAT YOU WILL LEARN

By the end of this project, you will know:

- How to run a real project
- How login/signup works
- How to connect a database
- How to use AI APIs
- How to debug errors

---

# STEP 0: Install Required Software

### 1. Install Node.js  
Download and install (LTS version):  
https://nodejs.org  


### 2. Install VS Code  
https://code.visualstudio.com/


### 3. Install Git
Go here:
 https://git-scm.com/downloads

For Windows:
    Download starts automatically
    Open installer
    Keep clicking Next → Next → Next (default settings are fine)

Verify installation
Open terminal / PowerShell:
```bash
    git --version
```


### 4. Setup Git (First time only)
Tell Git who you are:
```bash
    git config --global user.name "Your Name"
    git config --global user.email "your-email@example.com"  
    [This email should be used while creating the github account]
```
Check config: 
```bash
    git config --list
```


### 5: Create GitHub Account
Go to:
 https://github.com

Click Sign up
Create account

---

# STEP 1: Download the Project

### Option 1 (Easy)
Click **Download ZIP** from GitHub and extract

### Option 2 (Using Git)
```bash
git clone <your-repo-url> 
    [You can get the URL from github repo - green color Code button ]
cd <project-folder>
```

---

# STEP 2: Install Dependencies

```bash
npm install
```

---

#  STEP 3: Run the Project

```bash
npm run dev
```

Open in browser:  
http://localhost:3000

---

## YOU WILL SEE ERRORS — THIS IS NORMAL

Don’t panic. We will fix them step by step.

---

# STEP 4: Setup Supabase

1. Go to https://supabase.com  
2. Create account  
3. Click **New Project**  
4. Wait until setup finishes  

---

# STEP 5: Get Supabase Keys (Ask Chatgpt for a deatiled step by step process)

Go to:  
Settings → API  

Copy:
- Project URL  
- anon public key  

---

# STEP 6: Create `.env.local`

Create file in root:

.env.local

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
GEMINI_API_KEY=your_gemini_key_here
```

---

## VERY IMPORTANT

Restart server:

```bash
npm run dev
```

---

# STEP 7: Setup Database

1. Open Supabase Dashboard  
2. Go to SQL Editor   
3. Paste into SQL Editor [ 
    create table if not exists resumes (
        id          uuid primary key default uuid_generate_v4(),
        user_id     uuid not null references auth.users(id) on delete cascade,
        title       text not null default 'Untitled Resume',
        template    text not null default 'modern',  -- modern | classic | executive
        ats_score   int,                              -- 0-100, set by Gemini
        content     jsonb not null default '{}'::jsonb,
        created_at  timestamptz not null default now(),
        updated_at  timestamptz not null default now()
    );
] 
4. Click RUN  

---

# STEP 8: Enable Login

Go to:  
Authentication → Providers  

Enable:
- Email + Password  

---

# STEP 9: Setup Gemini API

1. Go to https://aistudio.google.com/  
2. Create API Key  
3. Paste into `.env.local`  

```env
GEMINI_API_KEY=your_key_here
```

---

# STEP 10: Run Again

```bash
npm run dev
```

---

# STEP 11: TEST

Check:
- App opens?
- Errors?

---

# YOUR MAIN TASKS

---

## TASK 1: Login & Signup (Discuss with Chatgpt and get clear instructions)

- Create signup page  
- Create login page  
- Connect with Supabase (You have to edit the table for this using the sql editor in Supabase Dashboard) 

✔ User can register  
✔ User can login  

---

## TASK 2: Protect Dashboard

- Only logged-in users can access dashboard  
- Redirect if not logged in  

---

## TASK 3: Save Resume Data

- Save user input to database  
- Load data after refresh  

---

## TASK 4: Gemini AI

- Improve resume text  
- Generate suggestions  

---

## TASK 5: Fix Bugs

- Console errors  
- UI issues  
- Data issues  

---

# FINAL CHECKLIST

- [ ] App runs  
- [ ] Signup works  
- [ ] Login works  
- [ ] Dashboard opens  
- [ ] Data saves  
- [ ] Data loads  
- [ ] AI works  
- [ IMPORTANT ] Make it fully Responsive (Should look good on every screen - Mobile, Laptop, Tab etc)  

---

# COMMON ERRORS

### Env not working  
→ Restart server  

### Supabase not working  
→ Check keys  

### Login not working  
→ Enable auth in Supabase  

### Nothing happening  
→ Press F12 → check console  

---

# RULES

- Don’t copy blindly  
- Try to understand  
- Debug first  

---

# FINAL GOAL

Build a **fully working AI Resume Builder**

✔ Working  
✔ Clean  
✔ Functional  

---

# BONUS TASKS

- Improve UI  
- Add features - Users can also generate text for their Portfolio, you can create seperate dashboard which can be used as a ToDO app......
- Optimize performance  

---

Good luck   
Build something real.