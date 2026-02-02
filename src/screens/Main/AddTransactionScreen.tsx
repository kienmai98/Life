import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import Geolocation from '@react-native-community/geolocation';

import { useAuthStore } from '../../stores/authStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { TransactionCategory, PaymentMethod } from '../../types';
import { formatCurrency, generateId, capitalizeFirst } from '../../utils/helpers';

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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [paymentMenuVisible, setPaymentMenuVisible] = useState(false);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleScanReceipt = async () => {
    if (!hasPermission) {
      await requestPermission();
    }
    // Navigate to camera screen for receipt scanning
    // This would typically open a camera screen
  };

  const handleGetLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Location error:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
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
        date: new Date().toISOString(),
        type,
        paymentMethod,
        receiptUrl: receiptImage || undefined,
        location: location || undefined,
        tags,
      });

      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
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
            <Text variant="headlineLarge" style={styles.currencySymbol}>
              $
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              placeholder="0.00"
              textAlign="center"
              mode="flat"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
          </Surface>

          {/* Description Input */}
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
          />

          {/* Category Selection */}
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <TextInput
                label="Category"
                value={capitalizeFirst(category)}
                style={styles.input}
                mode="outlined"
                editable={false}
                right={<TextInput.Icon icon="chevron-down" onPress={() => setCategoryMenuVisible(true)} />}
                onPressIn={() => setCategoryMenuVisible(true)}
              />
            }
          >
            {CATEGORIES.map((cat) => (
              <Menu.Item
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setCategoryMenuVisible(false);
                }}
                title={capitalizeFirst(cat)}
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

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>Tags</Text>
            <View style={styles.tagsInputRow}>
              <TextInput
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="Add a tag"
                style={styles.tagInput}
                mode="outlined"
                dense
                onSubmitEditing={handleAddTag}
              />
              <IconButton icon="plus" mode="contained" onPress={handleAddTag} />
            </View>
            <View style={styles.tagsList}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  onClose={() => handleRemoveTag(tag)}
                  style={styles.tagChip}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </View>

          {/* Receipt Scanner Button */}
          <Button
            mode="outlined"
            onPress={handleScanReceipt}
            icon="camera"
            style={styles.receiptButton}
          >
            Scan Receipt
          </Button>

          {/* Location Button */}
          <Button
            mode="outlined"
            onPress={handleGetLocation}
            icon={location ? 'map-marker-check' : 'map-marker'}
            style={styles.locationButton}
          >
            {location ? 'Location Added' : 'Add Location'}
          </Button>

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
            disabled={isLoading}
            style={styles.saveButton}
            contentStyle={styles.buttonContent}
          >
            Save Transaction
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 24,
  },
  currencySymbol: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    width: 200,
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  tagChip: {
    marginRight: 8,
  },
  receiptButton: {
    marginBottom: 12,
  },
  locationButton: {
    marginBottom: 24,
  },
  saveButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default AddTransactionScreen;
