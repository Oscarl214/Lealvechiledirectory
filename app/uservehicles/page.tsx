'use client';
import React, { useState, useEffect } from 'react';
import UsersCar from '../components/usersvehiclespage/UsersCar';
import NavBar from '../components/navbar';
const UserVehicles = () => {
  return (
    <div>
      <NavBar />
      <h2>Your Vehicles</h2>
      <UsersCar />
    </div>
  );
};

export default UserVehicles;
