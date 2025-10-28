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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function VendorSignupPage() {
  const [companyName, setCompanyName] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kyc, setKyc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      router.push('/vendor/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (isSubmitting && auth && firestore) {
      const unsubscribe = onAuthStateChanged(auth, (newUser) => {
        if (newUser && newUser.email === email) {
          // New user has been created and authenticated
          const userDocRef = doc(firestore, 'users', newUser.uid);
          const userData = {
            id: newUser.uid,
            name: companyName,
            email: newUser.email,
            phone: '',
            role: 'vendor',
            status: 'active',
          };
          setDocumentNonBlocking(userDocRef, userData, { merge: true });

          const vendorDocRef = doc(firestore, 'vendors', newUser.uid);
          const vendorData = {
            id: newUser.uid,
            name: companyName,
            type: vendorType,
            kyc: kyc,
            status: 'pending',
          };
          setDocumentNonBlocking(vendorDocRef, vendorData, { merge: true });

          toast({ title: 'Vendor account created successfully!', description: 'Your account is pending approval.' });
          setIsSubmitting(false);
          router.push('/vendor/dashboard');
          
          unsubscribe(); // Clean up the listener
        }
      });

      return () => unsubscribe(); // Cleanup on component unmount
    }
  }, [isSubmitting, auth, firestore, email, companyName, vendorType, kyc, router, toast]);

  const handleVendorRegister = async () => {
    if (!companyName || !vendorType || !email || !password || !kyc) {
      toast({ variant: 'destructive', title: 'Please fill all fields' });
      return;
    }
    if (!auth) return;

    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // The useEffect will handle the firestore document creation
    } catch (error: any) {
      console.error('Vendor registration error:', error);
      toast({ variant: 'destructive', title: 'Registration Failed', description: error.message });
      setIsSubmitting(false);
    }
  };

  if (user) {
    return null; // Return null or a loading indicator while redirecting
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background py-12">
      <Card className="mx-auto w-full max-w-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Become a Vendor</CardTitle>
          <CardDescription>
            Enter your details to register as a vendor on GoWorld Tours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="e.g., Happy Travels Pvt. Ltd."
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vendor-type">Vendor Type</Label>
              <Select onValueChange={setVendorType} value={vendorType}>
                <SelectTrigger id="vendor-type">
                  <SelectValue placeholder="Select vendor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="lodging">Lodging</SelectItem>
                  <SelectItem value="travel_agent">Travel Agent</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="kyc">KYC Document ID / Number</Label>
              <Input
                id="kyc"
                placeholder="Enter your KYC identifier"
                required
                value={kyc}
                onChange={(e) => setKyc(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@happytravels.com"
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleVendorRegister} className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register as Vendor'}
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
