'use client'; // Ensure this is at the top of your file

import { useSession } from 'next-auth/react';
import NavBar from '../components/navbar';
import AdminHero from '../components/adminpagecomponents/hero';
import Features from '../components/adminpagecomponents/features';
import Footer from '../components/footer';
import Header from '../components/adminpagecomponents/header';

const AdminPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Access Denied | HAHAH LOSER!</p>;
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
