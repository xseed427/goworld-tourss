'use client';
import {
  Auth, 
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth';
import { Firestore, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password);
}

/** Initiate Google Sign-In (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth, firestore: Firestore): void {
  const provider = new GoogleAuthProvider();
  signInWithPopup(authInstance, provider)
    .then((result) => {
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
      if (isNewUser) {
        const user = result.user;
        const userData = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || '',
          role: 'user',
          status: 'active',
        };
        const userRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userRef, userData, { merge: true });
      }
    })
    .catch((error) => {
      console.error("Google Sign-In Error", error);
      // Optionally, you can use the toast to show an error to the user
    });
}

    