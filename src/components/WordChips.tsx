import type { HTMLProps } from 'react';

export function WordChips({
	words = [],
	onRemove,
	...props
}: { words: string[]; onRemove?: (word: string) => void } & Exclude<HTMLProps<HTMLDivElement>, 'children'>) {
	return (
		<div {...props}>
			{words.map(word => (
				<span key={word} className="word-chip">
					{word}
					{onRemove && <button onClick={() => onRemove(word)}>X</button>}
				</span>
			))}
		</div>
	);
}
