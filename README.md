# Klip - Crypto Wallet & DeFi App

A premium fintech mobile app built with Expo and React Native, combining crypto wallet functionality, subscription management, DeFi features, and virtual debit cards.

## Features

- **Crypto Wallet**: Manage multiple crypto assets (SOL, ETH, BTC, USDC, POL)
- **Send & Receive**: Easy crypto transfers with QR codes
- **Token Swap**: Exchange tokens directly in-app
- **DeFi Integration**: Stake, lend, and earn yield
- **Subscription Tracking**: Monitor recurring payments
- **Virtual Debit Card**: Spend crypto anywhere Mastercard is accepted
- **Activity History**: Track all transactions

## Tech Stack

- **Framework**: Expo SDK 52 with React Native 0.76.5
- **Navigation**: Expo Router 4.x with tabs and stack
- **State Management**: Zustand
- **Animations**: React Native Reanimated 3.x
- **UI Components**: Custom design system with tokens
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo Go app on your phone (for development)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

1. Scan the QR code with Expo Go (Android) or Camera (iOS)
2. Or press `i` for iOS simulator / `a` for Android emulator

## Project Structure

```
├── app/                    # App routes (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home - wallet balance, assets
│   │   ├── cards.tsx      # Card management
│   │   ├── defi.tsx       # DeFi positions
│   │   ├── activity.tsx   # Transaction history
│   │   └── profile.tsx    # Settings
│   ├── asset/[id].tsx     # Asset detail screen
│   ├── send.tsx           # Send crypto modal
│   ├── receive.tsx        # Receive/QR modal
│   ├── swap.tsx           # Token swap modal
│   ├── withdraw.tsx       # Withdraw to fiat modal
│   ├── subscriptions.tsx  # Subscription management
│   └── card-onboarding.tsx # Debit card creation
├── components/
│   ├── ui/                # Base UI components
│   └── features/          # Feature-specific components
├── constants/
│   └── tokens.ts          # Design system tokens
├── data/
│   └── mock.ts            # Mock data
├── store/
│   └── wallet.ts          # Zustand store
└── types/
    └── index.ts           # TypeScript interfaces
```

## Design System

The app uses a custom design token system:

- **Colors**: Primary green (#4A7C59), dark surfaces, success/error states
- **Typography**: System fonts (SF Pro on iOS)
- **Spacing**: 4-64pt scale
- **Radii**: 4-24pt + full for pills
- **Shadows**: 4 elevation levels

## Scripts

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript check
```

## License

MIT
