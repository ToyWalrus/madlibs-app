import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: find way to do a secret store? Do these secrets get bundled in the output?
export const app = initializeApp({
	appId: import.meta.env.VITE_FB_APP_ID,
	apiKey: import.meta.env.VITE_FB_API_KEY,
	projectId: import.meta.env.VITE_FB_PROJ_ID,
	authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
	storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
	measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
	messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
});

export const db = getFirestore(app);
