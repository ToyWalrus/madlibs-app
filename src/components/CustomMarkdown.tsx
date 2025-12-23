import type { ComponentProps, HTMLProps } from 'react';
import Markdown from 'react-markdown';

import { Text } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { extractColorFromWord } from '@/utils/extractCategories';

export function CustomMarkdown(props: ComponentProps<typeof Markdown>) {
	return (
		<Markdown
			{...props}
			components={{
				...props.components,
				p: props => <span {...props} />,
				code: WordReplacement,
				strong: props => <Text styles={style({ fontWeight: 'bold' })}>{props.children}</Text>,
			}}
		/>
	);
}

function WordReplacement(props: HTMLProps<any>) {
	const { color, word } = extractColorFromWord(props.children as string);
	const styleFn = style({
		fontWeight: 'bold',
		color: {
			variant: {
				default: 'unset',
				red: 'red-800',
				orange: 'orange-800',
				yellow: 'yellow-600',
				chartreuse: 'chartreuse-800',
				celery: 'celery-800',
				green: 'green-800',
				seafoam: 'seafoam-800',
				cyan: 'cyan-800',
				blue: 'blue-800',
				indigo: 'indigo-800',
				purple: 'purple-800',
				fuchsia: 'fuchsia-800',
				gray: 'gray-600',
			},
		},
	});

	return <Text styles={styleFn({ variant: color })}>{word}</Text>;
}
