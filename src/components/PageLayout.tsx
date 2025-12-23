import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { ActionButton, Heading } from '@react-spectrum/s2';
import ChevronLeft from '@react-spectrum/s2/icons/ChevronLeft';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import clsx from 'clsx';

interface PageLayoutProps {
	children: ReactNode;
	title?: string;
	headerActions?: ReactNode;
	isEmptyPage?: boolean;
	className?: string;
	showBackButton?: boolean;
}

export function PageLayout({
	children,
	title,
	showBackButton,
	headerActions,
	className,
	isEmptyPage = false,
}: PageLayoutProps) {
	const navigate = useNavigate();
	return (
		<div
			className={clsx(
				className,
				style({
					display: 'flex',
					flexDirection: 'column',
					height: 'calc(100% - 16px)',
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
						md: 500,
						lg: 600,
					},
				})({ isEmptyPage }),
			)}
		>
			{(title || headerActions || showBackButton) && (
				<div
					className={style({
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						height: 64,
						gap: 16,
						width: 'full',
						marginTop: 8,
					})}
				>
					<div
						className={style({
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: 12,
						})}
					>
						{showBackButton && (
							<ActionButton isQuiet size="L" onPress={() => navigate(-1)}>
								<ChevronLeft />
							</ActionButton>
						)}
						<Heading
							level={1}
							styles={style({
								fontWeight: 'normal',
								color: 'heading',
								margin: 0,
								alignSelf: 'start',
							})}
						>
							{title}
						</Heading>
					</div>
					{headerActions}
				</div>
			)}
			{children}
		</div>
	);
}
