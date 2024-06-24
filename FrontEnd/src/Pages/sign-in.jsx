import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { BackgroundGradientAnimation } from '../Components/Meteor';

export default function SignInPage() {
  return (
    <div className="relative"> {/* Add relative positioning to the container */}
      <BackgroundGradientAnimation className="absolute inset-0 z-0" /> {/* Move the gradient animation behind */}
      <div className="absolute inset-0 flex items-center justify-center z-10"> {/* Ensure content stays on top */}
        <div className="flex flex-col items-center justify-center text-white font-bold px-4 text-center">
          <img src="logo.png" alt="Logo" className="mb-8" style={{ height: '9rem' }} />
          <div className="text-orange-500 mb-10">
            <SignIn signUpUrl="/sign-up" redirectUrl="/combined" />
          </div>
        </div>
      </div>
    </div>
  );
}
