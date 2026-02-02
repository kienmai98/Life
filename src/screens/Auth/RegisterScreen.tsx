import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme, HelperText, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../../stores/authStore';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { validateEmail, validatePassword } from '../../utils/helpers';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async () => {
    clearError();
    setLocalError(null);

    if (!displayName || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setLocalError(passwordValidation.message || 'Invalid password');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setLocalError('Please agree to the terms and conditions');
      return;
    }

    try {
      await register(email, password, displayName);
      // Navigate to biometric setup after successful registration
      navigation.replace('BiometricSetup', { userId: 'temp' });
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
              Create Account
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Start managing your life better
            </Text>
          </View>

          <Surface style={styles.formContainer} elevation={1}>
            <TextInput
              label="Full Name"
              value={displayName}
              onChangeText={setDisplayName}
              autoComplete="name"
              style={styles.input}
              disabled={isLoading}
              error={!!localError}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              style={styles.input}
              disabled={isLoading}
              error={!!localError}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              disabled={isLoading}
              error={!!localError}
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              disabled={isLoading}
              error={!!localError}
            />

            <View style={styles.termsContainer}>
              <Checkbox
                status={agreedToTerms ? 'checked' : 'unchecked'}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              />
              <Text variant="bodySmall" style={styles.termsText}>
                I agree to the Terms of Service and Privacy Policy
              </Text>
            </View>

            {(localError || error) && (
              <HelperText type="error" visible={true}>
                {localError || error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              Create Account
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              Already have an account? Sign In
            </Button>
          </Surface>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
  },
  input: {
    marginBottom: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default RegisterScreen;
