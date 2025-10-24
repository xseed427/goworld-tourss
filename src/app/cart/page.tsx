import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/shared/page-header';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const cartItems = [
    {
      id: 1,
      name: 'Historical Wonders of Delhi',
      price: 15000,
      quantity: 2,
      image: PlaceHolderImages.find((p) => p.id === 'tour1')!,
    },
    {
      id: 2,
      name: 'The Grand Palace, Delhi',
      price: 8000,
      quantity: 3,
      image: PlaceHolderImages.find((p) => p.id === 'hotel1')!,
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.18;
  const total = subtotal + taxes;

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Your Shopping Cart" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.image.imageUrl}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.price.toLocaleString('en-IN')} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-muted-foreground"/>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-20 rounded-xl">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (18%)</span>
                <span>₹{taxes.toLocaleString('en-IN')}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <div className="flex w-full gap-2">
                <Input placeholder="Coupon Code" />
                <Button variant="outline">Apply</Button>
              </div>
              <Button className="w-full">Place Order</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
