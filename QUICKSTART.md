# Quick Start Guide - Chat Application

## ⚡ 5-Minute Setup

### 1. Start Development Server
```bash
cd chat-application
npm run dev
```
**Expected output:**
```
▲ Next.js 16.1.6
- Environments: .env.local
- Local:        http://localhost:3000
```

### 2. Run in Browser
Open **http://localhost:3000** in your browser

## 📝 Test the Application

### Create Your First Account
1. Click **"Create Account"** on landing page
2. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
3. Click **"Create Account"**
4. You'll be automatically logged in and redirected to chat

### Create Second Account (For Testing)
1. Open **Incognito/Private Window**
2. Go to **http://localhost:3000**
3. Click **"Create Account"**
4. Fill in:
   - Name: `Jane Smith`
   - Email: `jane@example.com`
   - Password: `password123`

### Send Your First Message
1. **Main Window (John's account)**
   - You should see "Jane Smith" in the user list
   - Click on Jane to open conversation

2. **Type a message**: `"Hi Jane, this is my first message!"`
   - Click **Send**
   - Message appears in the chat window

3. **Incognito Window (Jane's account)**
   - Click on "John Doe" in user list
   - Message appears after a few seconds
   - Send reply: `"Hi John! How are you?"`

4. **Watch it work** - Messages sync between windows!

## 📁 Project Files

### Key Files for Chat App
- `app/chat/page.tsx` - Main chat interface
- `app/components/UserList.tsx` - User list sidebar
- `app/components/ChatWindow.tsx` - Message display & input
- `app/api/messages/route.ts` - Message API
- `app/api/conversations/route.ts` - Conversation management
- `prisma/schema.prisma` - Database models

### Authentication Files
- `lib/auth.config.ts` - NextAuth setup
- `app/api/auth/register/route.ts` - Registration endpoint
- `app/login/page.tsx` - Login page
- `app/register/page.tsx` - Registration page

### Database Files
- `prisma/dev.db` - SQLite database (auto-created)
- `prisma/migrations/` - Database change history

## 🗄️ View Database

### Option 1: Prisma Studio (Visual)
```bash
npx prisma studio
```
- Opens UI at http://localhost:5555
- View/edit users, conversations, messages
- Great for debugging!

### Option 2: SQL Query Tool
```bash
# Install sqlite3 cli
brew install sqlite3

# Open database
sqlite3 prisma/dev.db

# View users
SELECT id, email, name FROM User;

# View conversations
SELECT * FROM Conversation;

# View messages
SELECT * FROM Message ORDER BY createdAt DESC;
```

## 🔐 Environment Setup

File: `.env.local` (already configured)
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

⚠️ **Important**: Change `NEXTAUTH_SECRET` for production!

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check TypeScript errors
npm run build

# View database UI
npx prisma studio

# Reset database
npx prisma migrate reset
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
**Solution**: Database auto-creates on first run. Just restart with `npm run dev`

### Error: "User already exists"
**Solution**: Use a different email address for each account

### Messages not showing up
**Solution**: Refresh the page (messages update every 2 seconds by default)

### TypeScript errors during build
**Solution**: 
```bash
rm -rf .next
npm run build
```

## 📱 Full App Workflow

```
Landing Page (http://localhost:3000)
    ↓
    [Create Account] → Registration Page
         ↓
    Register with email/password
         ↓
    [Auto Login to Chat]
         ↓
Chat Page (http://localhost:3000/chat)
    ├─ Left: User List
    │   └─ Click user to start/open conversation
    └─ Right: Chat Window
        ├─ Messages display with timestamps
        └─ Message input & send button
```

## 📊 Architecture Overview

```
┌─────────────────┐
│   React Client  │ (app/components/, app/*/page.tsx)
│                 │
├─────────────────┤
│  NextAuth.js    │ (app/api/auth/)
│  (JWT Sessions) │
├─────────────────┤
│   Next.js API   │ (app/api/messages/, conversations/, users/)
│   Route Handlers│
├─────────────────┤
│  Prisma ORM     │ (lib/prisma.ts)
│                 │
├─────────────────┤
│   SQLite DB     │ (prisma/dev.db)
│                 │
└─────────────────┘
```

## 💡 Tips & Tricks

1. **Test with Different Browsers**
   - Use Chrome + Firefox or Chrome + Safari
   - Easier than managing incognito/private windows

2. **Monitor Messages in Real-Time**
   - Open Prisma Studio: `npx prisma studio`
   - Open two browser windows
   - Watch messages appear in the database as you send them

3. **Reset Everything**
   ```bash
   npx prisma migrate reset
   npm run dev
   ```
   This deletes all users/messages and starts fresh

4. **Check Server Logs**
   - Watch terminal where `npm run dev` is running
   - Shows all API requests and queries

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Prisma ORM Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ✅ Feature Checklist

- ✅ User registration with password hashing
- ✅ Secure login with JWT sessions
- ✅ User directory/list
- ✅ One-on-one messaging
- ✅ Message persistence in database
- ✅ Protected routes (middleware)
- ✅ Protected API endpoints
- ✅ Responsive UI (mobile & desktop)
- ✅ SSR support with Next.js
- ✅ TypeScript type safety

## 🎯 Next Steps

1. **Customize Styling**: Edit colors in components or `tailwind.config.js`
2. **Add Real-Time Chat**: Implement Socket.io for instant delivery
3. **Add User Profiles**: Store avatars and bio
4. **Add Message Search**: Full-text search for messages
5. **Add Group Chats**: Multi-user conversations

---

**You're all set!** Start chatting! 🎉
