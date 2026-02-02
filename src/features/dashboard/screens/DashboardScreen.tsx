import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, useTheme, Avatar, ProgressBar, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../../auth/stores/authStore';
import { useTransactionStore } from '../../transactions/stores/transactionStore';
import { useCalendarStore } from '../../calendar/stores/calendarStore';
import { formatCurrency, formatDate, formatTime, isEventToday } from '../../../shared/utils/helpers';

const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useAuthStore();
  const { 
    spendingSummary, 
    fetchSpendingSummary, 
    syncStatus,
    syncTransactions 
  } = useTransactionStore();
  const { scheduleSummary, fetchEvents, refreshScheduleSummary } = useCalendarStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (user) {
      fetchSpendingSummary(user.id);
      refreshScheduleSummary();
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchSpendingSummary(user.id);
        refreshScheduleSummary();
      }
    }, [user])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await Promise.all([
        fetchSpendingSummary(user.id),
        fetchEvents(),
      ]);
    }
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {getGreeting()}
            </Text>
            <Text variant="headlineSmall" style={{ fontWeight: '600' }}>
              {user?.displayName || user?.email?.split('@')[0] || 'Guest'}
            </Text>
          </View>
          <Avatar.Text
            size={48}
            label={(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
            style={{ backgroundColor: theme.colors.primary }}
          />
        </View>

        {/* Spending Summary Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              This Month's Spending
            </Text>
            
            <Text variant="headlineLarge" style={[styles.balance, { color: theme.colors.primary }]}>
              {formatCurrency(spendingSummary?.balance || 0)}
            </Text>
            
            <View style={styles.spendingRow}>
              <View style={styles.spendingItem}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Income
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
                  {formatCurrency(spendingSummary?.totalIncome || 0)}
                </Text>
              </View>
              
              <View style={styles.spendingItem}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Expenses
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.error }}>
                  {formatCurrency(spendingSummary?.totalExpenses || 0)}
                </Text>
              </View>
            </View>

            {/* Category Breakdown */}
            {spendingSummary?.byCategory && Object.keys(spendingSummary.byCategory).length > 0 && (
              <View style={styles.categories}>
                <Divider style={styles.divider} />
                <Text variant="bodyMedium" style={{ marginBottom: 12 }}>By Category</Text>
                {Object.entries(spendingSummary.byCategory)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 3)
                  .map(([category, amount]) => {
                    const total = spendingSummary.totalExpenses || 1;
                    const percentage = ((amount as number) / total) * 100;
                    return (
                      <View key={category} style={styles.categoryItem}>
                        <View style={styles.categoryHeader}>
                          <Text variant="bodySmall" style={styles.categoryName}>
                            {(category as string).charAt(0).toUpperCase() + (category as string).slice(1)}
                          </Text>
                          <Text variant="bodySmall">
                            {formatCurrency(amount as number)}
                          </Text>
                        </View>
                        <ProgressBar
                          progress={percentage / 100}
                          color={theme.colors.primary}
                          style={styles.progressBar}
                        />
                      </View>
                    );
                  })}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Schedule Summary Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Today's Schedule
            </Text>
            
            <View style={styles.scheduleStats}>
              <Surface style={styles.statItem} elevation={0}>
                <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                  {scheduleSummary?.eventsToday || 0}
                </Text>
                <Text variant="bodySmall">Events Today</Text>
              </Surface>
              
              <Surface style={styles.statItem} elevation={0}>
                <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
                  {scheduleSummary?.eventsThisWeek || 0}
                </Text>
                <Text variant="bodySmall">This Week</Text>
              </Surface>
              
              <Surface style={styles.statItem} elevation={0}>
                <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>
                  {Math.round(scheduleSummary?.freeHoursToday || 0)}
                </Text>
                <Text variant="bodySmall">Free Hours</Text>
              </Surface>
            </View>

            {/* Upcoming Events */}
            {scheduleSummary?.upcomingEvents && scheduleSummary.upcomingEvents.length > 0 && (
              <View style={styles.upcomingEvents}>
                <Divider style={styles.divider} />
                <Text variant="bodyMedium" style={{ marginBottom: 12 }}>Upcoming</Text>
                {scheduleSummary.upcomingEvents.slice(0, 3).map((event) => (
                  <View key={event.id} style={styles.eventItem}>
                    <View
                      style={[
                        styles.eventIndicator,
                        { backgroundColor: event.color || theme.colors.primary },
                      ]}
                    />
                    <View style={styles.eventDetails}>
                      <Text variant="bodyMedium" numberOfLines={1}>
                        {event.title}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {isEventToday(event.startDate)
                          ? `Today at ${formatTime(event.startDate)}`
                          : formatDate(event.startDate, 'EEE, MMM d')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Surface style={styles.quickActions} elevation={0}>
          <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: '600' }}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Surface style={[styles.quickActionIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={{ fontSize: 24 }}>💰</Text>
              </Surface>
              <Text variant="bodySmall">Add Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Calendar')}
            >
              <Surface style={[styles.quickActionIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
                <Text style={{ fontSize: 24 }}>📅</Text>
              </Surface>
              <Text variant="bodySmall">View Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Transactions')}
            >
              <Surface style={[styles.quickActionIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
                <Text style={{ fontSize: 24 }}>📊</Text>
              </Surface>
              <Text variant="bodySmall">Transactions</Text>
            </TouchableOpacity>
          </View>
        </Surface>

        {/* Sync Status */}
        {syncStatus.pendingChanges > 0 && (
          <Surface style={styles.syncBanner} elevation={0}>
            <Text variant="bodySmall">
              {syncStatus.pendingChanges} pending changes to sync
            </Text>
          </Surface>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  balance: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spendingItem: {
    flex: 1,
  },
  categories: {
    marginTop: 16,
  },
  divider: {
    marginVertical: 12,
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryName: {
    textTransform: 'capitalize',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  scheduleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  upcomingEvents: {
    marginTop: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  syncBanner: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  quickActions: {
    marginBottom: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default DashboardScreen;
