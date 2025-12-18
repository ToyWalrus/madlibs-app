import type { ReactNode } from 'react';

import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import clsx from 'clsx';

interface PageLayoutProps {
	children: ReactNode;
	isEmptyPage?: boolean;
	className?: string;
}

export function PageLayout({ children, className, isEmptyPage = false }: PageLayoutProps) {
	return (
		<div
			className={clsx(
				className,
				style({
					display: 'flex',
					flexDirection: 'column',
					height: 'full',
					paddingX: 16,
					paddingY: 8,
					overflowY: 'auto',
					overflowX: 'hidden',
					alignItems: {
						isEmptyPage: 'center',
						default: 'center',
						md: 'start',
						lg: 'start',
					},
					width: {
						// default: 'full',
						md: 500,
						lg: 600,
					},
				})({ isEmptyPage }),
			)}
		>
			{children}
		</div>
	);
}
