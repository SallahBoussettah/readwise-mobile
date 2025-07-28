import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Switch,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme';
import { storageService } from '../services/storageService';

interface SettingsViewProps {
    theme: Theme;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
    theme,
    darkMode,
    onToggleDarkMode
}) => {
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setSaving] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    useEffect(() => {
        loadApiKey();
    }, []);

    const loadApiKey = async () => {
        try {
            const savedApiKey = await storageService.loadApiKey();
            if (savedApiKey) {
                setApiKey(savedApiKey);
            }
        } catch (error) {
            console.error('Error loading API key:', error);
        }
    };

    const handleSaveApiKey = async () => {
        if (!apiKey.trim()) {
            Alert.alert('Error', 'Please enter a valid API key');
            return;
        }

        setSaving(true);
        try {
            await storageService.saveApiKey(apiKey.trim());
            Alert.alert('Success', 'API key saved successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save API key');
            console.error('Error saving API key:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleClearApiKey = () => {
        Alert.alert(
            'Clear API Key',
            'Are you sure you want to clear your API key? This will disable AI suggestions.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await storageService.saveApiKey('');
                            setApiKey('');
                            Alert.alert('Success', 'API key cleared');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear API key');
                        }
                    }
                }
            ]
        );
    };

    const maskApiKey = (key: string) => {
        if (key.length <= 8) return key;
        return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

                {/* Theme Section */}
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Ionicons
                                name={darkMode ? "moon" : "sunny"}
                                size={20}
                                color={theme.primary}
                            />
                            <Text style={[styles.settingLabel, { color: theme.text }]}>
                                Dark Mode
                            </Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={onToggleDarkMode}
                            trackColor={{ false: theme.border, true: theme.primary + '40' }}
                            thumbColor={darkMode ? theme.primary : theme.textMuted}
                        />
                    </View>
                </View>

                {/* API Key Section */}
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>AI Suggestions</Text>

                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        Enter your Gemini API key to enable personalized reading suggestions based on your finished books.
                    </Text>

                    <View style={styles.apiKeyContainer}>
                        <View style={[styles.inputContainer, { borderColor: theme.border }]}>
                            <Ionicons name="key" size={20} color={theme.textMuted} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Enter your Gemini API key"
                                placeholderTextColor={theme.textMuted}
                                value={showApiKey ? apiKey : maskApiKey(apiKey)}
                                onChangeText={setApiKey}
                                secureTextEntry={!showApiKey}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={() => setShowApiKey(!showApiKey)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showApiKey ? "eye-off" : "eye"}
                                    size={20}
                                    color={theme.textMuted}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    {
                                        backgroundColor: theme.primary,
                                        opacity: isLoading ? 0.6 : 1
                                    }
                                ]}
                                onPress={handleSaveApiKey}
                                disabled={isLoading}
                            >
                                <Ionicons name="save" size={16} color="white" />
                                <Text style={styles.saveButtonText}>
                                    {isLoading ? 'Saving...' : 'Save'}
                                </Text>
                            </TouchableOpacity>

                            {apiKey.length > 0 && (
                                <TouchableOpacity
                                    style={[styles.clearButton, { backgroundColor: theme.error + '20' }]}
                                    onPress={handleClearApiKey}
                                >
                                    <Ionicons name="trash" size={16} color={theme.error} />
                                    <Text style={[styles.clearButtonText, { color: theme.error }]}>
                                        Clear
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View style={[styles.infoBox, { backgroundColor: theme.primaryLight }]}>
                        <Ionicons name="information-circle" size={16} color={theme.primary} />
                        <Text style={[styles.infoText, { color: theme.primary }]}>
                            Get your free API key from{' '}
                            <Text style={styles.linkText}>Google AI Studio</Text>
                        </Text>
                    </View>
                </View>

                {/* App Info Section */}
                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Version</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>1.0.0</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>App Name</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>ReadWise+</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    section: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        fontSize: 16,
    },
    apiKeyContainer: {
        gap: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    eyeButton: {
        padding: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    saveButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 6,
    },
    clearButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
        marginTop: 8,
    },
    infoText: {
        fontSize: 12,
        flex: 1,
    },
    linkText: {
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default SettingsView;