import { useEffect, useState } from 'react';

import { pickRandom } from '@/utils/helperFunctions';

import './Confetti.css';

interface ConfettiPiece {
	id: number;
	left: number;
	delay: number;
	duration: number;
	color: string;
	type: 'falling' | 'floating';
}

export function Confetti() {
	const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

	useEffect(() => {
		const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
		const newPieces: ConfettiPiece[] = [];

		for (let i = 0; i < 30; i++) {
			newPieces.push({
				id: i,
				left: Math.random() * 100,
				delay: Math.random() * 300,
				duration: 3000 + Math.random() * 2000,
				color: pickRandom(colors),
				type: pickRandom(['falling', 'floating']),
			});
		}

		setPieces(newPieces);

		// Clean up confetti after animation completes
		const timer = setTimeout(() => {
			setPieces([]);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="confetti-container">
			{pieces.map(piece => (
				<div
					key={piece.id}
					className={`confetti ${piece.type}`}
					style={{
						left: `${piece.left}%`,
						top: '-10px',
						backgroundColor: piece.color,
						borderRadius: Math.random() > 0.5 ? '50%' : '0%',
						animationDelay: `${piece.delay}ms`,
						animationDuration: `${piece.duration}ms`,
					}}
				/>
			))}
		</div>
	);
}
