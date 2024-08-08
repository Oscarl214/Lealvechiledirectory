'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Image, Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
function SignInPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
      toast.error('Incorrect Email, Please try again');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      toast.error('Incorrect Password, Please try again');
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        toast.error(result.error);
      } else if (result?.ok) {
        router.push('/admin');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again');
        toast.error('An unexpected error occurred. Please try again');
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
    <main className="flex wrap-reverse lg:flex-nowrap h-screen w-screen flex-col lg:flex-row items-center justify-around bg-black mt-[130px]">
      <section>
        <div className="flex flex-col items-center justify-center lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-5xl"
          >
            <h1 className="text-xl text-blue text-center  text-white m-2">
              LEAL VEHICLE DIRECTORY
            </h1>
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form className="space-y-4 md:space-y-6" onSubmit={handleForm}>
                <h2>Sign In</h2>
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
                    value={password}
                    required
                    onChange={handlePasswordChange}
                  />
                </div>

                <Button
                  color="primary"
                  variant="bordered"
                  className="text-white hover:bg-blue-400"
                  type="submit"
                >
                  Sign In
                </Button>
                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessage}
                  </div>
                )}
                <p>or</p>
                <div className="max-w-sm text-start">
                  <Button
                    type="button"
                    className="text-white w-full bg-transparent hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-start inline-flex items-start justify-between mr-2 mb-2"
                    variant="bordered"
                    onClick={() => console.log('Sign In with Google')}
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
                    Sign in with Google
                  </Button>
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don{''}t have an Account?
                  <a
                    href="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500 pl-2"
                  >
                    Sign Up Here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div>
        <Image
          width={550}
          height={300}
          src="https://firebasestorage.googleapis.com/v0/b/lealvehicledirectory.appspot.com/o/SignUpPageGTR.jpg?alt=media&token=0bd51fcd-b6ab-4018-85ca-ce1e660b6dc4"
          alt="Nissan GTR"
          className="mt-3 lg:m-5 rounded-sm"
        />
      </div>
    </main>
  );
}

export default SignInPage;
