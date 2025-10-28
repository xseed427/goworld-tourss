'use client';
import {
<<<<<<< HEAD
  Auth, 
=======
  Auth,
>>>>>>> 1f03250 (second commit)
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
<<<<<<< HEAD
  getAdditionalUserInfo
} from 'firebase/auth';
import { Firestore, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
=======
} from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';
>>>>>>> 1f03250 (second commit)

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

<<<<<<< HEAD
/** Initiate Google Sign-In (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth, firestore: Firestore): void {
  const provider = new GoogleAuthProvider();
  signInWithPopup(authInstance, provider)
    .then((result) => {
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
      if (isNewUser) {
        const user = result.user;
=======
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
>>>>>>> 1f03250 (second commit)
        const userData = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || '',
          role: 'user',
          status: 'active',
        };
<<<<<<< HEAD
        const userRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userRef, userData, { merge: true });
      }
    })
    .catch((error) => {
      console.error("Google Sign-In Error", error);
      // Optionally, you can use the toast to show an error to the user
    });
}

    
=======
        // Use setDoc here to create the document if it doesn't exist
        setDoc(userRef, userData, { merge: true });
      }
    }).catch(error => {
      // Handle Errors here.
      console.error("Google sign-in error:", error);
    });
}
>>>>>>> 1f03250 (second commit)
