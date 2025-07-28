import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View as ViewType } from '../types';
import { Theme } from '../theme';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onNavigate, 
  darkMode, 
  toggleDarkMode, 
  theme 
}) => {
  return (
    <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <TouchableOpacity 
        style={styles.titleContainer}
        onPress={() => onNavigate(ViewType.Bookshelf)}
      >
        <Ionicons name="book" size={24} color={theme.primary} />
        <Text style={[styles.title, { color: theme.text }]}>ReadWise+</Text>
      </TouchableOpacity>
      
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentView === ViewType.Bookshelf && { backgroundColor: theme.primaryLight }
          ]}
          onPress={() => onNavigate(ViewType.Bookshelf)}
        >
          <Text style={[
            styles.navText,
            { color: currentView === ViewType.Bookshelf ? theme.primary : theme.textSecondary }
          ]}>
            Bookshelf
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.iconButton,
            currentView === ViewType.AddBook && { backgroundColor: theme.primaryLight }
          ]}
          onPress={() => onNavigate(ViewType.AddBook)}
        >
          <Ionicons 
            name="add" 
            size={24} 
            color={currentView === ViewType.AddBook ? theme.primary : theme.textSecondary} 
          />
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={toggleDarkMode}
        >
          <Ionicons 
            name={darkMode ? "sunny" : "moon"} 
            size={24} 
            color={theme.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconButton: {
    padding: 8,
    borderRadius: 6,
  },
  divider: {
    width: 1,
    height: 24,
  },
});

export default Header;