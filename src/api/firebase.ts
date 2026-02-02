import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';
import storage from '../utils/storage';
import { User, UserSettings } from '../types';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  iosClientId: Platform.OS === 'ios' ? process.env.GOOGLE_IOS_CLIENT_ID : undefined,
});

class FirebaseService {
  // Auth methods
  async signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName });
    
    const user = await this.createUserInFirestore(userCredential.user, 'email');
    await this.saveUserToStorage(user);
    
    return user;
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user = await this.getUserFromFirestore(userCredential.user.uid);
    
    if (user) {
      await this.saveUserToStorage(user);
      return user;
    }
    
    throw new Error('User not found in database');
  }

  async signInWithGoogle(): Promise<User> {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    
    let user = await this.getUserFromFirestore(userCredential.user.uid);
    
    if (!user) {
      user = await this.createUserInFirestore(userCredential.user, 'google');
    }
    
    await this.saveUserToStorage(user);
    return user;
  }

  async signInWithApple(): Promise<User> {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identity token returned');
    }

    const { identityToken, nonce, fullName } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
    const userCredential = await auth().signInWithCredential(appleCredential);

    // Update display name if provided
    if (fullName?.givenName) {
      const displayName = `${fullName.givenName} ${fullName.familyName || ''}`.trim();
      await userCredential.user.updateProfile({ displayName });
    }

    let user = await this.getUserFromFirestore(userCredential.user.uid);
    
    if (!user) {
      user = await this.createUserInFirestore(userCredential.user, 'apple');
    }
    
    await this.saveUserToStorage(user);
    return user;
  }

  async signOut(): Promise<void> {
    await GoogleSignin.signOut().catch(() => {});
    await auth().signOut();
    await storage.removeUser();
  }

  async resetPassword(email: string): Promise<void> {
    await auth().sendPasswordResetEmail(email);
  }

  async updatePassword(newPassword: string): Promise<void> {
    const user = auth().currentUser;
    if (user) {
      await user.updatePassword(newPassword);
    }
  }

  // Firestore methods
  private async createUserInFirestore(
    firebaseUser: FirebaseAuthTypes.User,
    provider: 'email' | 'google' | 'apple'
  ): Promise<User> {
    const defaultSettings: UserSettings = {
      darkMode: false,
      notificationsEnabled: true,
      biometricEnabled: false,
      currency: 'USD',
    };

    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      provider,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: defaultSettings,
    };

    await firestore().collection('users').doc(firebaseUser.uid).set(user);
    return user;
  }

  async getUserFromFirestore(userId: string): Promise<User | null> {
    const doc = await firestore().collection('users').doc(userId).get();
    return doc.exists ? (doc.data() as User) : null;
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        settings: firestore.FieldValue.arrayUnion(settings),
        updatedAt: new Date().toISOString(),
      });
  }

  // Messaging methods
  async requestNotificationPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  async getFCMToken(): Promise<string | null> {
    return messaging().getToken();
  }

  async saveFCMToken(userId: string, token: string): Promise<void> {
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('tokens')
      .doc(token)
      .set({
        token,
        platform: Platform.OS,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  onMessage(callback: (message: any) => void) {
    return messaging().onMessage(callback);
  }

  // Auth state listener
  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(callback);
  }

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  // Storage helpers
  private async saveUserToStorage(user: User): Promise<void> {
    await storage.setUser(user);
  }
}

export const firebase = new FirebaseService();
export default firebase;
