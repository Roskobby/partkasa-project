export default function ProductPage({ params }) {
  const { id } = params;
  return (
    <div>
      <h1 className="text-2xl font-semibold">Product {id}</h1>
      <p className="text-gray-600">SSR page placeholder for product details.</p>
    </div>
  );
}

