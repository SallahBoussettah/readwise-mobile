# ReadWise+ Mobile

A React Native mobile app for tracking your reading progress and collecting favorite quotes from books.

## Features

- 📚 **Book Management**: Search and add books to your personal library
- 📖 **Reading Progress**: Organize books into "Want to Read", "Reading", and "Finished" shelves
- 💭 **Quote Collection**: Save and tag your favorite quotes from books
- 🤖 **AI Suggestions**: Get personalized reading recommendations based on your finished books
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 💾 **Offline Storage**: All data is stored locally on your device

## Tech Stack

- **React Native** with TypeScript
- **Expo** for development and deployment
- **AsyncStorage** for local data persistence
- **Google Books API** for book search
- **Google Gemini AI** for reading suggestions
- **Expo Vector Icons** for UI icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your actual Gemini API key

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app on your device

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## Project Structure

```
ReadWiseMobile/
├── components/          # React Native components
│   ├── Header.tsx
│   ├── BookCard.tsx
│   ├── BookshelfView.tsx
│   ├── AddBookView.tsx
│   ├── BookDetailView.tsx
│   ├── QuoteCard.tsx
│   └── SuggestionsModal.tsx
├── services/           # API and storage services
│   ├── googleBooksService.ts
│   ├── geminiService.ts
│   └── storageService.ts
├── types.ts           # TypeScript type definitions
├── theme.ts           # Theme configuration
└── App.tsx           # Main app component
```

## API Configuration

### Google Books API
No API key required - uses the public Google Books API.

### Gemini AI API
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy `.env.example` to `.env`
3. Add your API key to the `.env` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

**Important**: Never commit your `.env` file to version control. It's already added to `.gitignore`.

## Building for Production

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both iOS and Android
5. Submit a pull request

## License

MIT License - see LICENSE file for details