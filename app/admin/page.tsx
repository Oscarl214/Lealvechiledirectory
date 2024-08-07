'use client'; // Ensure this is at the top of your file

import { useSession } from 'next-auth/react';
import NavBar from '../components/navbar';
import AdminHero from '../components/adminpagecomponents/hero';
import Features from '../components/adminpagecomponents/features';
const AdminPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Access Denied</p>;
  }

  return (
    <div className="">
      <NavBar />
      <div className="hero-section">
        <AdminHero />
      </div>
      <div className="section">
      
        <Features />
      </div>
    </div>
  );
};

export default AdminPage;
