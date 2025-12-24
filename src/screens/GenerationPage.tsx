import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IllustratedMessage, Heading, Content, ButtonGroup, LinkButton, Button, Text } from '@react-spectrum/s2';
import Edit from '@react-spectrum/s2/icons/Edit';
import Refresh from '@react-spectrum/s2/icons/Refresh';
import NoComment from '@react-spectrum/s2/illustrations/linear/NoComment';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { CustomMarkdown } from '@/components/CustomMarkdown';
import { PageLayout } from '@/components/PageLayout';
import { fetchWordbank } from '@/database';
import type { Template, WordBank } from '@/types';
import { generateStory } from '@/utils/generateStory';

interface GenerationPageProps {
	template?: Template;
}

export function GenerationPage({ template }: GenerationPageProps) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [storyText, setStoryText] = useState('');
	const navigate = useNavigate();

	const wordbankRef = useRef<WordBank | null>(null);

	const startStoryGeneration = useCallback(async () => {
		if (!template) return;
		if (!wordbankRef.current) {
			try {
				setIsGenerating(true);
				wordbankRef.current = await fetchWordbank(template.shareId);
			} finally {
				setIsGenerating(false);
			}
		}

		const text = generateStory(template.text, wordbankRef.current);
		setStoryText(`## ${template.title}\n\n${text}`);
	}, [template?.shareId]);

	useEffect(() => {
		startStoryGeneration();
	}, []);

	if (!template) {
		return <NoTemplate />;
	}

	return (
		<PageLayout
			title="Generate story"
			showBackButton
			className={style({ gap: 24 })}
			headerActions={
				<LinkButton onPress={() => navigate(`/create/${template.shareId}`)}>
					<Edit />
					<Text>Edit</Text>
				</LinkButton>
			}
		>
			<div
				className={style({
					backgroundColor: 'gray-100',
					borderRadius: 'lg',
					paddingBottom: 16,
					paddingX: 16,
					fontSize: 'body',
				})}
			>
				{isGenerating ? <h2>{template.title}</h2> : <CustomMarkdown>{storyText}</CustomMarkdown>}
			</div>
			<ButtonGroup styles={style({ alignSelf: 'end' })}>
				<Button
					variant="secondary"
					onPress={() => {
						wordbankRef.current = null;
						startStoryGeneration();
					}}
				>
					<Refresh />
					<Text>Refetch words</Text>
				</Button>
				<Button onPress={startStoryGeneration} variant="premium">
					Regenerate
				</Button>
			</ButtonGroup>
		</PageLayout>
	);
}

function NoTemplate() {
	const navigate = useNavigate();

	return (
		<div
			className={style({
				height: 'full',
				dispaly: 'flex',
				alignContent: 'center',
				justifyItems: 'center',
			})}
		>
			<IllustratedMessage size="L">
				<NoComment />
				<Heading>Uh oh!</Heading>
				<Content>This story no longer exists.</Content>
				<ButtonGroup>
					<LinkButton onPress={() => navigate('/')}>Return</LinkButton>
				</ButtonGroup>
			</IllustratedMessage>
		</div>
	);
}
