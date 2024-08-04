'use client'; // Ensure this is at the top of your file

import { useSession } from 'next-auth/react';

const AdminPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Access Denied</p>;
  }

  return <p>Welcome to the Admin Page</p>;
};

export default AdminPage;
