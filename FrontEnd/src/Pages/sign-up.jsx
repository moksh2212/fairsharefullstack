import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { BackgroundGradientAnimation } from '../Components/Meteor';

export default function SignUpPage() {
  return (
    <div className="relative"> {/* Add relative positioning to the container */}
      <BackgroundGradientAnimation className="absolute inset-0 z-0" /> {/* Move the gradient animation behind */}
      <div className="absolute inset-0 flex items-center justify-center z-10"> {/* Ensure content stays on top */}
        <div className="flex flex-row items-center  text-white font-bold px-4 text-center gap-5 mr-40">
        <img src="logo.png" alt="Logo" className="mb-7 mt-39" style={{ height: '9rem' }} />
          <div className="text-orange-500 mb-10 mt-4">
            <SignUp signInUrl="/sign-in" />
          </div>
          
        </div>
      </div>
    </div>
  );
}
