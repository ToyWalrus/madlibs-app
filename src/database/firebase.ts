import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export function authenticate() {
	const auth = getAuth(app);
	return signInAnonymously(auth);
}
