# StudyPath Admin Panel

A modern, dark-themed admin panel for managing the StudyPath learning platform. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎨 **Modern Dark Theme** - Beautiful dark UI matching the mobile app
- 🔐 **Authentication** - Secure login system with Supabase
- 📊 **Dashboard** - Overview of platform statistics and quick actions
- ❓ **MCQ Management** - Create, edit, and manage multiple choice questions
- 📚 **Content Management** - Manage subjects, chapters, and lessons
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Real-time Updates** - Live data from Supabase

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom Components
- **Backend**: Supabase (Database + Auth)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+ and npm
- Supabase project with the following tables:
  - `users`
  - `subjects`
  - `chapters`
  - `lessons`
  - `mcqs`

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd web
npm install
```

### 2. Environment Configuration

Copy the environment example file and fill in your Supabase credentials:

```bash
cp env.example .env
```

Edit `.env` with your Supabase project details:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Database Setup

Ensure your Supabase database has the required tables. You can use the SQL schema from the mobile app project.

### 4. Create Admin User

In your Supabase dashboard:

1. Go to Authentication > Users
2. Create a new user with admin privileges
3. Use these credentials to log into the admin panel

### 5. Run the Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173`

## Usage

### Login

- Navigate to `/login`
- Use your admin credentials
- You'll be redirected to the dashboard after successful login

### Dashboard

- Overview of platform statistics
- Quick action buttons for common tasks
- Recent activity feed

### MCQ Management

- Create new multiple choice questions
- Edit existing questions
- Set difficulty levels
- Add explanations
- Organize by chapters and subjects

### Navigation

- Use the sidebar to navigate between different sections
- Mobile-responsive design with collapsible sidebar

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # Authentication component
│   ├── AdminLayout.tsx # Main layout with sidebar
│   ├── Dashboard.tsx   # Dashboard overview
│   └── MCQManager.tsx  # MCQ management interface
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── lib/               # Utility libraries
│   ├── supabase.ts    # Supabase client configuration
│   └── supabaseService.ts # API service layer
└── App.tsx            # Main application component
```

## Customization

### Colors and Theme

The dark theme colors are defined in `tailwind.config.js` and `src/index.css`. You can customize:

- Primary colors
- Dark theme shades
- Accent colors
- Custom animations

### Components

All components use Tailwind CSS classes and can be easily customized by modifying the className props.

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

The build output in the `dist` folder can be deployed to any static hosting service.

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env` file is in the root directory
   - Restart the development server after adding environment variables

2. **Supabase Connection Issues**
   - Verify your Supabase URL and anon key
   - Check if your Supabase project is active
   - Ensure RLS policies allow admin access

3. **Authentication Problems**
   - Check if the user exists in Supabase
   - Verify email/password combination
   - Check browser console for error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the StudyPath learning platform.

## Support

For support and questions, please refer to the main StudyPath project documentation.
