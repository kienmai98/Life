import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Chip,
  useTheme,
  SegmentedButtons,
  Menu,
  IconButton,
  Surface,
  HelperText,
  FAB,
  Portal,
  Modal,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';

import { useAuthStore } from '../../stores/authStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { TransactionCategory, PaymentMethod } from '../../types';
import { getCategoryIcon, getCategoryColor, capitalizeFirst } from '../../utils/helpers';

type AddTransactionScreenProps = {
  navigation: NativeStackNavigationProp<any, 'AddTransaction'>;
};

const CATEGORIES: TransactionCategory[] = [
  'food',
  'transport',
  'shopping',
  'entertainment',
  'utilities',
  'health',
  'education',
  'other',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'cash',
  'credit_card',
  'debit_card',
  'bank_transfer',
  'mobile_payment',
  'other',
];

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { addTransaction } = useTransactionStore();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [paymentMenuVisible, setPaymentMenuVisible] = useState(false);

  // Simulated receipt photo (in real app, this would use camera)
  const handleAddReceipt = () => {
    // For MVP, we'll simulate a receipt photo
    // In production, this would open the camera
    setReceiptImage('receipt_placeholder');
  };

  const handleRemoveReceipt = () => {
    setReceiptImage(null);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      await addTransaction({
        userId: user.id,
        amount: parseFloat(amount),
        currency: 'USD',
        category,
        description: description.trim(),
        date: date.toISOString(),
        type,
        paymentMethod,
        receiptUrl: receiptImage || undefined,
        tags: notes ? [notes] : [],
      });

      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmountInput = (text: string) => {
    // Only allow numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Type Selector */}
          <SegmentedButtons
            value={type}
            onValueChange={(value) => setType(value as 'income' | 'expense')}
            buttons={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' },
            ]}
            style={styles.segmentedButtons}
          />

          {/* Amount Input */}
          <Surface style={styles.amountContainer} elevation={0}>
            <Text variant="headlineLarge" style={[styles.currencySymbol, { color: theme.colors.primary }]}>
              $
            </Text>
            <TextInput
              value={amount}
              onChangeText={(text) => setAmount(formatAmountInput(text))}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              textAlign="center"
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              autoFocus
            />
          </Surface>

          {/* Description Input */}
          <TextInput
            label="Description *"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            placeholder="What was this for?"
          />

          {/* Date Selection */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              label="Date"
              value={format(date, 'MMM d, yyyy')}
              style={styles.input}
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="calendar" />}
            />
          </TouchableOpacity>

          {/* Category Selection */}
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setCategoryMenuVisible(true)}>
                <View style={styles.categorySelector}>
                  <Text style={[styles.categoryLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Category
                  </Text>
                  <View style={styles.categoryValue}>
                    <Text style={{ fontSize: 24, marginRight: 8 }}>
                      {getCategoryIcon(category)}
                    </Text>
                    <Text variant="bodyLarge">{capitalizeFirst(category)}</Text>
                    <IconButton icon="chevron-down" size={20} />
                  </View>
                </View>
              </TouchableOpacity>
            }
          >
            {CATEGORIES.map((cat) => (
              <Menu.Item
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setCategoryMenuVisible(false);
                }}
                title={`${getCategoryIcon(cat)} ${capitalizeFirst(cat)}`}
                leadingIcon={category === cat ? 'check' : undefined}
              />
            ))}
          </Menu>

          {/* Payment Method Selection */}
          <Menu
            visible={paymentMenuVisible}
            onDismiss={() => setPaymentMenuVisible(false)}
            anchor={
              <TextInput
                label="Payment Method"
                value={capitalizeFirst(paymentMethod.replace('_', ' '))}
                style={styles.input}
                mode="outlined"
                editable={false}
                right={<TextInput.Icon icon="chevron-down" onPress={() => setPaymentMenuVisible(true)} />}
                onPressIn={() => setPaymentMenuVisible(true)}
              />
            }
          >
            {PAYMENT_METHODS.map((method) => (
              <Menu.Item
                key={method}
                onPress={() => {
                  setPaymentMethod(method);
                  setPaymentMenuVisible(false);
                }}
                title={capitalizeFirst(method.replace('_', ' '))}
                leadingIcon={paymentMethod === method ? 'check' : undefined}
              />
            ))}
          </Menu>

          {/* Notes Input */}
          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Add any additional details..."
          />

          {/* Receipt Section */}
          <Surface style={styles.receiptSection} elevation={0}>
            <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
              Receipt Photo (Optional)
            </Text>
            
            {receiptImage ? (
              <View style={styles.receiptPreview}>
                <Surface style={styles.receiptPlaceholder}>
                  <IconButton icon="receipt" size={48} iconColor={theme.colors.primary} />
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Receipt attached
                  </Text>
                </Surface>
                <Button
                  mode="text"
                  onPress={handleRemoveReceipt}
                  textColor={theme.colors.error}
                  style={{ marginTop: 8 }}
                >
                  Remove Receipt
                </Button>
              </View>
            ) : (
              <Button
                mode="outlined"
                onPress={handleAddReceipt}
                icon="camera"
                style={styles.receiptButton}
              >
                Add Receipt Photo
              </Button>
            )}
          </Surface>

          {error && (
            <HelperText type="error" visible={true}>
              {error}
            </HelperText>
          )}

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading || !amount || !description}
            style={styles.saveButton}
            contentStyle={styles.buttonContent}
          >
            Save Transaction
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal (simplified) */}
      <Portal>
        <Modal
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          contentContainerStyle={styles.datePickerModal}
        >
          <Surface style={styles.datePickerContent}>
            <Text variant="titleMedium" style={{ marginBottom: 16 }}>
              Select Date
            </Text>
            <Text variant="bodyLarge" style={{ marginBottom: 24 }}>
              {format(date, 'MMMM d, yyyy')}
            </Text>
            <View style={styles.dateQuickButtons}>
              <Button mode="text" onPress={() => { setDate(new Date()); setShowDatePicker(false); }}>
                Today
              </Button>
              <Button
                mode="text"
                onPress={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  setDate(yesterday);
                  setShowDatePicker(false);
                }}
              >
                Yesterday
              </Button>
            </View>
            <Button
              mode="contained"
              onPress={() => setShowDatePicker(false)}
              style={{ marginTop: 16 }}
            >
              Done
            </Button>
          </Surface>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    paddingVertical: 16,
  },
  currencySymbol: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  amountInput: {
    fontSize: 48,
    width: 220,
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  categorySelector: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
  },
  categoryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  categoryValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptSection: {
    marginVertical: 16,
    padding: 16,
  },
  receiptButton: {
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  receiptPreview: {
    alignItems: 'center',
  },
  receiptPlaceholder: {
    width: 200,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  datePickerModal: {
    padding: 20,
  },
  datePickerContent: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  dateQuickButtons: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default AddTransactionScreen;
