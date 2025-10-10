import Link from 'next/link';

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to PartKasa</h1>
      <p className="text-gray-600">High-performance SSR app scaffold with Next.js + Tailwind.</p>
      <div className="space-x-4">
        <Link className="text-sky-700 underline" href="/search">Search Parts</Link>
        <Link className="text-sky-700 underline" href="/login">Login</Link>
      </div>
    </div>
  );
}

