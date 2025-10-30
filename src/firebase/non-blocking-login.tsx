'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';

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

/** Initiate Google sign-in and create user document (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth, firestore: Firestore): void {
  const provider = new GoogleAuthProvider();
  signInWithPopup(authInstance, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const user = result.user;
      
      // The signed-in user info.
      if (user && firestore) {
        const userRef = doc(firestore, "users", user.uid);
        const userData = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || '',
          role: 'user',
          status: 'active',
        };
        // Use setDoc here to create the document if it doesn't exist
        setDoc(userRef, userData, { merge: true });
      }
    }).catch(error => {
      // Handle Errors here.
      console.error("Google sign-in error:", error);
    });
}
