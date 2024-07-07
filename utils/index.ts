// import { CarProps } from '@/app/types';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from '../app/firebase/config';
export async function fetchCars() {
  const headers = {
    'x-rapidapi-key': '9945cc4495msh5c3f59c2d03519cp1ac84ajsn025f89e35f6f',
    'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com',
  };
  const response = await fetch(
    'https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=bmw',
    {
      headers: headers,
      cache: 'no-cache',
    }
  );

  const result = await response.json();

  console.log(result);
  return result;
}



async function fetchVehicles() {
  const response = await fetch(`http://localhost:3000/api`, {
    method: 'GET',
  });

  return response.json();
}

export const addVehicleToProfile = async (userId:any, vehicle:any) => {
  const userDocRef = doc(db, 'users', userId);

  try {
    await updateDoc(userDocRef, {
      vehicles: arrayUnion(vehicle),
    });
    console.log('Vehicle added successfully');
  } catch (error) {
    console.error('Error adding vehicle: ', error);
  }
};


// export const addVehicleToProfile = async (userId: string, vehicle: any) => {
//   try {
//     const userDocRef = doc(db, 'users', userId);
//     const userDoc = await getDoc(userDocRef);

//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       const vehicles = userData.vehicles || [];

//       // Check if the vehicle already exists in the array
//       const existingVehicle = vehicles.find((v: any) => v.id === vehicle.id);
//       if (!existingVehicle) {
//         // Add the new vehicle to the array
//         vehicles.push(vehicle);

//         // Update the user document with the new vehicles array
//         await setDoc(userDocRef, { ...userData, vehicles });
//       } else {
//         console.log('Vehicle already exists in user profile');
//       }
//     } else {
//       throw new Error('User document not found');
//     }
//   } catch (error) {
//     console.error('Error adding vehicle to user profile:', error);
//     throw error; // Propagate the error to handle it further up the call stack
//   }
// };

export const getUsersVehicle = async (userId: any) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();

      const vehicles = userData.vehicles || [];

      return vehicles;
    } else {
      throw new Error('User document not found');
    }
  } catch (error) {
    console.error('Error retrieving user vehicles:', error);
    throw error;
  }
};
