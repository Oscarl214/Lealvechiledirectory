/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth.user().onCreate((user) => {
  return db.collection('users').doc(user.uid).set({
    email: user.email,
    vehicles: [],
  });
});

export const addVehicleToProfile = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const userDoc = db.collection('users').doc(context.auth.uid);
    const vehicleId = data.id;

    console.log(vehicleId);
    try {
      const userSnapshot = await userDoc.get();
      const userData = userSnapshot.data();

      if (!userData) {
        throw new functions.https.HttpsError('not-found', 'User not found');
      }

      if (userData.vehicles.includes(vehicleId)) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'You can only add the vehicle once'
        );
      }

      await userDoc.update({
        vehicles: [...userData.vehicles, vehicleId],
      });

      return { message: 'Vehicle added successfully' };
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unable to add vehicle';
      throw new functions.https.HttpsError('internal', errorMessage);
    }
  }
);

export const getAllCarsData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The user must be authenticated.'
    );
  }

  try {
    const vehiclesSnapshot = await db.collection('vehicles').get();
    const vehicles: any[] = [];

    vehiclesSnapshot.forEach((doc: { id: any; data: () => any }) => {
      vehicles.push({ id: doc.id, ...doc.data() });
    });

    return { vehicles };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw new functions.https.HttpsError(
      'unknown',
      'Failed to fetch vehicles',
      error
    );
  }
});

export const getOneCarData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The user must be authenticated.'
    );
  }

  const { vehicleId } = data;
  if (!vehicleId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with the "vehicleId".'
    );
  }
  try {
    const vehicleDoc = await db.collection('vehicles').doc(vehicleId).get();

    if (!vehicleDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'The vehicle with the provided ID does not exist.'
      );
    }

    return { id: vehicleDoc.id, ...vehicleDoc.data() };
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    throw new functions.https.HttpsError(
      'unknown',
      'Failed to fetch vehicle data',
      error
    );
  }
});
