import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../firebase';

/**
 * Sign in with email and password.
 * Returns { success, user, error }
 */
export async function signInAdmin(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user, error: null };
  } catch (error) {
    return { success: false, user: null, error: error.message };
  }
}

/**
 * Sign out the current user.
 * Returns { success, error }
 */
export async function signOutAdmin() {
  try {
    await firebaseSignOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get the current user synchronously (may be null during initial load).
 */
export function getCurrentAdminUser() {
  return auth.currentUser;
}
