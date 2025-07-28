import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, Quote } from '../types';

const BOOKS_KEY = 'readwise_books';
const QUOTES_KEY = 'readwise_quotes';
const DARK_MODE_KEY = 'readwise_dark_mode';

export const storageService = {
  // Books
  async saveBooks(books: Book[]): Promise<void> {
    try {
      await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    } catch (error) {
      console.error('Error saving books:', error);
    }
  },

  async loadBooks(): Promise<Book[]> {
    try {
      const booksJson = await AsyncStorage.getItem(BOOKS_KEY);
      return booksJson ? JSON.parse(booksJson) : [];
    } catch (error) {
      console.error('Error loading books:', error);
      return [];
    }
  },

  // Quotes
  async saveQuotes(quotes: Quote[]): Promise<void> {
    try {
      await AsyncStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
    } catch (error) {
      console.error('Error saving quotes:', error);
    }
  },

  async loadQuotes(): Promise<Quote[]> {
    try {
      const quotesJson = await AsyncStorage.getItem(QUOTES_KEY);
      return quotesJson ? JSON.parse(quotesJson) : [];
    } catch (error) {
      console.error('Error loading quotes:', error);
      return [];
    }
  },

  // Dark mode
  async saveDarkMode(isDark: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  },

  async loadDarkMode(): Promise<boolean> {
    try {
      const darkModeJson = await AsyncStorage.getItem(DARK_MODE_KEY);
      return darkModeJson ? JSON.parse(darkModeJson) : false;
    } catch (error) {
      console.error('Error loading dark mode:', error);
      return false;
    }
  }
};