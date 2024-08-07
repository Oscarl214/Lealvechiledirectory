import React from 'react';
import { Button } from '@nextui-org/react';
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
      <div className="div-center m-3 pt-4">
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
          Leal Vehicle Maintenance Hub
        </h1>
        <p className="text-2xl md:text-3xl lg:text-2xl leading-tight pt-4">
          A dedicated digital space for documenting all our vehicle maintenance.
        </p>

        <Button
          className="bg-blue-500 text-white text-start m-4"
          variant="shadow"
        >
          Browse Vehicles
        </Button>
      </div>
    </div>
  );
};

export default AdminHero;
