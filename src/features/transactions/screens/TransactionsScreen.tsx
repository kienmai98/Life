import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, Chip, useTheme, IconButton, Menu, SegmentedButtons, Divider, Avatar, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

import { useAuthStore } from '../../auth/stores/authStore';
import { useTransactionStore } from '../stores/transactionStore';
import { formatCurrency, getCategoryIcon, getCategoryColor, capitalizeFirst } from '../../../shared/utils/helpers';
import { Transaction, TransactionCategory } from '../../../shared/types';

const TransactionsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useAuthStore();
  const { transactions, fetchTransactions, isLoading } = useTransactionStore();

  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | 'all'>('all');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadTransactions();
      }
    }, [user])
  );

  const loadTransactions = async () => {
    if (!user) return;
    const now = new Date();
    const startDate = subMonths(now, 3).toISOString(); // Last 3 months
    const endDate = now.toISOString();
    await fetchTransactions(user.id, { startDate, endDate });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <Card style={styles.transactionCard} mode="outlined">
      <Card.Content style={styles.transactionContent}>
        <View
          style={[
            styles.categoryIcon,
            { backgroundColor: `${getCategoryColor(item.category)}20` },
          ]}
        >
          <Text style={styles.icon}>{getCategoryIcon(item.category)}</Text>
        </View>

        <View style={styles.transactionInfo}>
          <Text variant="bodyLarge" numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.transactionMeta}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {capitalizeFirst(item.category)}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginHorizontal: 4 }}>
              •
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {format(new Date(item.date), 'MMM d')}
            </Text>
            {item.receiptUrl && (
              <>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginHorizontal: 4 }}>
                  •
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                  🧾
                </Text>
              </>
            )}
          </View>
        </View>

        <Text
          variant="titleMedium"
          style={[
            styles.amount,
            { color: item.type === 'income' ? theme.colors.secondary : theme.colors.onSurface },
          ]}
        >
          {item.type === 'income' ? '+' : '-'}
          {formatCurrency(item.amount, item.currency)}
        </Text>
      </Card.Content>
    </Card>
  );

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Summary */}
      <View style={styles.summaryContainer}>
        <Card style={[styles.summaryCard, { flex: 1, borderColor: theme.colors.secondary + '40' }]} mode="outlined">
          <Card.Content style={styles.summaryContent}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Income
            </Text>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.secondary, fontWeight: 'bold' }}
            >
              {formatCurrency(totalIncome)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.summaryCard, { flex: 1, borderColor: theme.colors.error + '40' }]} mode="outlined">
          <Card.Content style={styles.summaryContent}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Expenses
            </Text>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.error, fontWeight: 'bold' }}
            >
              {formatCurrency(totalExpenses)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <SegmentedButtons
          value={filterType}
          onValueChange={(value) => setFilterType(value as any)}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expenses' },
          ]}
          style={styles.segmentedButtons}
          density="small"
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter-variant"
              selected={selectedCategory !== 'all'}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setSelectedCategory('all');
              setMenuVisible(false);
            }}
            title="All Categories"
            leadingIcon={selectedCategory === 'all' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => {
              setSelectedCategory('food');
              setMenuVisible(false);
            }}
            title={`${getCategoryIcon('food')} Food`}
            leadingIcon={selectedCategory === 'food' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => {
              setSelectedCategory('transport');
              setMenuVisible(false);
            }}
            title={`${getCategoryIcon('transport')} Transport`}
            leadingIcon={selectedCategory === 'transport' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => {
              setSelectedCategory('shopping');
              setMenuVisible(false);
            }}
            title={`${getCategoryIcon('shopping')} Shopping`}
            leadingIcon={selectedCategory === 'shopping' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => {
              setSelectedCategory('utilities');
              setMenuVisible(false);
            }}
            title={`${getCategoryIcon('utilities')} Bills & Utilities`}
            leadingIcon={selectedCategory === 'utilities' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => {
              setSelectedCategory('entertainment');
              setMenuVisible(false);
            }}
            title={`${getCategoryIcon('entertainment')} Entertainment`}
            leadingIcon={selectedCategory === 'entertainment' ? 'check' : undefined}
          />
        </Menu>
      </View>

      {selectedCategory !== 'all' && (
        <View style={styles.activeFilter}>
          <Chip
            onClose={() => setSelectedCategory('all')}
            style={{ backgroundColor: `${getCategoryColor(selectedCategory)}20` }}
          >
            {getCategoryIcon(selectedCategory)} {capitalizeFirst(selectedCategory)}
          </Chip>
        </View>
      )}

      <Divider style={styles.divider} />

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={{ fontSize: 64 }}>💰</Text>
            </View>
            <Text variant="headlineSmall" style={{ marginBottom: 8, fontWeight: '600' }}>
              No transactions yet
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 24 }}>
              Tap the + button to add your first transaction
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('AddTransaction')}
              icon="plus"
            >
              Add Transaction
            </Button>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          filteredTransactions.length === 0 && styles.emptyListContent,
        ]}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddTransaction')}
        label="Add"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
  },
  summaryContent: {
    padding: 12,
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  segmentedButtons: {
    flex: 1,
  },
  activeFilter: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  divider: {
    marginHorizontal: 16,
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  transactionCard: {
    marginBottom: 8,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  amount: {
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default TransactionsScreen;
