const ItemCard = ({ item }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <p className="text-sm text-gray-600">{item.category}</p>
        <p className="mt-2 font-bold text-rose-600">PKR {item.price}/day</p>
        <button className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Rent Now
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
