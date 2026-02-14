# Chat Application - API Documentation

## Overview
Complete REST API for the chat application. All endpoints require authentication unless otherwise specified.

## Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

### 1. Register User
Create a new user account.

**Endpoint**: `POST /auth/register`

**Access**: Public (no authentication required)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response** (201):
```json
{
  "user": {
    "id": "cuid123",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses**:
- 400: Missing required fields
- 400: User already exists
- 500: Internal server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 2. Login
Authenticate with email and password (handled by NextAuth).

**Endpoint**: `POST /auth/callback/credentials`

**Access**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Note**: Login is typically done via NextAuth session routes. See NextAuth documentation.

---

## User Endpoints

### 3. Get All Users
Fetch list of all users except the current authenticated user.

**Endpoint**: `GET /users`

**Access**: Authenticated (requires valid session)

**Query Parameters**: None

**Success Response** (200):
```json
{
  "users": [
    {
      "id": "cuid456",
      "email": "jane@example.com",
      "name": "Jane Smith",
      "createdAt": "2024-02-12T10:30:00Z"
    },
    {
      "id": "cuid789",
      "email": "bob@example.com",
      "name": "Bob Johnson",
      "createdAt": "2024-02-12T11:15:00Z"
    }
  ]
}
```

**Error Responses**:
- 401: Unauthorized (no valid session)
- 500: Internal server error

**Example**:
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Cookie: <session-cookie>"
```

---

## Conversation Endpoints

### 4. Create/Get Conversation
Create a new one-on-one conversation or retrieve existing one.

**Endpoint**: `POST /conversations`

**Access**: Authenticated

**Request Body**:
```json
{
  "otherUserId": "cuid456"
}
```

**Success Response** (200):
```json
{
  "conversation": {
    "id": "conv123",
    "participants": [
      {
        "id": "cuid123",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": "cuid456",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ]
  }
}
```

**Logic**:
- If conversation exists between the two users, returns existing conversation
- If no conversation exists, creates new one
- Always returns the conversation (newly created or existing)

**Error Responses**:
- 400: Missing otherUserId
- 401: Unauthorized
- 404: Other user not found
- 500: Internal server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{"otherUserId": "cuid456"}'
```

---

### 5. Get Conversations (Future Enhancement)
Retrieve all conversations for authenticated user.

**Endpoint**: `GET /conversations`

**Access**: Authenticated

**Status**: Not fully implemented (extensible)

---

## Message Endpoints

### 6. Get Messages
Fetch all messages for a specific conversation.

**Endpoint**: `GET /messages`

**Access**: Authenticated

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| conversationId | string | Yes | The conversation ID |

**Success Response** (200):
```json
{
  "messages": [
    {
      "id": "msg001",
      "content": "Hi there!",
      "createdAt": "2024-02-12T10:30:00Z",
      "sender": {
        "id": "cuid123",
        "name": "John Doe",
        "email": "john@example.com"
      }
    },
    {
      "id": "msg002",
      "content": "How are you?",
      "createdAt": "2024-02-12T10:31:00Z",
      "sender": {
        "id": "cuid456",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  ]
}
```

**Security**: Only participants of the conversation can fetch messages (verified server-side).

**Error Responses**:
- 400: Missing conversationId
- 401: Unauthorized
- 403: Forbidden (not a participant)
- 500: Internal server error

**Example**:
```bash
curl -X GET "http://localhost:3000/api/messages?conversationId=conv123" \
  -H "Cookie: <session-cookie>"
```

---

### 7. Send Message
Send a new message to a conversation.

**Endpoint**: `POST /messages`

**Access**: Authenticated

**Request Body**:
```json
{
  "conversationId": "conv123",
  "content": "Hello! How are you doing?"
}
```

**Success Response** (201):
```json
{
  "message": {
    "id": "msg003",
    "content": "Hello! How are you doing?",
    "createdAt": "2024-02-12T10:32:00Z",
    "sender": {
      "id": "cuid123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Side Effects**:
- Message is saved to database
- Conversation's `updatedAt` timestamp is updated
- New conversation created automatically if needed

**Validation**:
- User must be a participant in the conversation (verified server-side)
- Message content cannot be empty
- Content is trimmed of whitespace

**Error Responses**:
- 400: Missing conversationId or content
- 401: Unauthorized
- 403: Forbidden (not a participant)
- 500: Internal server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{
    "conversationId": "conv123",
    "content": "Hello there!"
  }'
```

---

## Authentication Flow

### Session Management
- **Method**: JWT (JSON Web Tokens)
- **Storage**: HTTP-only cookies (secure)
- **Validation**: NextAuth.js
- **Required**: All endpoints except `/auth/register`

### Getting a Session
```javascript
// In a React component (client-side)
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session } = useSession();
  console.log(session.user.id); // Current user ID
  console.log(session.user.email);
  console.log(session.user.name);
}
```

### Server-Side Authentication
```typescript
// In API route handlers
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  const userId = session.user.id;
  // ... use userId for queries
}
```

---

## Data Models

### User Model
```typescript
interface User {
  id: string;              // Unique identifier (CUID)
  email: string;           // Unique email
  password: string;        // Hashed with bcryptjs
  name: string;            // Display name
  createdAt: Date;         // Account creation time
  updatedAt: Date;         // Last update time
}
```

### Conversation Model
```typescript
interface Conversation {
  id: string;              // Unique identifier
  participants: User[];    // 2+ users in conversation
  messages: Message[];     // All messages
  createdAt: Date;         // Creation time
  updatedAt: Date;         // Last message time
}
```

### Message Model
```typescript
interface Message {
  id: string;              // Unique identifier
  content: string;         // Message text
  senderId: string;        // Message author
  sender: User;            // Sender details
  conversationId: string;  // Parent conversation
  conversation: Conversation; // Full conversation data
  createdAt: Date;         // Send time
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes
| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successfully retrieved data |
| 201 | Created | Message/conversation created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | No valid session |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | User or resource not found |
| 500 | Internal Server Error | Database or server error |

---

## Rate Limiting
Currently: **No rate limiting** implemented

**Recommendations for production**:
- Implement rate limiting per user
- Use middleware like `express-rate-limit`
- Limit: 100 requests per minute per user

---

## Security Features

✅ **Implemented**:
- Password hashing with bcryptjs
- HTTP-only session cookies
- CSRF protection (NextAuth.js default)
- SQL injection prevention (Prisma ORM)
- XSS protection (React default)
- Server-side permission checks

⚠️ **Consider adding**:
- Rate limiting per endpoint
- Request validation with Joi/Zod
- API key for third-party integrations
- Webhook signing for events

---

## Testing the API

### Using cURL
```bash
# 1. Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# 2. Get users (after login)
curl -X GET http://localhost:3000/api/users \
  -H "Cookie: <your-session-cookie>"

# 3. Create conversation
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{"otherUserId":"userId"}'

# 4. Send message
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Cookie: <session-cookie>" \
  -d '{"conversationId":"convId","content":"Hello!"}'

# 5. Fetch messages
curl -X GET "http://localhost:3000/api/messages?conversationId=convId" \
  -H "Cookie: <session-cookie>"
```

### Using JavaScript Fetch
```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    password: 'password123'
  })
});

// Send message
const msgResponse = await fetch('/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationId: 'conv123',
    content: 'Hello!'
  })
});
```

---

## Future Enhancements

### Short Term
- [ ] Message editing endpoints
- [ ] Message deletion endpoints
- [ ] User profile endpoints
- [ ] Search users/messages

### Medium Term
- [ ] WebSocket support for real-time messaging
- [ ] Message reactions/emojis
- [ ] Voice/video call integration
- [ ] File upload support
- [ ] Rate limiting

### Long Term
- [ ] Group conversations
- [ ] Message encryption
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Push notifications

---

## Support
For API issues:
1. Check error message and status code
2. Verify authentication session exists
3. Check request body format
4. Review examples above
5. Check browser console and server logs
