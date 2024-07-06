import firebase_app from '../config';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import Cookies from 'js-cookie';

const auth = getAuth(firebase_app);

const createUserDocument = async (user) => {
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      email: user.email,
      vehicles: [],
    });
  }
};

export default async function signUp(email, password) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    Cookies.set('token', token, { expires: 1 });

    await createUserDocument(result.user);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
