import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Quote } from '../types';
import { Theme } from '../theme';

interface QuoteCardProps {
    quote: Quote;
    theme: Theme;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, theme }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.quoteHeader}>
                <Ionicons name="chatbox-outline" size={20} color={theme.primary} />
                <Text style={[styles.date, { color: theme.textMuted }]}>
                    {formatDate(quote.dateAdded)}
                </Text>
            </View>

            <Text style={[styles.quoteText, { color: theme.text }]}>
                "{quote.text}"
            </Text>

            {quote.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {quote.tags.map((tag, index) => (
                        <View
                            key={index}
                            style={[styles.tag, { backgroundColor: theme.primary + '20' }]}
                        >
                            <Text style={[styles.tagText, { color: theme.primary }]}>
                                {tag}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quoteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    date: {
        fontSize: 12,
    },
    quoteText: {
        fontSize: 16,
        lineHeight: 24,
        fontStyle: 'italic',
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default QuoteCard;