import { getAuth, signOut } from 'firebase/auth';
import { firebase_app } from '../config';
import Cookies from 'js-cookie';

const auth = getAuth(firebase_app);

export default async function logOut() {
  try {
    await signOut(auth);
    Cookies.remove('token');
    console.log('User logged out, token destroyed');
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
