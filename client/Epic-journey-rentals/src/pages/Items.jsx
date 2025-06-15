import ItemCard from '../Comps/ItemCard';

const dummyItems = [
  {
    id: 1,
    name: 'Mountain Bike',
    category: 'Bike',
    price: 1200,
    image: 'https://source.unsplash.com/400x300/?mountain-bike',
  },
  {
    id: 2,
    name: 'Camping Tent',
    category: 'Tent',
    price: 800,
    image: 'https://source.unsplash.com/400x300/?tent,camping',
  },
  {
    id: 3,
    name: 'DSLR Camera',
    category: 'Camera',
    price: 1500,
    image: 'https://source.unsplash.com/400x300/?dslr,camera',
  },
  {
    id: 4,
    name: 'Hiking Backpack',
    category: 'Accessories',
    price: 500,
    image: 'https://source.unsplash.com/400x300/?backpack,hiking',
  },
  {
    id: 5,
    name: 'Off-Road Jeep',
    category: 'Vehicle',
    price: 3000,
    image: 'https://source.unsplash.com/400x300/?jeep,offroad',
  },
  {
    id: 6,
    name: 'Trekking Poles',
    category: 'Accessories',
    price: 300,
    image: 'https://source.unsplash.com/400x300/?trekking,gear',
  },
];

const Items = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Equipment</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {dummyItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Items;
