
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
  setDocumentNonBlocking,
} from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Vendor, UserProfile } from '@/lib/types';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [vendorProfile, setVendorProfile] = useState<Vendor | null>(null);

  // Fetch User Profile
  const userDocRef = useMemoFirebase(() => {
    if (firestore && user?.uid) {
      return doc(firestore, 'users', user.uid);
    }
    return null;
  }, [firestore, user?.uid]);
  const { data: userData, isLoading: isUserLoadingDb } = useDoc<UserProfile>(userDocRef);

  // Fetch Vendor Profile if user is a vendor
  const vendorDocRef = useMemoFirebase(() => {
    if (firestore && user?.uid && userData?.role === 'vendor') {
      return doc(firestore, 'vendors', user.uid);
    }
    return null;
  }, [firestore, user?.uid, userData?.role]);
  const { data: vendorData, isLoading: isVendorLoadingDb } = useDoc<Vendor>(vendorDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (userData) {
      setUserProfile(userData);
    }
    if (vendorData) {
      setVendorProfile(vendorData);
    }
  }, [userData, vendorData]);

  const handleProfileUpdate = () => {
    if (!userDocRef || !userProfile) return;

    setDocumentNonBlocking(userDocRef, { name: userProfile.name }, { merge: true });

    if (vendorDocRef && vendorProfile) {
        setDocumentNonBlocking(vendorDocRef, { 
            name: vendorProfile.name,
            contactEmail: vendorProfile.contactEmail,
            contactPhone: vendorProfile.contactPhone,
            description: vendorProfile.description,
        }, { merge: true });
    }

    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully saved.',
    });
  };

  const handleUserProfileChange = (field: keyof UserProfile, value: string) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, [field]: value });
    }
  };

  const handleVendorProfileChange = (field: keyof Vendor, value: string) => {
    if (vendorProfile) {
      setVendorProfile({ ...vendorProfile, [field]: value });
    }
  };

  if (isUserLoading || isUserLoadingDb || isVendorLoadingDb) {
    return <div className="container mx-auto py-8 text-center">Loading profile...</div>;
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto py-8 text-center">
        <PageHeader title="Profile Not Found" />
        <p>We couldn't find your profile. Please try logging in again.</p>
        <Button onClick={() => router.push('/login')} className="mt-4">Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <PageHeader title="My Profile" />

      <div className="grid grid-cols-1 gap-8">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>This is your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={userProfile.name || ''}
                onChange={(e) => handleUserProfileChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={userProfile.email || ''} disabled />
            </div>
             <div className="flex items-center space-x-2">
                <Label>Role:</Label>
                <Badge variant="secondary">{userProfile.role}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Profile Card */}
        {userProfile.role === 'vendor' && vendorProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Vendor Profile</CardTitle>
              <CardDescription>This is your public business information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                    id="companyName"
                    value={vendorProfile.name || ''}
                    onChange={(e) => handleVendorProfileChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                    id="contactEmail"
                    type="email"
                    value={vendorProfile.contactEmail || ''}
                    onChange={(e) => handleVendorProfileChange('contactEmail', e.target.value)}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                    id="contactPhone"
                    type="tel"
                    value={vendorProfile.contactPhone || ''}
                    onChange={(e) => handleVendorProfileChange('contactPhone', e.target.value)}
                />
              </div>
               <div className="flex items-center space-x-2">
                <Label>KYC Status:</Label>
                <Badge>{vendorProfile.status}</Badge>
            </div>
            </CardContent>
          </Card>
        )}

        {userProfile.role === 'admin' && (
             <Card>
                <CardHeader>
                    <CardTitle>Administrator Access</CardTitle>
                    <CardDescription>You have superadmin privileges on this platform.</CardDescription>
                </CardHeader>
            </Card>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleProfileUpdate}>Save Changes</Button>
      </div>
    </div>
  );
}
