import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shelf } from '../types';
import { Theme } from '../theme';

interface ShelfSelectorProps {
  currentShelf: Shelf;
  onShelfChange: (shelf: Shelf) => void;
  theme: Theme;
}

const ShelfSelector: React.FC<ShelfSelectorProps> = ({
  currentShelf,
  onShelfChange,
  theme
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const shelves = [
    { value: Shelf.WantToRead, label: 'Want to Read', icon: 'bookmark-outline' },
    { value: Shelf.Reading, label: 'Reading', icon: 'book-outline' },
    { value: Shelf.Finished, label: 'Finished', icon: 'checkmark-circle-outline' }
  ];

  const currentShelfData = shelves.find(shelf => shelf.value === currentShelf);

  const handleShelfSelect = (shelf: Shelf) => {
    onShelfChange(shelf);
    setIsVisible(false);
  };

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
    <>
      <TouchableOpacity
        style={[
          styles.shelfButton,
          { 
            backgroundColor: getShelfColor(currentShelf) + '20',
            borderColor: getShelfColor(currentShelf)
          }
        ]}
        onPress={() => setIsVisible(true)}
      >
        <Ionicons 
          name={currentShelfData?.icon as any} 
          size={14} 
          color={getShelfColor(currentShelf)} 
        />
        <Text style={[styles.shelfText, { color: getShelfColor(currentShelf) }]}>
          {currentShelf}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={14} 
          color={getShelfColor(currentShelf)} 
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Move to Shelf</Text>
            
            {shelves.map((shelf) => (
              <TouchableOpacity
                key={shelf.value}
                style={[
                  styles.shelfOption,
                  currentShelf === shelf.value && { backgroundColor: theme.primaryLight }
                ]}
                onPress={() => handleShelfSelect(shelf.value)}
              >
                <Ionicons 
                  name={shelf.icon as any} 
                  size={20} 
                  color={getShelfColor(shelf.value)} 
                />
                <Text style={[
                  styles.shelfOptionText,
                  { 
                    color: currentShelf === shelf.value ? theme.primary : theme.text,
                    fontWeight: currentShelf === shelf.value ? '600' : '400'
                  }
                ]}>
                  {shelf.label}
                </Text>
                {currentShelf === shelf.value && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  shelfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  shelfText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    minWidth: 250,
    maxWidth: 300,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  shelfOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
    gap: 12,
  },
  shelfOptionText: {
    flex: 1,
    fontSize: 16,
  },
});

export default ShelfSelector;