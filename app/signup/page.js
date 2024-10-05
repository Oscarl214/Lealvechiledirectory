'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Image, Button } from '@nextui-org/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
export default function SignUpPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault();

    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your email');
      toast.error('Please enter your email');
    }

    if (!password) {
      setErrorMessage('Please enter a password');
      toast.error('Please enter a password');
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        toast.success('Account created. Please Sign in!');

        router.push('/');
      } else {
        setErrorMessage(data.error || 'An error occurred. Please try again');
        toast.error(data.error || 'An error occurred. Please try again');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred. Please try again');
      toast.error('An unexpected error occurred. Please try again');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  return (
    <div
      className="hero border border-bottom border-black "
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(https://firebasestorage.googleapis.com/v0/b/lealvehicledirectory.appspot.com/o/SignInTruck.jpg?alt=media&token=f1cb4d7f-c922-458c-9837-2451f523142d)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <main className="flex wrap-reverse lg:flex-nowrap h-screen flex-col lg:flex-row items-center justify-around">
        <section>
          <div className="flex flex-col items-center justify-center lg:py-0">
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                LEAL{' '}
              </span>
              DIRECTORY
            </h1>

            <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form className="space-y-4 md:space-y-6" onSubmit={handleForm}>
                  <h2>Sign Up</h2>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@gmail.com"
                      required
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <Button
                    color="primary"
                    variant="bordered"
                    className="text-white hover:bg-blue-400"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                  {errorMessage && (
                    <div className="text-red-500 text-sm mt-2">
                      {errorMessage}
                    </div>
                  )}
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an Account?
                    <a
                      href="/"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500 pl-2"
                    >
                      Sign In
                    </a>
                  </p>
                </form>
                {/* <p>or</p>
                <div className="max-w-sm text-start">
                  <Button
                    type="button"
                    className="text-white w-full bg-transparent hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-start inline-flex items-start justify-between mr-2 mb-2"
                    variant="bordered"
                    onClick={() => signIn('google', { callbackUrl: '/admin' })}
                  >
                    <svg
                      className="mr-2 -ml-1 w-4 h-4"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="google"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 488 512"
                    >
                      <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                      ></path>
                    </svg>
                    Sign Up with Google<div></div>
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </section>
        {/* <div>
        <Image
          width={550}
          // height={500}
          src="https://firebasestorage.googleapis.com/v0/b/lealvehicledirectory.appspot.com/o/SignInTruck.jpg?alt=media&token=f1cb4d7f-c922-458c-9837-2451f523142d"
          alt="Nissan GTR"
          className="mt-3 lg:m-5 rounded-sm lg:h-[850] h-[550]"
        />
      </div> */}
      </main>
    </div>
  );
}
