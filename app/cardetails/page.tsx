// 'use client';
// import Image from 'next/image';
// import NavBar from '../components/navbar';
// import { getFunctions, httpsCallable } from 'firebase/functions';
// import { firebase_app } from '../firebase/config';
// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// const VehicleID = ({ params }: any) => {
//   const [vehicle, setVehicle] = useState<any>(null);
//   const searchParams = useSearchParams();
//   const vehicleID = searchParams.get('carID');

//   useEffect(() => {
//     if (vehicleID) {
//       const functions = getFunctions(firebase_app);
//       const getVehicleData = httpsCallable(functions, 'getOneCarData');

//       getVehicleData({ vehicleId: vehicleID })
//         .then((result) => {
//           setVehicle(result.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching vehicle data:', error);
//         });
//     }
//   }, [vehicleID]);

//   if (!vehicle) {
//     return (
//       <div>
//         <NavBar />
//         <p>Loading vehicle data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#D3D3D3]">
//       <NavBar />
//       <div className="flex flex-col justify-center items-center">
//         <h1 className="text-black m-5 text-4xl font-bold">
//           {vehicle.make} {vehicle.model} {vehicle.year}
//         </h1>
//         <Image
//           src={vehicle.image}
//           alt={vehicle.make}
//           width={800}
//           height={800}
//           className="animate-float z-50"
//         />
//       </div>
//       <div className="flex flex-row justify-center text-gray-700">
//         <span className="icon-[ph--line-vertical-thin] text-black"></span>
//         <ul className="flex flex-row justify-around gap-5 text-xl">
//           <li>MPG: {vehicle.city_mpg}</li>
//           <li>Drive: {vehicle.drive}</li>
//           <li>Transmission: {vehicle.transmission}</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default VehicleID;
