import { vehicles } from '@/lib/data';
import VehicleCard from '@/components/shared/vehicle-card';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function VehiclesPage() {
  const bikes = vehicles.filter((v) => v.category === 'Bike');
  const cars = vehicles.filter((v) => v.category === 'Car');
  const travellers = vehicles.filter((v) => v.category === 'Tempo Traveller');

  const VehicleGrid = ({ vehicleList }: { vehicleList: typeof vehicles }) => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {vehicleList.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Choose Your Ride"
        subtitle="Reliable and affordable rentals for every need."
      />

      <Tabs defaultValue="car" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="bike">Bikes</TabsTrigger>
          <TabsTrigger value="car">Cars</TabsTrigger>
          <TabsTrigger value="traveller">Tempo Travellers</TabsTrigger>
        </TabsList>
        <TabsContent value="bike" className="mt-8">
          <VehicleGrid vehicleList={bikes} />
        </TabsContent>
        <TabsContent value="car" className="mt-8">
          <VehicleGrid vehicleList={cars} />
        </TabsContent>
        <TabsContent value="traveller" className="mt-8">
          <VehicleGrid vehicleList={travellers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
