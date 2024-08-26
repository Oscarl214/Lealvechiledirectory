'use client';
import React, { useState, useEffect } from 'react';
import UsersCar from '../components/usersvehiclespage/UsersCar';
const UserVehicles = () => {
  return (
    <div>
      <h2>Your Vehicles</h2>
      <UsersCar />
    </div>
  );
};

export default UserVehicles;
