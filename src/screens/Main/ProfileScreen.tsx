import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import {
  Text,
  List,
  Switch,
  Divider,
  Button,
  Avatar,
  useTheme,
  Surface,
  Dialog,
  Portal,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useTransactionStore } from '../../stores/transactionStore';
import storage from '../../utils/storage';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, logout, updateSettings } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { syncTransactions, syncStatus } = useTransactionStore();

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const biometric = await storage.getBiometricEnabled();
    setBiometricEnabled(biometric);
  };

  const handleToggleBiometric = async (value: boolean) => {
    setBiometricEnabled(value);
    await storage.setBiometricEnabled(value);
    await updateSettings({ biometricEnabled: value });
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await updateSettings({ notificationsEnabled: value });
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await syncTransactions(user.id);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    setLogoutDialogVisible(false);
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleOpenPrivacyPolicy = () => {
    Linking.openURL('https://life-app.example.com/privacy');
  };

  const handleOpenTerms = () => {
    Linking.openURL('https://life-app.example.com/terms');
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@life-app.example.com');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Surface style={styles.profileHeader} elevation={0}>
          <Avatar.Text
            size={80}
            label={(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
            style={{ backgroundColor: theme.colors.primary, marginBottom: 16 }}
          />
          <Text variant="headlineSmall" style={{ fontWeight: '600' }}>
            {user?.displayName || 'User'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {user?.email}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            Signed in with {user?.provider === 'email' ? 'Email' : capitalizeFirst(user?.provider || '')}
          </Text>
        </Surface>

        <Divider style={styles.divider} />

        {/* Preferences Section */}
        <List.Section title="Preferences">
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark themes"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch value={isDarkMode} onValueChange={handleToggleTheme} />
            )}
          />

          <List.Item
            title="Biometric Authentication"
            description="Use Face ID or Touch ID to unlock"
            left={(props) => <List.Icon {...props} icon="fingerprint" />}
            right={() => (
              <Switch value={biometricEnabled} onValueChange={handleToggleBiometric} />
            )}
          />

          <List.Item
            title="Push Notifications"
            description="Receive reminders and alerts"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
              />
            )}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* Data Section */}
        <List.Section title="Data">
          <List.Item
            title="Sync Now"
            description={
              syncStatus.lastSync
                ? `Last synced: ${new Date(syncStatus.lastSync).toLocaleString()}`
                : 'Sync your data with the cloud'
            }
            left={(props) => <List.Icon {...props} icon="sync" />}
            right={() =>
              isSyncing ? (
                <ActivityIndicator size="small" />
              ) : syncStatus.pendingChanges > 0 ? (
                <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                  {syncStatus.pendingChanges} pending
                </Text>
              ) : null
            }
            onPress={handleSync}
          />

          <List.Item
            title="Google Calendar"
            description="Manage calendar integration"
            left={(props) => <List.Icon {...props} icon="calendar-sync" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              // Navigate to calendar settings
            }}
          />

          <List.Item
            title="Export Data"
            description="Download your data as CSV"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              // Export data functionality
            }}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* About Section */}
        <List.Section title="About">
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="open-in-new" />}
            onPress={handleOpenPrivacyPolicy}
          />

          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="open-in-new" />}
            onPress={handleOpenTerms}
          />

          <List.Item
            title="Contact Support"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="open-in-new" />}
            onPress={handleContactSupport}
          />

          <List.Item
            title="App Version"
            description="1.0.0 (Build 1)"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {/* Sign Out */}
        <Button
          mode="outlined"
          onPress={() => setLogoutDialogVisible(true)}
          style={styles.signOutButton}
          textColor={theme.colors.error}
        >
          Sign Out
        </Button>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <Portal>
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Title>Sign Out?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to sign out? Your data will remain on this device.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleLogout} textColor={theme.colors.error}>
              Sign Out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 32,
  },
  divider: {
    marginHorizontal: 16,
  },
  signOutButton: {
    margin: 16,
    marginTop: 8,
  },
  bottomPadding: {
    height: 32,
  },
});

export default ProfileScreen;
