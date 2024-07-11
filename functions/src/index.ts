/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth.user().onCreate((user:any) => {
  return db.collection('users').doc(user.uid).set({
    email: user.email,
    vehicles: [],
  });
});


export const getVehicles = functions.https.onCall(async (data: any, context: any) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User is not authenticated'
    );
  }

  try {
    const vehicleDocRef = db.collection('vehicles');
    const snapshot = await vehicleDocRef.get();

    if (snapshot.empty) {
      return { vehicles: [] };
    }

    const vehicles: any[] = [];
    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      vehicles.push({ id: doc.id, ...doc.data() });
    });

    return { vehicles };
  } catch (error) {
    throw new functions.https.HttpsError(
      'unknown',
      'Failed to fetch vehicle data',
      error
    );
  }
});




export const addVehicleToProfile = functions.https.onCall(
  async (data:any, context:any) => {
    if (!context) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User is not unauthenticated'
      );
    }

    const { userId, vehicle } = data;

    if (!userId || !vehicle) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with both "userId" and "vehicle"'
      );
    }
    const userDocRef = db.collection('users').doc(userId);

    try {
      await userDocRef.update({
        vehicles: admin.firestore.FieldValue.arrayUnion(vehicle),
      });
      return { message: 'Vehicle added successfully' };
    } catch (error) {
      throw new functions.https.HttpsError(
        'unknown',
        'Failed to add vehicle',
        error
      );
    }
  }
);
