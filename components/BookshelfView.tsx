import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book, Shelf } from '../types';
import { Theme } from '../theme';
import BookCard from './BookCard';

interface BookshelfViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onUpdateShelf: (bookId: string, shelf: Shelf) => void;
  onDeleteBook: (bookId: string) => void;
  onGetSuggestions: () => void;
  theme: Theme;
}

const BookshelfView: React.FC<BookshelfViewProps> = ({
  books,
  onSelectBook,
  onUpdateShelf,
  onDeleteBook,
  onGetSuggestions,
  theme
}) => {
  const shelves = [Shelf.Reading, Shelf.WantToRead, Shelf.Finished];
  
  const booksByShelf = (shelf: Shelf) => books.filter(book => book.shelf === shelf);
  const finishedBooks = booksByShelf(Shelf.Finished);

  const renderShelf = (shelf: Shelf) => {
    const booksOnShelf = booksByShelf(shelf);
    
    return (
      <View key={shelf} style={styles.shelfSection}>
        <Text style={[styles.shelfTitle, { color: theme.text, borderBottomColor: theme.border }]}>
          {shelf}
        </Text>
        {booksOnShelf.length > 0 ? (
          booksOnShelf.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onPress={() => onSelectBook(book)}
              onUpdateShelf={(shelf) => onUpdateShelf(book.id, shelf)}
              onDeleteBook={() => onDeleteBook(book.id)}
              theme={theme}
            />
          ))
        ) : (
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            No books on this shelf yet.
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>My Bookshelf</Text>
        <TouchableOpacity
          style={[
            styles.suggestionsButton,
            { 
              backgroundColor: finishedBooks.length > 0 ? theme.primary : theme.textMuted,
              opacity: finishedBooks.length > 0 ? 1 : 0.5
            }
          ]}
          onPress={onGetSuggestions}
          disabled={finishedBooks.length === 0}
        >
          <Ionicons name="sparkles" size={16} color="white" />
          <Text style={styles.suggestionsButtonText}>Get Suggestions</Text>
        </TouchableOpacity>
      </View>

      {shelves.map(renderShelf)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  suggestionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  suggestionsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  shelfSection: {
    marginBottom: 32,
  },
  shelfTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default BookshelfView;