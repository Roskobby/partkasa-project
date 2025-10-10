export const metadata = {
  title: 'PartKasa – Auto Parts Marketplace',
  description: 'Find and buy auto parts fast. Search by vehicle, part name, or part number.',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white">
            <div className="container mx-auto px-4 py-4 font-semibold">PartKasa</div>
          </header>
          <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
          <footer className="border-t bg-gray-50">
            <div className="container mx-auto px-4 py-6 text-sm text-gray-600">© {new Date().getFullYear()} PartKasa</div>
          </footer>
        </div>
      </body>
    </html>
  );
}

