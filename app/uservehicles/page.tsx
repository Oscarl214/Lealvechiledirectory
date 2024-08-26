'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const UserVehicles = () => {
  const { data: session, status } = useSession();
  const [vehicles, setVehicles] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const getUsersVehicles = async () => {
      try {
        const response = await fetch('/api/uservehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Car data', data);
          setVehicles(data.CarData);
        } else {
          console.error('Failed to fetch vehicles');
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    getUsersVehicles();
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!vehicles) {
    return <div>No vehicles found</div>;
  }

  return (
    <div>
      <h2>Your Vehicles</h2>
      <ul></ul>
    </div>
  );
};

export default UserVehicles;
