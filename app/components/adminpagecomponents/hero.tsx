import React from 'react';

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
      <div className="div-center m-3">
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
          Family Vehicle Maintenance Hub
        </h1>
        <p className=" text-2xl md:text-3xl lg:text-2xl leading-tight pt-4">
          A dedicated digital space for documenting all our vehicle maintenance.
        </p>
      </div>
    </div>
  );
};

export default AdminHero;
