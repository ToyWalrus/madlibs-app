import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	IllustratedMessage,
	Heading,
	Content,
	ButtonGroup,
	LinkButton,
	Button,
	Text,
	ProgressCircle,
} from '@react-spectrum/s2';
import Edit from '@react-spectrum/s2/icons/Edit';
import Refresh from '@react-spectrum/s2/icons/Refresh';
import NoComment from '@react-spectrum/s2/illustrations/linear/NoComment';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { AnimatedStory } from '@/components/AnimatedStory';
import { Confetti } from '@/components/Confetti';
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
	const [showConfetti, setShowConfetti] = useState(false);
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
		startStoryGeneration().then(() => setShowConfetti(true));
	}, [startStoryGeneration]);

	if (!template) {
		return <NoTemplate />;
	}

	return (
		<PageLayout
			title="Generate story"
			showBackButton
			className={style({ gap: 24, isolation: 'isolate' })}
			headerActions={
				<LinkButton onPress={() => navigate(`/create/${template.shareId}`)}>
					<Edit />
					<Text>Edit</Text>
				</LinkButton>
			}
		>
			{isGenerating ? (
				<div className={style({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
					<ProgressCircle isIndeterminate size="L" aria-label="Generating..." />
				</div>
			) : (
				<div
					className={style({
						borderRadius: 'lg',
						paddingBottom: 16,
						paddingX: 16,
						fontSize: 'body',
						boxShadow: 'emphasized',
					})}
					style={{
						background: `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`,
						animation: 'gradientShift 6s ease-in-out infinite',
					}}
				>
					<h2>{template.title}</h2>
					<AnimatedStory
						key={animationKey}
						markdown={storyText}
						animationDuration={2000}
						animationDelay={800}
					/>
				</div>
			)}
			<ButtonGroup styles={style({ alignSelf: 'end' })}>
				<Button
					variant="secondary"
					isDisabled={isGenerating}
					onPress={async () => {
						wordbankRef.current = null;
						setShowConfetti(false);
						await startStoryGeneration();
						setShowConfetti(true);
					}}
				>
					<Refresh />
					<Text>Refetch words</Text>
				</Button>
				<Button isDisabled={isGenerating} onPress={startStoryGeneration} variant="premium">
					Regenerate
				</Button>
			</ButtonGroup>
			{showConfetti && <Confetti />}
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
