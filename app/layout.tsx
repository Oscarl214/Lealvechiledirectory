import type { Metadata } from 'next';
import { Inter, Roboto_Serif, Bitter, Noto_Serif } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { Toaster } from 'react-hot-toast';
// const Robo = Roboto_Serif({ subsets: ['latin'] });

const Bit = Noto_Serif({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Leals Car Directory',
  description: 'Created by Oscar Leal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={Bit.className}>
        <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
