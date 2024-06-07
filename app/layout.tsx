import type { Metadata } from 'next';
import { Inter, Roboto_Serif } from 'next/font/google';
import './globals.css';
import { AuthContextProvider } from './context/AuthContext';
import Providers from './providers';

const Robo = Roboto_Serif({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={Robo.className}>
        <AuthContextProvider>
          <Providers>{children}</Providers>
        </AuthContextProvider>
      </body>
    </html>
  );
}
