
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
  setDocumentNonBlocking,
  useCollection,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import type { Vendor, Tour } from '@/lib/types';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, IndianRupee } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cities } from '@/lib/data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock Data for Bookings and Financials
const mockBookings = [
  { id: 'B001', tour: 'Historical Wonders of Delhi', customer: 'Alice Johnson', date: '2024-08-15', status: 'Confirmed', amount: '₹30,000' },
  { id: 'B002', tour: 'Historical Wonders of Delhi', customer: 'Bob Williams', date: '2024-08-20', status: 'Pending', amount: '₹15,000' },
  { id: 'B003', tour: 'Mumbai Film City Adventure', customer: 'Charlie Brown', date: '2024-09-01', status: 'Confirmed', amount: '₹12,000' },
];

const mockFinancials = {
    totalRevenue: '₹5,50,000',
    totalBookings: 37,
    payouts: '₹4,95,000',
    recentTransactions: [
        { id: 'T001', date: '2024-07-28', description: 'Payout', amount: '₹50,000', status: 'Completed' },
        { id: 'T002', date: '2024-07-25', description: 'Booking: Historical Wonders of Delhi', amount: '₹30,000', status: 'Cleared' },
        { id: 'T003', date: '2024-07-22', description: 'Booking: Mumbai Film City Adventure', amount: '₹12,000', status: 'Cleared' },
    ]
}


export default function VendorDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [vendorProfile, setVendorProfile] = useState<Vendor | null>(null);
  const [newTour, setNewTour] = useState({
      title: '',
      city: '',
      days: 1,
      price: 0,
      rating: 4.5,
  });

  const [isEditTourDialogOpen, setIsEditTourDialogOpen] = useState(false);
  const [isDeleteTourAlertOpen, setIsDeleteTourAlertOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);


  // Fetch Vendor Profile
  const vendorDocRef = useMemoFirebase(() => {
    if (firestore && user?.uid) {
      return doc(firestore, 'vendors', user.uid);
    }
    return null;
  }, [firestore, user?.uid]);
  const { data: vendorData, isLoading: isVendorLoading } = useDoc<Vendor>(vendorDocRef);
  
  // Fetch Vendor's Tours
  const toursQuery = useMemoFirebase(() => {
    if (firestore && user?.uid) {
      return query(
        collection(firestore, 'vendors', user.uid, 'tours'),
        orderBy('title', 'desc')
      );
    }
    return null;
  }, [firestore, user?.uid]);
  const { data: vendorTours, isLoading: areToursLoading } = useCollection<Tour>(toursQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (vendorData) {
      setVendorProfile(vendorData);
    }
  }, [vendorData]);

  const handleProfileUpdate = () => {
    if (!vendorDocRef || !vendorProfile) return;

    const updatedData = {
      name: vendorProfile.name,
      type: vendorProfile.type,
      description: vendorProfile.description || '',
      contactEmail: vendorProfile.contactEmail || '',
      contactPhone: vendorProfile.contactPhone || '',
    };

    setDocumentNonBlocking(vendorDocRef, updatedData, { merge: true });

    toast({
      title: 'Profile Updated',
      description: 'Your business profile has been saved.',
    });
  };
  
  const handleAddTour = () => {
    if (!firestore || !user?.uid) return;
    if (!newTour.title || !newTour.city || newTour.price <= 0) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all tour details.",
        });
        return;
    }

    const toursCollectionRef = collection(firestore, 'vendors', user.uid, 'tours');
    const tourData: Omit<Tour, 'id' | 'image'> = {
        title: newTour.title,
        city: newTour.city,
        days: newTour.days,
        price: { currency: 'INR', amount: newTour.price },
        rating: newTour.rating,
        vendorId: user.uid,
    };

    addDocumentNonBlocking(toursCollectionRef, tourData);
    
    toast({
        title: "Tour Added!",
        description: `${newTour.title} has been added to your offerings.`,
    });
    
    // Reset form
    setNewTour({ title: '', city: '', days: 1, price: 0, rating: 4.5 });
  };
  
  const handleOpenEditDialog = (tour: Tour) => {
    setSelectedTour(tour);
    setIsEditTourDialogOpen(true);
  };
  
  const handleUpdateTour = useCallback(() => {
    if (!firestore || !user?.uid || !selectedTour) return;

    const tourRef = doc(firestore, 'vendors', user.uid, 'tours', selectedTour.id);
    
    const updatedData = {
        title: selectedTour.title,
        city: selectedTour.city,
        days: Number(selectedTour.days),
        price: { ...selectedTour.price, amount: Number(selectedTour.price.amount) },
    };

    updateDocumentNonBlocking(tourRef, updatedData);

    toast({
      title: "Tour Updated",
      description: "Your tour details have been successfully saved.",
    });

    setIsEditTourDialogOpen(false);
    setSelectedTour(null);
  }, [firestore, user?.uid, selectedTour, toast]);


  const handleOpenDeleteAlert = (tour: Tour) => {
    setSelectedTour(tour);
    setIsDeleteTourAlertOpen(true);
  };
  
  const handleDeleteTour = useCallback(() => {
    if (!firestore || !user?.uid || !selectedTour) return;
    
    const tourRef = doc(firestore, 'vendors', user.uid, 'tours', selectedTour.id);
    deleteDocumentNonBlocking(tourRef);
    
    toast({
      title: "Tour Deleted",
      description: `${selectedTour.title} has been removed from your offerings.`,
    });

    setIsDeleteTourAlertOpen(false);
    setSelectedTour(null);
  }, [firestore, user?.uid, selectedTour, toast]);


  const handleInputChange = (field: keyof Vendor, value: string) => {
    if (vendorProfile) {
      setVendorProfile({ ...vendorProfile, [field]: value });
    }
  };
  
  const handleNewTourChange = (field: keyof typeof newTour, value: string | number) => {
    setNewTour({ ...newTour, [field]: value });
  };


  if (isUserLoading || isVendorLoading) {
    return <div className="container mx-auto py-8">Loading dashboard...</div>;
  }

  if (!user) {
    return null; // Should be redirected by the effect
  }

  if (!vendorProfile) {
    return (
      <div className="container mx-auto py-8 text-center">
        <PageHeader title="Welcome, Vendor!" />
        <p>Could not load your vendor profile. Please contact support.</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <PageHeader
          title={`Welcome, ${vendorProfile.name}`}
          subtitle="Manage your business on GoWorld Tours"
        />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>
                  Update your company details here. Your KYC status is{' '}
                  <span className="font-bold">{vendorProfile.status}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={vendorProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorType">Vendor Type</Label>
                    <Select
                      value={vendorProfile.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
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
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={vendorProfile.contactEmail || ''}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={vendorProfile.contactPhone || ''}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={vendorProfile.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell us about your business..."
                  />
                </div>
                <Button onClick={handleProfileUpdate}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tours Tab */}
          <TabsContent value="tours">
            <div className="grid gap-8 md:grid-cols-3">
               <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Tours</CardTitle>
                      <CardDescription>All tour packages you currently offer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell]">
                              <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead className="hidden md:table-cell">Price</TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {areToursLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading tours...</TableCell></TableRow>}
                          {vendorTours && vendorTours.map((tour) => (
                             <TableRow key={tour.id}>
                              <TableCell className="hidden sm:table-cell">
                                 <Image
                                  alt={tour.title}
                                  className="aspect-square rounded-md object-cover"
                                  height="64"
                                  src={PlaceHolderImages.find(p => p.id === 'tour1')?.imageUrl || '/placeholder.svg'}
                                  width="64"
                                  />
                              </TableCell>
                              <TableCell className="font-medium">{tour.title}</TableCell>
                              <TableCell>{tour.city}</TableCell>
                              <TableCell className="hidden md:table-cell">₹{tour.price.amount.toLocaleString('en-IN')}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Toggle menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleOpenEditDialog(tour)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeleteAlert(tour)}>Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                             </TableRow>
                          ))}
                          {!areToursLoading && vendorTours?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">You haven't added any tours yet.</TableCell></TableRow>}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
               </div>
               <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Tour</CardTitle>
                      <CardDescription>Fill in the details to create a new tour package.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="space-y-2">
                          <Label htmlFor="tourTitle">Tour Title</Label>
                          <Input id="tourTitle" placeholder="e.g. Historical Wonders of Delhi" value={newTour.title} onChange={(e) => handleNewTourChange('title', e.target.value)} />
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="tourCity">City</Label>
                          <Select value={newTour.city} onValueChange={(value) => handleNewTourChange('city', value)}>
                              <SelectTrigger id="tourCity">
                                 <SelectValue placeholder="Select a city" />
                              </SelectTrigger>
                              <SelectContent>
                                  {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                          </Select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="tourDays">Days</Label>
                              <Input id="tourDays" type="number" min="1" value={newTour.days} onChange={(e) => handleNewTourChange('days', parseInt(e.target.value))} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="tourPrice">Price (INR)</Label>
                              <Input id="tourPrice" type="number" min="0" value={newTour.price} onChange={(e) => handleNewTourChange('price', parseFloat(e.target.value))} />
                          </div>
                       </div>
                    </CardContent>
                    <CardFooter>
                       <Button className="w-full" onClick={handleAddTour}><PlusCircle className="mr-2"/> Add Tour</Button>
                    </CardFooter>
                  </Card>
               </div>
            </div>
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings</CardTitle>
                <CardDescription>View and manage your customer bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Tour</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBookings.map((booking) => (
                       <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.tour}</TableCell>
                          <TableCell>{booking.customer}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell><Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge></TableCell>
                          <TableCell className="text-right">{booking.amount}</TableCell>
                       </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Financials Tab */}
          <TabsContent value="financials">
              <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{mockFinancials.totalRevenue}</div>
                          <p className="text-xs text-muted-foreground">from {mockFinancials.totalBookings} bookings</p>
                      </CardContent>
                  </Card>
                   <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{mockFinancials.payouts}</div>
                          <p className="text-xs text-muted-foreground">Processed by GoWorld Tours</p>
                      </CardContent>
                  </Card>
              </div>
               <Card className="mt-8">
                  <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>Your recent payouts and booking transactions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Transaction ID</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Description</TableHead>
                                   <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Amount</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {mockFinancials.recentTransactions.map(tx => (
                                  <TableRow key={tx.id}>
                                      <TableCell>{tx.id}</TableCell>
                                      <TableCell>{tx.date}</TableCell>
                                      <TableCell>{tx.description}</TableCell>
                                       <TableCell><Badge variant={tx.status === 'Completed' ? 'default' : 'outline'}>{tx.status}</Badge></TableCell>
                                      <TableCell className="text-right">{tx.amount}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
               </Card>
          </TabsContent>
        </Tabs>
      </div>

       {/* Edit Tour Dialog */}
      {selectedTour && (
        <Dialog open={isEditTourDialogOpen} onOpenChange={setIsEditTourDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Tour</DialogTitle>
                    <DialogDescription>
                        Make changes to your tour package here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-title" className="text-right">Title</Label>
                        <Input id="edit-title" value={selectedTour.title} onChange={(e) => setSelectedTour({...selectedTour, title: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-city" className="text-right">City</Label>
                        <Select value={selectedTour.city} onValueChange={(value) => setSelectedTour({...selectedTour, city: value})}>
                           <SelectTrigger id="edit-city" className="col-span-3">
                               <SelectValue placeholder="Select a city" />
                           </SelectTrigger>
                           <SelectContent>
                               {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                           </SelectContent>
                       </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-days" className="text-right">Days</Label>
                        <Input id="edit-days" type="number" value={selectedTour.days} onChange={(e) => setSelectedTour({...selectedTour, days: parseInt(e.target.value)})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-price" className="text-right">Price (INR)</Label>
                        <Input id="edit-price" type="number" value={selectedTour.price.amount} onChange={(e) => setSelectedTour({...selectedTour, price: { ...selectedTour.price, amount: parseFloat(e.target.value) }})} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditTourDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateTour}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      {/* Delete Tour Alert Dialog */}
      <AlertDialog open={isDeleteTourAlertOpen} onOpenChange={setIsDeleteTourAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tour
              "{selectedTour?.title}" and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTour} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    