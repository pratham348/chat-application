# Chat Application

A full-featured real-time chat application built with Next.js 16, featuring user authentication, one-on-one messaging, and persistent chat history.

## Features

### ✨ Core Functionality
- **User Authentication**
  - Create a new account with email and password
  - Secure login with password hashing (bcryptjs)
  - JWT-based session management
  - Protected routes and endpoints

- **User Discovery**
  - Browse all registered users
  - View user list with names and email addresses
  - One-click user selection to start messaging

- **One-on-One Messaging**
  - Real-time message sending and receiving
  - Persistent message history stored in database
  - Automatic conversation creation between users
  - Message timestamps and sender identification

- **Landing Page**
  - Beautiful marketing landing page
  - Quick access to login and registration
  - Feature highlights

### 🏗️ Technical Stack
- **Frontend**: React 19 with Next.js 16 (App Router)
- **Authentication**: NextAuth.js with Credentials Provider
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS v4
- **Password Security**: bcryptjs for secure hashing
- **Type Safety**: TypeScript throughout

### 📱 UI/UX Features
- Responsive design (mobile & desktop)
- Dark-themed interface
- Message auto-scroll to latest
- Real-time message polling (2-second intervals)
- User-friendly forms with validation
- Logout functionality
- Proper error handling and user feedback

## Project Structure

```
chat-application/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/       # NextAuth route handler
│   │   │   └── register/            # User registration endpoint
│   │   ├── users/                   # Fetch all users
│   │   ├── conversations/           # Create/fetch conversations
│   │   └── messages/                # Send/receive messages
│   ├── components/
│   │   ├── UserList.tsx             # User list sidebar
│   │   └── ChatWindow.tsx           # Main chat interface
│   ├── chat/
│   │   └── page.tsx                 # Chat main page
│   ├── login/
│   │   └── page.tsx                 # Login page
│   ├── register/
│   │   └── page.tsx                 # Registration page
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   └── providers.tsx                # NextAuth provider
├── lib/
│   ├── auth.config.ts               # NextAuth configuration
│   ├── auth.ts                      # Auth helpers
│   ├── prisma.ts                    # Prisma client singleton
│   └── types/
│       └── auth.d.ts                # TypeScript auth types
├── prisma/
│   ├── schema.prisma                # Database models
│   ├── migrations/                  # Database migrations
│   └── dev.db                       # SQLite database file
├── middleware.ts                    # Route protection middleware
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Database Schema

### User
- `id`: Unique user identifier (CUID)
- `email`: User email (unique)
- `password`: Hashed password
- `name`: User display name
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Conversation
- `id`: Unique conversation identifier
- `participants`: Many-to-many relationship with users
- `messages`: All messages in this conversation
- `createdAt`: Conversation start timestamp
- `updatedAt`: Last message timestamp

### Message
- `id`: Unique message identifier
- `content`: Message text
- `senderId`: Reference to sender user
- `conversationId`: Reference to conversation
- `createdAt`: Message timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth routes

### Users
- `GET /api/users` - Get all users except current user

###Conversations
- `POST /api/conversations` - Create/fetch one-on-one conversation
- `GET /api/conversations` - Get user's conversations (extensible)

### Messages
- `GET /api/messages?conversationId=...` - Fetch messages for a conversation
- `POST /api/messages` - Send a new message

## Getting Started

### Prerequisites
- Node.js 18+ (tested with Node.js 20+)
- npm or yarn

### Installation

1. **Clone/Extract the project**
   ```bash
   cd chat-application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   The database is automatically initialized. Check that `.env.local` has the correct `DATABASE_URL`:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run migrations** (if needed)
   ```bash
   npx prisma migrate dev
   ```

### Running the Application

**Development Mode**
```bash
npm run dev
```
Opens at `http://localhost:3000`

**Production Build**
```bash
npm run build
npm start
```

## Authentication Flow

1. **Registration**: User creates account → Password hashed → Stored in database
2. **Login**: User provides email/password → Credentials verified → JWT session created
3. **Protected Routes**: Middleware checks session → Redirects to login if needed
4. **API Protection**: Each API endpoint validates session before processing

## How to Use

### 1. Create Account
- Go to `http://localhost:3000`
- Click "Create Account"
- Fill in name, email, and password
- Account is created and you're automatically logged in

### 2. Start Chatting
- You're redirected to `/chat` page
- Left sidebar shows all available users
- Click a user to start conversation
- Messages are automatically saved to database

### 3. Chat Features
- Messages appear in real-time (updates every 2 seconds)
- Messages show timestamps
- Conversation history is persistent
- Auto-scrolls to latest message

### 4. User Management
- View all registered users in sidebar
- Click any user to open/switch conversations
- User info (name, email) displayed in list

## Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### For Production
- Change `NEXTAUTH_SECRET` to a secure random string
- Update `NEXTAUTH_URL` to your production domain
- Use a production-grade database (PostgreSQL, MySQL, etc.)

## Performance Optimizations

### SSR Support
- Landing page prerendered at build time
- Chat pages use server-side session verification
- API routes use server-side authentication checks

### Database Queries
- Indexed fields for fast lookups (conversationId, senderId)
- Efficient Prisma queries with proper includes/selects
- Proper cascade delete relationships

### Client-Side
- Debounced message polling
- Efficient React components
- Minimal re-renders with proper state management

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT session tokens
- ✅ Route middleware protection
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ CSRF protection (NextAuth default)
- ✅ HTTP-only session cookies
- ✅ XSS prevention (React default)

## Known Limitations & Future Enhancements

### Current Limitations
- Message polling every 2 seconds (client-side)
- No real-time WebSocket support yet
- Single-user sessions only
- No message editing/deletion

### Recommended Enhancements
1. **Real-time Messages**: Implement Socket.io for instant message delivery
2. **Message Features**: Add edit, delete, and emoji reactions
3. **Group Chats**: Enable conversations with multiple users
4. **File Sharing**: Support image and document uploads
5. **Push Notifications**: Alert users of new messages
6. **User Profiles**: Add profile pictures and status messages
7. **Search**: Find users and messages
8. **Typing Indicators**: Show when users are typing
9. **Read Receipts**: Display message delivery status
10. **Database Backups**: Scheduled database backups

## Development Tips

### Debugging
- Check browser console for client-side errors
- Check server logs in terminal
- Use Prisma Studio: `npx prisma studio`
- Check database: Open `prisma/dev.db` with SQLite viewer

### Testing
```bash
# Create test users
npm run dev
# Go to localhost:3000, create account
# Open incognito window, create another account
# Chat between the two accounts
```

### Prisma ORM Commands
```bash
# View database in UI
npx prisma studio

# Check schema status
npx prisma validate

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name description
```

## Troubleshooting

### "User already exists" error
- Each email must be unique
- Clear cookies and use different email for testing

### Messages not appearing
- Check browser console for errors
- Verify both users are in the same conversation
- Try refreshing the page

### Build errors
- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`
- Regenerate Prisma client: `npx prisma generate`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Database locked error
- Close any other connections to the database
- Restart the development server

## License

MIT - Feel free to use this project for learning and development.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review API response errors in browser console
3. Check Next.js and Prisma documentation
4. Examine terminal output for detailed error messages

---

**Happy Chatting!** 💬
