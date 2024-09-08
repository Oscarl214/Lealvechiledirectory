import React from 'react';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
const AdminHero = () => {
  return (
    <div
      className="hero h-screen "
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(https://newportv2.s3.us-east-2.amazonaws.com/HeroBG.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex flex-col justify-center h-screen items-start ml-2 pt-4 ">
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight m-5">
          Leal Vehicle Maintenance Hub
        </h1>
        <p className="text-2xl md:text-3xl lg:text-2xl leading-tight pt-4 ml-5">
          A dedicated digital space for documenting all our vehicle maintenance.
        </p>
        <p className="text-start text-md md:text-lg lg:text-xl leading-tight pt-4 pb-4 ml-5">
          Scroll Down to View Features.
        </p>
        <Link href={'/vehicleselection'}>
          <Button className="bg-orange-600 mt-2 ml-5">Browse Vehicles</Button>
        </Link>
        <Link href={'/profile'}>
          <Button className="button ml-5">My Vehicle</Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminHero;
