import React from 'react';
import firebase_app from '../config';

const auth = getAuth(firebase_app);

import { signOut, getAuth } from 'firebase/auth';
export default async function logOut() {
  await signOut(auth);

  console.log('user logged Out');
}
