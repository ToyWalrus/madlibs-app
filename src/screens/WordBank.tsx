import { useCallback, useEffect, useMemo, useState } from 'react';

import {
	ActionButton,
	Button,
	ButtonGroup,
	Card,
	Content,
	Heading,
	IllustratedMessage,
	Tag,
	TagGroup,
	Text,
	TextField,
	ToggleButton,
	Tooltip,
	TooltipTrigger,
	UNSTABLE_ToastQueue,
} from '@react-spectrum/s2';
import AddIcon from '@react-spectrum/s2/icons/Add';
import WarningIllustration from '@react-spectrum/s2/illustrations/linear/Warning';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { PageLayout } from '@/components/PageLayout';
import { ShareCodeEntryDialog } from '@/components/ShareCodeDialog';
import { fetchWordbank, updateWordbank } from '@/database';
import type { WordBank } from '@/types';
import { capitalize, dedupWordBank, stripWordBankWords } from '@/utils/helperFunctions';

interface WordBankProps {
	shareId?: string;
}

export function WordBank({ shareId }: WordBankProps) {
	// TODO: keep track of which words are local and which are from the db
	// TODO: make submitted db words non-removable
	const [wordBank, setWordBank] = useState<WordBank>({ categories: [], words: {} });
	const [showExistingWords, setShowExistingWords] = useState(false);

	useEffect(() => {
		if (!shareId) return;
		fetchWordbank(shareId).then(bank => {
			setWordBank(prev => (showExistingWords ? dedupWordBank(bank, prev) : stripWordBankWords(bank)));
		});
	}, [shareId, showExistingWords]);

	const getOnAddWord = useCallback(
		(category: string) => (newWord: string) => {
			setWordBank(bank => ({
				...bank,
				words: {
					...bank.words,
					[category]: [...bank.words[category], newWord],
				},
			}));
		},
		[],
	);

	const getOnRemoveWord = useCallback(
		(category: string) => (wordToRemove: string) => {
			setWordBank(bank => ({
				...bank,
				words: {
					...bank.words,
					[category]: bank.words[category].filter(word => word !== wordToRemove),
				},
			}));
		},
		[],
	);

	const onSubmitWords = useCallback(async () => {
		if (!shareId) return;
		try {
			await updateWordbank(shareId, wordBank);
		} catch (e) {
			console.error(e);
			UNSTABLE_ToastQueue.negative('Unable to submit words', {
				actionLabel: 'Retry',
				onAction: onSubmitWords,
				shouldCloseOnAction: true,
			});
			return;
		}
		UNSTABLE_ToastQueue.positive('Words submitted!', { timeout: 5000 });
	}, [shareId, wordBank]);

	if (!shareId) {
		return (
			<PageLayout isEmptyPage>
				<IllustratedMessage>
					<WarningIllustration />
					<Content>No word bank loaded</Content>
					<ButtonGroup>
						<ShareCodeEntryDialog
							buttonText="Enter a new share code"
							buttonSize="L"
							onSubmit={async code => {
								console.log('submit code', code);
								return false;
							}}
						/>
					</ButtonGroup>
				</IllustratedMessage>
			</PageLayout>
		);
	}

	return (
		<PageLayout className={style({ gap: 16 })}>
			<div
				className={style({
					flexDirection: 'row',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 16,
					alignSelf: 'start',
					width: 'full',
				})}
			>
				<Heading level={1} styles={style({ alignSelf: 'start', fontWeight: 'normal', color: 'heading' })}>
					Word bank
				</Heading>
				<Button variant="accent" isDisabled={!hasWords(wordBank)} onPress={onSubmitWords}>
					Submit
				</Button>
			</div>
			<ToggleButton size="L" isSelected={showExistingWords} onChange={setShowExistingWords}>
				Show submitted words
			</ToggleButton>
			<div
				className={style({
					display: 'flex',
					flexDirection: 'column',
					paddingBottom: 12,
					gap: 12,
					width: {
						default: 'full',
						md: 500,
						lg: 600,
					},
				})}
			>
				{wordBank.categories.map(category => (
					<CategorySection
						key={category}
						category={category}
						words={wordBank.words[category]}
						onAddWord={getOnAddWord(category)}
						onRemoveWord={getOnRemoveWord(category)}
					/>
				))}
			</div>
		</PageLayout>
	);
}

interface CategorySectionProps {
	words: string[];
	category: string;
	onAddWord: (word: string) => void;
	onRemoveWord: (word: string) => void;
}

function CategorySection({ words, category, onAddWord, onRemoveWord }: CategorySectionProps) {
	const [newWord, setNewWord] = useState('');
	const wordItems = useMemo(() => words.map(w => ({ label: w, id: w })), [words]);

	return (
		<Card styles={style({ width: 'auto' })}>
			{/* Maybe use UNSPLASH image API here for category? */}
			<Content>
				<Text slot="title" styles={style({ marginBottom: 8, fontSize: 'title-lg' })}>
					{capitalize(category)}
				</Text>
				<div className={style({ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'end' })}>
					<TextField placeholder={`New ${category}`} value={newWord} onChange={setNewWord} />
					<TooltipTrigger delay={700}>
						<ActionButton
							onPress={() => {
								if (!newWord) return;
								onAddWord(newWord);
								setNewWord('');
							}}
						>
							<AddIcon />
						</ActionButton>
						<Tooltip>Add word</Tooltip>
					</TooltipTrigger>
				</div>
				<TagGroup
					size="S"
					items={wordItems}
					onRemove={keys => onRemoveWord([...keys][0] as string)}
					renderEmptyState={() => <span className={style({ marginStart: 2 })}>No words added yet...</span>}
				>
					{item => <Tag>{item.label}</Tag>}
				</TagGroup>
			</Content>
		</Card>
	);
}

function hasWords(wordBank: WordBank) {
	return Object.keys(wordBank.words).some(key => wordBank.words[key].length > 0);
}
