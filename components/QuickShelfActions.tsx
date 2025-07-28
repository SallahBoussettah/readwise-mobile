import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shelf } from '../types';
import { Theme } from '../theme';

interface QuickShelfActionsProps {
  currentShelf: Shelf;
  onShelfChange: (shelf: Shelf) => void;
  theme: Theme;
}

const QuickShelfActions: React.FC<QuickShelfActionsProps> = ({
  currentShelf,
  onShelfChange,
  theme
}) => {
  const getNextShelf = () => {
    switch (currentShelf) {
      case Shelf.WantToRead:
        return Shelf.Reading;
      case Shelf.Reading:
        return Shelf.Finished;
      case Shelf.Finished:
        return Shelf.WantToRead;
      default:
        return Shelf.Reading;
    }
  };

  const getActionIcon = () => {
    switch (currentShelf) {
      case Shelf.WantToRead:
        return 'play-circle-outline'; // Start reading
      case Shelf.Reading:
        return 'checkmark-circle-outline'; // Mark as finished
      case Shelf.Finished:
        return 'refresh-circle-outline'; // Read again
      default:
        return 'play-circle-outline';
    }
  };

  const getActionColor = () => {
    switch (currentShelf) {
      case Shelf.WantToRead:
        return theme.warning;
      case Shelf.Reading:
        return theme.success;
      case Shelf.Finished:
        return theme.primary;
      default:
        return theme.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.quickAction, { backgroundColor: getActionColor() + '20' }]}
      onPress={() => onShelfChange(getNextShelf())}
    >
      <Ionicons 
        name={getActionIcon() as any} 
        size={16} 
        color={getActionColor()} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  quickAction: {
    padding: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
});

export default QuickShelfActions;