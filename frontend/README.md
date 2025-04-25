# AI-Powered Content Creation Platform

A full-stack application for AI-powered content creation with user authentication, content management, and AI integration.

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── lib/          # Utility functions and configurations
│   │   └── pages/        # Page components
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── lib/         # Utility functions and configurations
    │   ├── routes/      # API routes
    │   └── index.ts     # Server entry point
    └── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key

## Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000  # Base URL for API and socket connection
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Backend (.env)

```
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in both client and server directories
   - Fill in the required environment variables

4. Start the development servers:

   ```bash
   # Start frontend (in client directory)
   npm run dev

   # Start backend (in server directory)
   npm run dev
   ```

## Features

- User authentication with Supabase
- Content creation with AI assistance
- Content management and organization
- Real-time updates
- Responsive design

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Content

- `GET /api/content` - Get all content for the authenticated user
- `POST /api/content` - Create new content
- `GET /api/content/:id` - Get specific content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### AI

- `POST /api/ai/generate` - Generate content using AI
- `POST /api/ai/improve` - Improve existing content using AI

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
