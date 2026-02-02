# Life App

A mobile application for managing your schedule and finances in one place.

## Features

- 📅 **Calendar Integration** - Sync with Google Calendar and manage events
- 💰 **Expense Tracking** - Manual transaction entry with categories
- 📊 **Dashboard** - Overview of upcoming events and spending
- 🔐 **Secure Authentication** - Email/password with biometric support
- 🌙 **Dark Mode** - Easy on the eyes
- 📱 **iOS Ready** - Built for iOS 18+ with React Native

## Tech Stack

- **Framework**: React Native 0.83 + TypeScript
- **Navigation**: React Navigation v7
- **State Management**: Zustand with AsyncStorage persistence
- **Backend**: Firebase (Auth, Firestore) + Supabase (PostgreSQL)
- **UI**: React Native components with custom styling

## Getting Started

### Prerequisites

- Node.js >= 20
- Xcode 15+ (for iOS development)
- CocoaPods
- iOS Simulator or physical device (iOS 18+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kienmai98/Life.git
   cd Life
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```

3. **Configure Firebase** (Optional for MVP)
   - Copy `src/config/firebase.ts` and add your Firebase config
   - Or use the mock auth for testing

4. **Configure Supabase** (Optional for MVP)
   - Copy `src/config/supabase.ts` and add your Supabase credentials

5. **Configure Google Calendar** (Optional)
   - Copy `src/config/calendar.ts` and add your Google OAuth credentials

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Or run on specific device
npx react-native run-ios --device "Your Device Name"
```

### Sideloading on Physical Device (Free Dev Account)

1. Open `ios/LifeApp.xcworkspace` in Xcode
2. Select your device as the target
3. Go to Signing & Capabilities
4. Select your personal team
5. Update bundle identifier to something unique (e.g., `com.yourname.lifeapp`)
6. Build and run (⌘+R)

## Project Structure

```
src/
├── api/           # API clients
├── components/    # Reusable UI components
├── config/        # Configuration files
├── hooks/         # Custom React hooks
├── navigation/    # Navigation setup
├── screens/       # Screen components
│   ├── Auth/      # Login, Register
│   └── Main/      # Dashboard, Calendar, Transactions, Profile
├── stores/        # Zustand state management
├── types/         # TypeScript types
└── utils/         # Helper functions
```

## Current Status

### ✅ Implemented
- Authentication screens (Login/Register)
- Bottom tab navigation
- Dashboard with spending overview
- Calendar view with monthly grid
- Transaction list with filtering
- Add transaction screen
- Profile screen with settings
- Zustand stores with persistence
- Dark mode toggle

### 🚧 Coming Soon
- Firebase Auth integration
- Google Calendar OAuth
- Biometric authentication
- Camera for receipt scanning
- Push notifications
- Background sync
- In-app purchases
- Data export

## Contributing

This is a personal project. Feel free to fork and customize!

## License

MIT
