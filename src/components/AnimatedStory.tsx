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
					}}
				>
					<CustomMarkdown>{chunk}</CustomMarkdown>
				</div>
			))}
		</div>
	);
}
