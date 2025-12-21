import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	Button,
	Content,
	Heading,
	InlineAlert,
	Text,
	TextArea,
	TextField,
	UNSTABLE_ToastQueue,
} from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { CustomMarkdown } from '@/components/CustomMarkdown';
import { PageLayout } from '@/components/PageLayout';
import { saveTemplate } from '@/database';
import type { Template } from '@/types';
import { generateShareId } from '@/utils/helperFunctions';

interface TemplateCreationProps {
	existingTemplate?: Template;
}

export function TemplateCreation({ existingTemplate }: TemplateCreationProps) {
	const [text, setText] = useState(existingTemplate?.text ?? '');
	const [title, setTitle] = useState(existingTemplate?.title ?? '');
	const templateShareId = useMemo(() => existingTemplate?.shareId ?? generateShareId(), []);
	const navigate = useNavigate();

	return (
		<PageLayout
			className={style({ gap: 8 })}
			showBackButton
			title={`${existingTemplate ? 'Edit' : 'New'} story`}
			headerActions={
				<Button
					variant="accent"
					onPress={() => {
						saveTemplate({
							text,
							title,
							shareId: templateShareId,
						});
						UNSTABLE_ToastQueue.positive('Saved', { timeout: 3000 });
						navigate('/');
					}}
				>
					Save
				</Button>
			}
		>
			<TextField
				styles={style({ width: 'full', marginBottom: 8 })}
				label="Story name"
				placeholder="My story"
				value={title}
				onChange={setTitle}
			/>
			<TextArea
				placeholder="Once upon a time..."
				styles={style({ width: 'full', marginBottom: 16 })}
				value={text}
				onChange={setText}
			/>
			<InstructionArea />
		</PageLayout>
	);
}

function InstructionArea() {
	const importantPoints = [
		'Put category names in `[brackets]` where you want a random word',
		'Anything in brackets is treated as a category name (e.g. `[noun]`, `[verb]`, `[subject in school]`, `[holiday]`)',
		'The same category can appear multiple times in your story and a different word will be chosen each time',
		'To use the **same** word multiple times, add `:1`, `:2`, etc. after the category (e.g. `[name:1]` will always use the same word wherever `[name:1]` appears)',
	];
	const examplePoint =
		'**Example**: "My friend `[name:1]` went to the `[place]`. `[name:1]` saw a `[adjective]` `[animal]`." (Both `[name:1]` references will use the same name)';

	return (
		<InlineAlert variant="neutral" fillStyle="subtleFill" styles={style({ width: 'full' })}>
			<Heading>How it works</Heading>
			<Content>
				<Text>Write your story template with placeholders for random words:</Text>
				<ul>
					{importantPoints.map(txt => (
						<li key={txt} className={style({ marginY: 4 })}>
							<CustomMarkdown>{txt}</CustomMarkdown>
						</li>
					))}
				</ul>
				<CustomMarkdown>{examplePoint}</CustomMarkdown>
			</Content>
		</InlineAlert>
	);
}
