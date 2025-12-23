import { type ReactNode, useState, useCallback, useEffect, useRef } from 'react';

import { Button, Content, Heading, InlineAlert, ProgressCircle, UNSTABLE_ToastQueue } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { PageLayout } from '@/components/PageLayout';
import { authenticate } from '@/database/firebase';

export function AuthWrapper({ children }: { children: ReactNode }) {
	const [isSigningIn, setIsSigningIn] = useState(false);
	const [hasError, setHasError] = useState(false);
	const hasSignedIn = useRef(false);

	const signInAnonymously = useCallback(async () => {
		if (hasSignedIn.current) return;
		console.log('has not signed in');

		setIsSigningIn(true);
		setHasError(false);
		try {
			await authenticate();
			hasSignedIn.current = true;
		} catch (e) {
			console.error('FIREBASE ERROR: ', e);
			setHasError(true);
			UNSTABLE_ToastQueue.negative('Unable to load the application', {
				actionLabel: 'Retry',
				onAction: signInAnonymously,
				shouldCloseOnAction: true,
			});
		} finally {
			setIsSigningIn(false);
		}
	}, []);

	useEffect(() => {
		signInAnonymously();
	}, []);

	if (isSigningIn) {
		return (
			<div
				className={style({
					height: 'full',
					width: 'full',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				})}
			>
				<ProgressCircle isIndeterminate size="L" aria-label="Loading..." />
			</div>
		);
	}

	if (hasError) {
		return (
			<PageLayout title="Problems" headerActions={<Button onPress={signInAnonymously}>Retry</Button>}>
				<InlineAlert styles={style({ marginTop: 24 })} variant="negative">
					<Heading>Error loading</Heading>
					<Content>The app is unable to load due to some internet error.</Content>
				</InlineAlert>
			</PageLayout>
		);
	}

	return children;
}
