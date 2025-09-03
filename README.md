# StudyPath 📚

A modern, cross-platform mobile learning application built with React Native and Expo, designed to help students track their learning progress and manage their educational journey.

## ✨ Features

- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🎨 Modern UI**: Beautiful gradient designs with NativeWind (Tailwind CSS)
- **🔐 Authentication**: Secure user authentication with Supabase
- **📊 Progress Tracking**: Monitor your learning journey and achievements
- **🎯 Study Management**: Organize subjects, lessons, and study sessions
- **🏆 Rewards System**: Gamified learning experience
- **📱 Responsive Design**: Optimized for all screen sizes

## 🚀 Tech Stack

- **Frontend**: React Native with Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: React Context API
- **Type Safety**: TypeScript
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Expo

## 📱 Screenshots

_Screenshots will be added here_

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd StudyPath
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Fill in your Supabase credentials in the `.env` file:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on your preferred platform**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🏗️ Project Structure

```
src/
├── app/                    # Expo Router screens
│   ├── (tabs)/           # Tab navigation screens
│   │   ├── feed.tsx      # Main feed screen
│   │   ├── profile.tsx   # User profile
│   │   ├── rewards.tsx   # Rewards system
│   │   └── study/        # Study-related screens
│   ├── auth/             # Authentication screens
│   │   ├── login.tsx     # Login screen
│   │   └── signup.tsx    # Sign up screen
│   └── _layout.tsx       # Root layout
├── components/            # Reusable components
│   ├── AppText.tsx       # Custom text component
│   └── Button.tsx        # Button variants
├── contexts/              # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   └── DataContext.tsx   # App data management
├── lib/                   # External service configurations
│   ├── supabase.ts       # Supabase client setup
│   └── supabaseService.ts # Supabase service functions
├── config/                # Configuration files
│   └── env.ts            # Environment variables
└── utils/                 # Utility functions
    └── cn.ts             # Class name merging utility
```

## 🔧 Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

## 🎨 Styling

This project uses **NativeWind** (Tailwind CSS for React Native) for styling. The design system includes:

- **Color Palette**: Dark theme with cyan accents
- **Typography**: Consistent text sizing and weights
- **Components**: Pre-built button variants and form elements
- **Responsive**: Mobile-first responsive design

## 🔐 Authentication

Authentication is handled by Supabase with the following features:

- Email/password authentication
- User registration and login
- Secure session management
- Protected routes

## 📊 Database Schema

The app uses Supabase PostgreSQL with tables for:

- Users and profiles
- Subjects and lessons
- Study progress tracking
- Rewards and achievements

## 🚀 Deployment

### Expo Build

1. **Configure EAS Build**

   ```bash
   npx eas build:configure
   ```

2. **Build for production**

   ```bash
   # iOS
   npx eas build --platform ios

   # Android
   npx eas build --platform android
   ```

3. **Submit to app stores**
   ```bash
   npx eas submit --platform ios
   npx eas submit --platform android
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Styling with [NativeWind](https://www.nativewind.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons and design inspiration from the community

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the [Expo documentation](https://docs.expo.dev/)
- Review the [Supabase documentation](https://supabase.com/docs)

---

**Happy Learning! 🎓**
