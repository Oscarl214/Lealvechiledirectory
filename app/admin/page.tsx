'use client'; // Ensure this is at the top of your file

import { useSession } from 'next-auth/react';
import NavBar from '../components/navbar';
const AdminPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Access Denied</p>;
  }

  return (
    <div className="">
      <NavBar />
      <p>Welcome to the Admin Page</p>;{' '}
    </div>
  );
};

export default AdminPage;
