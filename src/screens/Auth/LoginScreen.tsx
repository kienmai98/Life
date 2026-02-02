import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, Divider, useTheme, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../../stores/authStore';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { validateEmail, validatePassword } from '../../utils/helpers';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { login, loginWithGoogle, loginWithApple, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    clearError();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
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
            <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
              Life
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Manage your schedule & spending
            </Text>
          </View>

          <Surface style={styles.formContainer} elevation={1}>
            <Text variant="titleLarge" style={styles.formTitle}>
              Welcome Back
            </Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              style={styles.input}
              disabled={isLoading}
              error={!!localError || !!error}
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
              error={!!localError || !!error}
            />

            {(localError || error) && (
              <HelperText type="error" visible={true}>
                {localError || error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
              style={styles.registerButton}
            >
              Don't have an account? Sign Up
            </Button>

            <Divider style={styles.divider} />

            <Button
              mode="outlined"
              onPress={handleGoogleLogin}
              disabled={isLoading}
              style={styles.socialButton}
              icon="google"
            >
              Continue with Google
            </Button>

            {Platform.OS === 'ios' && (
              <Button
                mode="outlined"
                onPress={handleAppleLogin}
                disabled={isLoading}
                style={styles.socialButton}
                icon="apple"
              >
                Continue with Apple
              </Button>
            )}
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
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerButton: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  socialButton: {
    marginBottom: 12,
  },
});

export default LoginScreen;
