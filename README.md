# Life App

A React Native application for managing your schedule and spending. Built for busy people who want to improve their life quality.

## Features (MVP)

- **Authentication**: Email/Password, Google Sign-In, Apple Sign-In
- **Biometric Authentication**: Face ID / Touch ID support
- **Schedule Management**: Google Calendar integration
- **Expense Tracking**: Manual transaction entry with categories
  - Amount, description, category, date
  - Optional receipt photo attachment
  - Optional notes
- **Dashboard**: Overview of schedule and spending
- **Push Notifications**: Firebase Cloud Messaging
- **Offline Support**: Background sync with AsyncStorage
- **Dark Mode**: Full theming support

## Coming Soon (Premium Features)

- CSV import for transactions
- Bank API integration
- Advanced analytics and insights
- Budget planning tools
- Recurring transactions

## Tech Stack

- React Native 0.83+
- TypeScript
- React Navigation (Native Stack + Bottom Tabs)
- Zustand (State Management)
- Firebase (Auth, Firestore, Messaging)
- Supabase (PostgreSQL)
- React Native Paper (UI)

## Prerequisites

- Node.js >= 20
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)
- Firebase project
- Supabase project

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kienmai98/Life.git
cd Life
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

4. Create `.env` file from template:
```bash
cp .env.example .env
```

5. Fill in your environment variables in `.env`

## Configuration

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Add iOS and Android apps
3. Download `GoogleService-Info.plist` (iOS) and `google-services.json` (Android)
4. Place them in respective platform folders:
   - iOS: `ios/LifeApp/GoogleService-Info.plist`
   - Android: `android/app/google-services.json`
5. Enable Authentication methods (Email/Password, Google, Apple)
6. Enable Firestore and Cloud Messaging

### Supabase Setup

1. Create a project at https://app.supabase.io/
2. Create the following tables:

**users**
```sql
create table users (
  id uuid primary key,
  email text not null,
  display_name text,
  photo_url text,
  provider text,
  settings jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

**transactions**
```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  amount decimal not null,
  currency text default 'USD',
  category text not null,
  description text not null,
  date timestamp with time zone not null,
  type text not null,
  payment_method text not null,
  receipt_url text,
  location jsonb,
  tags text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  synced boolean default false
);
```

3. Copy your Supabase URL and anon key to `.env`

### Google Calendar OAuth Setup

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs
4. Enable Google Calendar API
5. Add OAuth client IDs to `.env`

### Apple Sign-In Setup (iOS)

1. Go to Apple Developer Portal
2. Enable "Sign in with Apple" capability
3. Configure in Xcode project settings

## Running the App

### iOS
```bash
npm run ios
# or
npx react-native run-ios
```

### Android
```bash
npm run android
# or
npx react-native run-android
```

## Project Structure

```
src/
  api/          # API clients (Firebase, Supabase, Google Calendar)
  components/   # Reusable UI components
  config/       # Configuration files
  hooks/        # Custom React hooks
  navigation/   # Navigation configuration
  screens/      # Screen components
    Auth/       # Login, Register, BiometricSetup
    Main/       # Dashboard, Calendar, Transactions, Profile
  stores/       # Zustand stores
  types/        # TypeScript types
  utils/        # Helper functions
```

## License

MIT
