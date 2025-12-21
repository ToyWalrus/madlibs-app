import type { ComponentProps } from 'react';
import Markdown from 'react-markdown';

import { Text } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

export function CustomMarkdown(props: ComponentProps<typeof Markdown>) {
	return (
		<Markdown
			{...props}
			components={{
				...props.components,
				p: props => <span {...props} />,
				strong: props => <Text styles={style({ fontWeight: 'bold' })}>{props.children}</Text>,
			}}
		/>
	);
}
