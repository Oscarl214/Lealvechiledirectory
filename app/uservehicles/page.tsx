'use client';
import React, { useState, useEffect } from 'react';
import UsersCar from '../components/usersvehiclespage/UsersCar';
import NavBar from '../components/navbar';
import { Suspense } from 'react';
import Loading from './loading';
const UserVehicles = () => {
  return (
    <div>
      <NavBar />
      <div className="">
        <UsersCar />
      </div>
    </div>
  );
};

export default UserVehicles;
