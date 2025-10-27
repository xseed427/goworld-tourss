'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { initiateEmailSignUp, initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';


export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isRegistered) {
      // This effect is for email/password registration to create the user document
      // For Google Sign-in, user creation is handled within initiateGoogleSignIn
      const userData = {
        id: user.uid,
        name: `${firstName} ${lastName}`.trim(),
        email: user.email,
        phone: '',
        role: 'user',
        status: 'active',
      };
      if (firestore && user.uid && userData.name) {
        const userRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userRef, userData, { merge: true });
        toast({ title: "Account created successfully!" });
        router.push('/');
      }
    }
  }, [user, isRegistered, firestore, firstName, lastName, router, toast]);

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !password) {
      toast({ variant: "destructive", title: "Please fill all fields" });
      return;
    }
    setIsRegistered(true);
    initiateEmailSignUp(auth, email, password);
  };
  
  const handleGoogleLogin = () => {
    if (auth && firestore) {
      initiateGoogleSignIn(auth, firestore);
    }
  };


  if (user && !isRegistered) {
    // If user is logged in but didn't just go through the registration flow on this page
    router.push('/');
    return null;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background">
      <Card className="mx-auto w-full max-w-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleRegister} className="w-full">
              Create an account
            </Button>
            <div className="relative my-2">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>
             <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              Sign Up with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    