import { CustomMarkdown } from '@/components/CustomMarkdown';

interface AnimatedStoryProps {
	markdown: string;
	animationDuration?: number;
	animationDelay?: number;
}

export function AnimatedStory({ markdown, animationDelay = 500, animationDuration = 1200 }: AnimatedStoryProps) {
	const chunks = markdown.split(/\n\s*\n/).filter(Boolean);

	return (
		<div>
			<style>{`
				@keyframes madlibsReveal {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.madlibs-reveal { opacity: 0; }
			`}</style>
			{chunks.map((chunk, i) => (
				<div
					key={i}
					className="madlibs-reveal"
					style={{
						animationName: 'madlibsReveal',
						animationDuration: `${animationDuration}ms`,
						animationFillMode: 'forwards',
						animationTimingFunction: 'cubic-bezier(.2,.9,.3,1)',
						animationDelay: `${i * animationDelay}ms`,
						position: 'relative',
					}}
				>
					<div
						style={{
							background:
								'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, .6) 20%, transparent 40%)',
							backgroundSize: '200% 100%',
							backgroundPosition: '200% 0',
							backgroundRepeat: 'no-repeat',
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							color: 'transparent',
							animation: `shimmer 3s cubic-bezier(.2,.9,.3,1) forwards`,
							animationIterationCount: 1,
							animationDelay: `${i * animationDelay}ms`,
							pointerEvents: 'none',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					>
						<CustomMarkdown>{chunk}</CustomMarkdown>
					</div>
					<CustomMarkdown>{chunk}</CustomMarkdown>
				</div>
			))}
		</div>
	);
}
