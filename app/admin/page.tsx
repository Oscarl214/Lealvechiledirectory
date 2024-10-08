'use client';

import { useSession } from 'next-auth/react';
import NavBar from '../components/navbar';
import AdminHero from '../components/adminpagecomponents/hero';
import Features from '../components/adminpagecomponents/features';
import Footer from '../components/footer';
import Header from '../components/adminpagecomponents/header';
import { Button, Spinner } from '@nextui-org/react';
import Link from 'next/link';
const AdminPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Link href="/">
          <Spinner size="lg" />
        </Link>
      </div>
    );
  }

  return (
    <div className="">
      <NavBar />
      <div className="hero-section">
        <AdminHero />
      </div>
      <div className="headersection">
        <Header />
      </div>
      <div className="section m-3">
        <Features />
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
