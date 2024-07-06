import { firebase_app } from '../config';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import Cookies from 'js-cookie';
const auth = getAuth(firebase_app);

export default async function logIn(email, password) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    Cookies.set('token', token, { expires: 1 });
  } catch (e) {
    error = e;
  }

  return { result, error };
}
