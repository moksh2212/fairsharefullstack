import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import App from './App';
import './index.css';
import store from './redux/store';
import { Provider } from 'react-redux';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={{ baseTheme: dark }}
      >
        <App />
      </ClerkProvider>
    </Provider>
 
);
