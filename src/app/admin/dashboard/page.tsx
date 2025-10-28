
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile, Tour, Hotel, Vehicle } from '@/lib/types';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { tours as allTours } from '@/lib/data';
import { hotels as allHotels } from '@/lib/data';
import { vehicles as allVehicles } from '@/lib/data';
import Image from 'next/image';

type PermissionState = 'loading' | 'granted' | 'denied';
type DeletableItem = (Tour | Hotel | Vehicle) & { itemType: string };


export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [permission, setPermission] = useState<PermissionState>('loading');
  
  const [itemToDelete, setItemToDelete] = useState<DeletableItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Step 1: Fetch User Profile to check role
  const userDocRef = useMemoFirebase(() => {
    if (firestore && user?.uid) {
      return doc(firestore, 'users', user.uid);
    }
    return null;
  }, [firestore, user?.uid]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc<UserProfile>(userDocRef);
  
  // Step 2: Determine permission state
  useEffect(() => {
    const isDoneLoading = !isUserLoading && !isUserDocLoading;
    if (isDoneLoading) {
      if (user && userData?.role === 'admin') {
        setPermission('granted');
      } else {
        setPermission('denied');
      }
    }
  }, [isUserLoading, isUserDocLoading, user, userData]);

  // Step 3: Redirect if permission is denied
  useEffect(() => {
      if (permission === 'denied') {
          toast({ variant: 'destructive', title: 'Access Denied', description: 'You must be an administrator to view this page.' });
          router.push('/');
      }
  }, [permission, router, toast]);

  const openDeleteDialog = (item: Tour | Hotel | Vehicle, itemType: string) => {
    setItemToDelete({ ...item, itemType });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    // Here you would typically call a function to delete the item from your database.
    // For this example, we'll just show a toast.
    toast({
      title: `${itemToDelete.itemType} Deleted`,
      description: `The ${itemToDelete.itemType.toLowerCase()} "${'name' in itemToDelete ? itemToDelete.name : itemToDelete.title}" has been removed.`,
    });
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Show loading state until we can confirm the user's role
  if (permission !== 'granted') {
    return <div className="container mx-auto py-8 text-center">Verifying permissions...</div>;
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage platform content"
        />

        <Tabs defaultValue="tours">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tours">
            <Card>
              <CardHeader>
                <CardTitle>Manage Tours</CardTitle>
                <CardDescription>View and delete tours from the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTours.map((tour) => (
                      <TableRow key={tour.id}>
                        <TableCell className="font-medium">{tour.title}</TableCell>
                        <TableCell>{tour.city}</TableCell>
                        <TableCell>₹{tour.price.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(tour, 'Tour')}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels">
            <Card>
              <CardHeader>
                <CardTitle>Manage Hotels</CardTitle>
                <CardDescription>View and delete hotels from the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Price/Night</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allHotels.map((hotel) => (
                      <TableRow key={hotel.id}>
                        <TableCell className="font-medium">{hotel.name}</TableCell>
                        <TableCell>{hotel.city}</TableCell>
                        <TableCell>₹{hotel.priceMin.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(hotel, 'Hotel')}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
             <Card>
              <CardHeader>
                <CardTitle>Manage Vehicles</CardTitle>
                <CardDescription>View and delete vehicles from the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price/Day</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.name}</TableCell>
                        <TableCell>{vehicle.category}</TableCell>
                        <TableCell>₹{vehicle.pricePerDay.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(vehicle, 'Vehicle')}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

       {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {' '}
              <b>{itemToDelete && ('name' in itemToDelete ? itemToDelete.name : itemToDelete.title)}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
