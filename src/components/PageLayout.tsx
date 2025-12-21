import type { ReactNode } from 'react';

import { Heading } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import clsx from 'clsx';

interface PageLayoutProps {
	children: ReactNode;
	title?: string;
	headerActions?: ReactNode;
	isEmptyPage?: boolean;
	className?: string;
}

export function PageLayout({ children, title, headerActions, className, isEmptyPage = false }: PageLayoutProps) {
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
			{(title || headerActions) && (
				<div
					className={style({
						flexDirection: 'row',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 16,
						alignSelf: 'start',
						width: 'full',
					})}
				>
					<Heading level={1} styles={style({ alignSelf: 'start', fontWeight: 'normal', color: 'heading' })}>
						{title}
					</Heading>
					{headerActions}
				</div>
			)}
			{children}
		</div>
	);
}
