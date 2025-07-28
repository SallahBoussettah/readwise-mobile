import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types';
import { Theme } from '../theme';
import { getReadingSuggestions } from '../services/geminiService';
import { searchBooks } from '../services/googleBooksService';

interface SuggestionsModalProps {
  visible: boolean;
  onClose: () => void;
  finishedBooks: Book[];
  onAddSuggestedBook: (book: Book) => boolean;
  theme: Theme;
}

interface Suggestion {
  title: string;
  author: string;
  reason: string;
}

const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  visible,
  onClose,
  finishedBooks,
  onAddSuggestedBook,
  theme
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && finishedBooks.length > 0) {
      fetchSuggestions();
    }
  }, [visible, finishedBooks]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getReadingSuggestions(finishedBooks);
      const parsedSuggestions = JSON.parse(response);
      setSuggestions(parsedSuggestions);
    } catch (err) {
      setError('Failed to get suggestions. Please try again.');
      console.error('Error fetching suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestion = async (suggestion: Suggestion) => {
    try {
      const searchResults = await searchBooks(`${suggestion.title} ${suggestion.author}`);
      if (searchResults.length > 0) {
        const added = onAddSuggestedBook(searchResults[0]);
        if (added) {
          // You could show a success message here
        }
      }
    } catch (error) {
      console.error('Error adding suggested book:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Reading Suggestions</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                Getting personalized suggestions...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
              <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: theme.primary }]}
                onPress={fetchSuggestions}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            suggestions.map((suggestion, index) => (
              <View 
                key={index} 
                style={[styles.suggestionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Text style={[styles.suggestionTitle, { color: theme.text }]}>
                  {suggestion.title}
                </Text>
                <Text style={[styles.suggestionAuthor, { color: theme.textSecondary }]}>
                  by {suggestion.author}
                </Text>
                <Text style={[styles.suggestionReason, { color: theme.textSecondary }]}>
                  {suggestion.reason}
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.primary }]}
                  onPress={() => handleAddSuggestion(suggestion)}
                >
                  <Ionicons name="add" size={16} color="white" />
                  <Text style={styles.addButtonText}>Add to Library</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  suggestionCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  suggestionAuthor: {
    fontSize: 16,
    marginBottom: 12,
  },
  suggestionReason: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SuggestionsModal;