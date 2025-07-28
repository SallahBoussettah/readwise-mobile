import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types';
import { Theme } from '../theme';
import { searchBooks } from '../services/googleBooksService';
import BookCard from './BookCard';

interface AddBookViewProps {
  onAddBook: (book: Book) => void;
  existingBooks: Book[];
  theme: Theme;
}

const AddBookView: React.FC<AddBookViewProps> = ({
  onAddBook,
  existingBooks,
  theme
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setSearched(true);
    
    try {
      const books = await searchBooks(query);
      setResults(books);
    } catch (error) {
      console.error("Failed to search books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isBookAlreadyAdded = (bookId: string) => {
    return existingBooks.some(book => book.id === bookId);
  };

  const handleAddBook = (book: Book) => {
    if (!isBookAlreadyAdded(book.id)) {
      onAddBook(book);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Find Your Next Read</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Search for books by title or author.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search books..."
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: theme.primary }]}
          onPress={handleSearch}
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="search" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.results}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : searched && results.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No books found for "{query}". Try another search.
            </Text>
          </View>
        ) : results.length > 0 ? (
          results.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onAddBook={() => handleAddBook(book)}
              showAddButton={true}
              isAlreadyAdded={isBookAlreadyAdded(book.id)}
              theme={theme}
            />
          ))
        ) : (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Start by searching for a book above.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  results: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddBookView;