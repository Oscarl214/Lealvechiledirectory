'use client';
import React from 'react';
import signIn from '../app/firebase/auth/signin';
import { useRouter } from 'next/navigation';
import { Image, Button } from '@nextui-org/react';
import Link from 'next/link';
function SignInPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [errorMessage, setErrorMessage] = React.useState('');

  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault();

    const { result, error } = await signIn(email, password);

    if (error) {
      setErrorMessage('Wrong password, try again');
      setPassword('');
      return;
    }

    // else successful
    console.log(result);
    return router.push('/admin');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(''); // Clear the error message
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage(''); // Clear the error message
  };

  return (
    <main className="flex min-h-screen flex-col lg:flex-row items-center justify-around lg:m-[5rem]">
      <div>
        {' '}
        <Image
          isZoomed
          isBlurred
          width={550}
          height={500}
          src="https://firebasestorage.googleapis.com/v0/b/lealvehicledirectory.appspot.com/o/SignUpPageGTR.jpg?alt=media&token=0bd51fcd-b6ab-4018-85ca-ce1e660b6dc4"
          alt="Nissan GTR"
          className="m-5"
        />
      </div>
      <section class="">
        <div class="flex flex-col items-center justify-center  lg:py-0">
          <a
            href="#"
            class="flex items-center mb-6 text-2xl font-semibold text-5xl"
          >
            {/* <img
              class="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            /> */}
            Sign In
          </a>
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form
                class="space-y-4 md:space-y-6"
                action="#"
                onSubmit={handleForm}
              >
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@gmail.com"
                    required=""
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={password}
                    required=""
                    onChange={handlePasswordChange}
                  />
                </div>

                <Button
                  color="primary"
                  variant="bordered"
                  className="text-white"
                  type="submit"
                >
                  Sign In
                </Button>
                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessage}
                  </div>
                )}
                <p class="text-sm font-light  text-gray-500 dark:text-gray-400">
                  Don{''}t have an Account?
                  <a
                    href="/signup"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500 pl-2"
                  >
                    Sign Up Here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignInPage;
