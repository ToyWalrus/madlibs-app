import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IllustratedMessage, Heading, Content, ButtonGroup, LinkButton, Button, Text } from '@react-spectrum/s2';
import Edit from '@react-spectrum/s2/icons/Edit';
import Refresh from '@react-spectrum/s2/icons/Refresh';
import NoComment from '@react-spectrum/s2/illustrations/linear/NoComment';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { AnimatedStory } from '@/components/AnimatedStory';
import { PageLayout } from '@/components/PageLayout';
import { fetchWordbank } from '@/database';
import type { Template, WordBank } from '@/types';
import { generateLightColor } from '@/utils/colorUtils';
import { generateStory } from '@/utils/generateStory';

import './GenerationPage.css';

interface GenerationPageProps {
	template?: Template;
}

export function GenerationPage({ template }: GenerationPageProps) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [storyText, setStoryText] = useState('');
	const [animationKey, setAnimationKey] = useState(0);
	const [gradientColor1, setGradientColor1] = useState(generateLightColor());
	const [gradientColor2, setGradientColor2] = useState(generateLightColor());
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
		setStoryText(text);
		setAnimationKey(k => k + 1);
		setGradientColor1(generateLightColor());
		setGradientColor2(generateLightColor());
	}, [template?.shareId]);

	useEffect(() => {
		startStoryGeneration();
	}, [startStoryGeneration]);

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
					borderRadius: 'lg',
					paddingBottom: 16,
					paddingX: 16,
					fontSize: 'body',
				})}
				style={{
					background: `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`,
					animation: 'gradientShift 6s ease-in-out infinite',
				}}
			>
				<h2>{template.title}</h2>
				{isGenerating ? (
					<div style={{ paddingTop: 8 }}>Generating…</div>
				) : (
					<AnimatedStory key={animationKey} markdown={storyText} />
				)}
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
