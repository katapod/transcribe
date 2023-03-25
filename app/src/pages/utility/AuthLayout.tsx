import { Suspense } from 'react';
import { Await, useLoaderData, useOutlet } from 'react-router-dom';

import { AuthProvider, UserData } from '../../components/authentication/AuthProvider';

type LoaderData = {
  userPromise: Promise<UserData>;
};

export const AuthLayout = () => {
  const outlet = useOutlet();
  const { userPromise } = useLoaderData() as LoaderData;
  return (
    <Suspense>
      <Await resolve={userPromise} errorElement={<div>Something went wrong!</div>}>
        {(user) => <AuthProvider userData={user}>{outlet}</AuthProvider>}
      </Await>
    </Suspense>
  );
};
