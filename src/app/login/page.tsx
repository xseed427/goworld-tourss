'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { initiateEmailSignIn, initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  // Memoize the document reference
  const userDocRef = useMemoFirebase(() => {
    if (firestore && user?.uid) {
      return doc(firestore, 'users', user.uid);
    }
    return null;
  }, [firestore, user?.uid]);

  // Fetch the user document from Firestore
  const { data: userData } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    if (user && userData) {
      if (userData.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (userData.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, userData, router]);


  const handleLogin = () => {
    if(auth) {
      initiateEmailSignIn(auth, email, password);
    }
  };
  
  const handleGoogleLogin = () => {
    if (auth && firestore) {
      initiateGoogleSignIn(auth, firestore);
    }
  };

  // Prevent rendering the form if the user is logged in and we are just waiting for the redirect
  if (user) {
    return <div className="flex min-h-[80vh] items-center justify-center bg-background"><p>Logging in...</p></div>;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background">
      <Card className="mx-auto w-full max-w-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
