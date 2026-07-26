import './globals.css';

export const metadata = { title: 'SmartFM', description: 'SmartFM logistics system' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
