import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book, Shelf } from '../types';
import { Theme } from '../theme';
import ShelfSelector from './ShelfSelector';
import QuickShelfActions from './QuickShelfActions';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
  onAddBook?: () => void;
  onUpdateShelf?: (shelf: Shelf) => void;
  onDeleteBook?: () => void;
  showAddButton?: boolean;
  isAlreadyAdded?: boolean;
  theme: Theme;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onAddBook,
  onUpdateShelf,
  onDeleteBook,
  showAddButton = false,
  isAlreadyAdded = false,
  theme
}) => {
  const getShelfColor = (shelf: Shelf) => {
    switch (shelf) {
      case Shelf.Reading:
        return theme.warning;
      case Shelf.Finished:
        return theme.success;
      default:
        return theme.textMuted;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Image source={{ uri: book.coverUrl }} style={styles.cover} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[styles.author, { color: theme.textSecondary }]} numberOfLines={1}>
          {book.authors.join(', ')}
        </Text>
        
        {book.description && (
          <Text style={[styles.description, { color: theme.textMuted }]} numberOfLines={3}>
            {book.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          {!showAddButton && onUpdateShelf && (
            <View style={styles.shelfControls}>
              <ShelfSelector
                currentShelf={book.shelf}
                onShelfChange={(shelf) => onUpdateShelf(shelf)}
                theme={theme}
              />
              <QuickShelfActions
                currentShelf={book.shelf}
                onShelfChange={(shelf) => onUpdateShelf(shelf)}
                theme={theme}
              />
            </View>
          )}
          
          {!showAddButton && !onUpdateShelf && (
            <View style={[styles.shelfBadge, { backgroundColor: getShelfColor(book.shelf) + '20' }]}>
              <Text style={[styles.shelfText, { color: getShelfColor(book.shelf) }]}>
                {book.shelf}
              </Text>
            </View>
          )}
          
          {showAddButton && (
            <TouchableOpacity
              style={[
                styles.addButton,
                { 
                  backgroundColor: isAlreadyAdded ? theme.textMuted : theme.primary,
                  opacity: isAlreadyAdded ? 0.5 : 1
                }
              ]}
              onPress={onAddBook}
              disabled={isAlreadyAdded}
            >
              <Ionicons 
                name={isAlreadyAdded ? "checkmark" : "add"} 
                size={16} 
                color="white" 
              />
              <Text style={styles.addButtonText}>
                {isAlreadyAdded ? "Added" : "Add"}
              </Text>
            </TouchableOpacity>
          )}
          
          {onDeleteBook && (
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: theme.error + '20' }]}
              onPress={onDeleteBook}
            >
              <Ionicons name="trash" size={16} color={theme.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shelfControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shelfBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shelfText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 16,
  },
});

export default BookCard;