import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book, Quote } from '../types';
import { Theme } from '../theme';
import QuoteCard from './QuoteCard';

interface BookDetailViewProps {
  book: Book;
  quotes: Quote[];
  onAddQuote: (quote: Omit<Quote, 'id'>) => void;
  onBack: () => void;
  theme: Theme;
}

const BookDetailView: React.FC<BookDetailViewProps> = ({
  book,
  quotes,
  onAddQuote,
  onBack,
  theme
}) => {
  const [quoteText, setQuoteText] = useState('');
  const [tags, setTags] = useState('');

  const handleAddQuote = () => {
    if (!quoteText.trim()) return;

    const newQuote: Omit<Quote, 'id'> = {
      bookId: book.id,
      text: quoteText.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      dateAdded: new Date().toISOString(),
    };

    onAddQuote(newQuote);
    setQuoteText('');
    setTags('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={24} color={theme.primary} />
        <Text style={[styles.backText, { color: theme.primary }]}>Back to Bookshelf</Text>
      </TouchableOpacity>

      <View style={styles.bookInfo}>
        <Image source={{ uri: book.coverUrl }} style={styles.cover} />
        <View style={styles.bookDetails}>
          <Text style={[styles.title, { color: theme.text }]}>{book.title}</Text>
          <Text style={[styles.author, { color: theme.textSecondary }]}>
            {book.authors.join(', ')}
          </Text>
          {book.pageCount && (
            <Text style={[styles.pageCount, { color: theme.textMuted }]}>
              {book.pageCount} pages
            </Text>
          )}
        </View>
      </View>

      {book.description && (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {book.description}
          </Text>
        </View>
      )}

      <View style={styles.quotesSection}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderBottomColor: theme.border }]}>
          My Quotes
        </Text>

        <View style={[styles.addQuoteForm, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TextInput
            style={[styles.quoteInput, { color: theme.text, borderColor: theme.border }]}
            placeholder="Add a quote from this book..."
            placeholderTextColor={theme.textMuted}
            value={quoteText}
            onChangeText={setQuoteText}
            multiline
            numberOfLines={3}
          />
          <TextInput
            style={[styles.tagsInput, { color: theme.text, borderColor: theme.border }]}
            placeholder="Tags (comma separated)"
            placeholderTextColor={theme.textMuted}
            value={tags}
            onChangeText={setTags}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              { 
                backgroundColor: quoteText.trim() ? theme.primary : theme.textMuted,
                opacity: quoteText.trim() ? 1 : 0.5
              }
            ]}
            onPress={handleAddQuote}
            disabled={!quoteText.trim()}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Quote</Text>
          </TouchableOpacity>
        </View>

        {quotes.length > 0 ? (
          <View style={styles.quotesList}>
            {quotes.map(quote => (
              <QuoteCard key={quote.id} quote={quote} theme={theme} />
            ))}
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            You haven't added any quotes from this book yet.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bookInfo: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 16,
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    marginBottom: 8,
  },
  pageCount: {
    fontSize: 14,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  quotesSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingBottom: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  addQuoteForm: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  quoteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  tagsInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  quotesList: {
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default BookDetailView;