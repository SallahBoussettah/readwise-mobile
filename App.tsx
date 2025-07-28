import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Book, Quote, View as ViewType, Shelf } from './types';
import { lightTheme, darkTheme } from './theme';
import { storageService } from './services/storageService';
import Header from './components/Header';
import BookshelfView from './components/BookshelfView';
import AddBookView from './components/AddBookView';
import BookDetailView from './components/BookDetailView';
import SuggestionsModal from './components/SuggestionsModal';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.Bookshelf);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    storageService.saveDarkMode(darkMode);
  }, [darkMode]);

  useEffect(() => {
    storageService.saveBooks(books);
  }, [books]);

  useEffect(() => {
    storageService.saveQuotes(quotes);
  }, [quotes]);

  const loadData = async () => {
    try {
      const [loadedBooks, loadedQuotes, loadedDarkMode] = await Promise.all([
        storageService.loadBooks(),
        storageService.loadQuotes(),
        storageService.loadDarkMode()
      ]);
      
      setBooks(loadedBooks);
      setQuotes(loadedQuotes);
      setDarkMode(loadedDarkMode);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    navigateTo(ViewType.BookDetail);
  };

  const addBookToLibrary = (book: Book) => {
    if (!books.find(b => b.id === book.id)) {
      const newBookWithShelf = { ...book, shelf: Shelf.WantToRead };
      setBooks(prevBooks => [newBookWithShelf, ...prevBooks]);
      return true;
    }
    return false;
  };

  const handleAddBookAndNavigate = (book: Book) => {
    addBookToLibrary(book);
    navigateTo(ViewType.Bookshelf);
  };

  const deleteBook = (bookId: string) => {
    setBooks(prevBooks => prevBooks.filter(b => b.id !== bookId));
    setQuotes(prevQuotes => prevQuotes.filter(q => q.bookId !== bookId));
  };

  const updateBookShelf = (bookId: string, shelf: Shelf) => {
    setBooks(books.map(b => b.id === bookId ? { ...b, shelf } : b));
  };

  const addQuote = (quote: Omit<Quote, 'id'>) => {
    const newQuote: Quote = { ...quote, id: `q${Date.now()}` };
    setQuotes(prevQuotes => [newQuote, ...prevQuotes]);
  };

  const handleGetSuggestions = () => {
    setShowSuggestions(true);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewType.AddBook:
        return (
          <AddBookView 
            onAddBook={handleAddBookAndNavigate} 
            existingBooks={books}
            theme={theme}
          />
        );
      case ViewType.BookDetail:
        return selectedBook && (
          <BookDetailView 
            book={selectedBook} 
            quotes={quotes.filter(q => q.bookId === selectedBook.id)}
            onAddQuote={addQuote}
            onBack={() => navigateTo(ViewType.Bookshelf)}
            theme={theme}
          />
        );
      case ViewType.Bookshelf:
      default:
        return (
          <BookshelfView 
            books={books} 
            onSelectBook={handleSelectBook} 
            onUpdateShelf={updateBookShelf}
            onDeleteBook={deleteBook}
            onGetSuggestions={handleGetSuggestions}
            theme={theme}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={darkMode ? "light" : "dark"} />
        
        <Header 
          currentView={currentView}
          onNavigate={navigateTo}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          theme={theme}
        />
        
        {renderView()}

        <SuggestionsModal
          visible={showSuggestions}
          onClose={() => setShowSuggestions(false)}
          finishedBooks={books.filter(book => book.shelf === Shelf.Finished)}
          onAddSuggestedBook={addBookToLibrary}
          theme={theme}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
