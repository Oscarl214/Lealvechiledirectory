import React, { useEffect, useState } from 'react';
import NavBar from '../components/navbar';
import { SearchBar, CarCard } from '../components/index';
import { fetchCars } from '@/utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyIdToken } from '../firebase/firebaseAdmin';
const AdminView = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return redirect('/');
  }

  const decodedToken = await verifyIdToken(token);

  if (!decodedToken) {
    return redirect('/');
  }

  const allCars = await fetchCars();

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <div className="bg-gray-300 h-vh100 w-screen ">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="flex justify-center items-center">
          <SearchBar />
        </div>
        {!isDataEmpty ? (
          <section>
            <div className="">
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>
          </section>
        ) : (
          <div>
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;

{
  /* <div className=" flex-1 flex items-center justify-center">
        <div className=" top-[350px] animation-delay-2000 -left-[-700px] w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div>
        <div className=" top-[350px] animation-delay-4000 -right-[-700px] w-72 h-72 opacity-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className=" animation-delay-2000 -bottom-[-300px] left-[825px] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div> */
}
