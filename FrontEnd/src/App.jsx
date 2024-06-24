import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInPage from './Pages/sign-in';
import SignUpPage from './Pages/sign-up';
import { Combined } from './Pages/Combined';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { GroupJoinPage } from './Pages/GroupJoinPage';
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <SignInPage />,
    },
    {
      path: '/sign-in',
      element: <SignInPage />,
    },
    {
      path: '/sign-up',
      element: <SignUpPage />,
    },
    {
      path: '/combined',
      element: (
        <>
          <SignedIn>
            <Combined />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn signInUrl="/sign-in" />
          </SignedOut>
        </>
      ),
    },
    {
      path: '/group-join/:groupid', // Define the dynamic route
      element: (
        <>
          <SignedIn>
            <GroupJoinPage /> 
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn signInUrl="/sign-in" />
          </SignedOut>
        </>
      ),
    },
  ]);

  return (
  
  <RouterProvider router={router} />
  
  );
}

export default App;
