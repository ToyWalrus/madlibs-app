import { useCallback, useEffect, useRef, useState } from 'react';

import {
	ActionButton,
	Button,
	ButtonGroup,
	Card,
	Content,
	IllustratedMessage,
	ProgressCircle,
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
import type { WordBank as WordBankType } from '@/types';
import { EMPTY_WORD_BANK, flex1 } from '@/utils/constants';
import { capitalize, dedupWordBank, exceptSets, stripWordBankWords } from '@/utils/helperFunctions';
import clsx from 'clsx';

interface WordBankProps {
	shareId?: string;
}

export function WordBank({ shareId }: WordBankProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [localWordBank, setLocalWordBank] = useState(EMPTY_WORD_BANK);
	const [showExistingWords, setShowExistingWords] = useState(false);
	const dbWordBank = useRef(EMPTY_WORD_BANK);

	useEffect(() => {
		if (!shareId) return;
		setIsLoading(true);
		fetchWordbank(shareId)
			.then(bank => {
				dbWordBank.current = bank;
				setLocalWordBank(stripWordBankWords(bank));
			})
			.finally(() => setIsLoading(false));
	}, [shareId]);

	const getOnAddWord = useCallback(
		(category: string) => (newWord: string) => {
			setLocalWordBank(bank => ({
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
			setLocalWordBank(bank => ({
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
			await updateWordbank(shareId, localWordBank);
			setLocalWordBank(stripWordBankWords(localWordBank));
			dbWordBank.current = dedupWordBank(dbWordBank.current, localWordBank);
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
	}, [shareId, localWordBank]);

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
		<PageLayout
			className={style({ gap: 16 })}
			title="Word bank"
			headerActions={
				<Button variant="accent" isDisabled={!hasWords(localWordBank)} onPress={onSubmitWords}>
					Submit
				</Button>
			}
		>
			<div className={style({ minHeight: 'fit' })}>
				<ToggleButton size="L" isSelected={showExistingWords} onChange={setShowExistingWords}>
					Show submitted words
				</ToggleButton>
			</div>
			<div
				className={clsx(
					style({
						display: 'flex',
						flexDirection: 'column',
						paddingBottom: 12,
						gap: 12,
						width: {
							default: 'full',
							md: 500,
							lg: 600,
						},
					}),
					flex1,
				)}
			>
				{isLoading ? (
					<div
						className={clsx(
							style({
								display: 'flex',
								alignSelf: 'center',
								justifySelf: 'center',
							}),
							flex1,
						)}
					>
						<ProgressCircle
							size="L"
							styles={style({ alignSelf: 'center' })}
							aria-label="Loading words..."
							isIndeterminate
						/>
					</div>
				) : (
					localWordBank.categories.map(category => (
						<CategorySection
							key={category}
							category={category}
							existingWords={
								showExistingWords ? onlyDBWords(dbWordBank.current, localWordBank, category) : []
							}
							words={localWordBank.words[category]}
							onAddWord={getOnAddWord(category)}
							onRemoveWord={getOnRemoveWord(category)}
						/>
					))
				)}
			</div>
		</PageLayout>
	);
}

interface CategorySectionProps {
	words: string[];
	category: string;
	onAddWord: (word: string) => void;
	onRemoveWord: (word: string) => void;
	existingWords: string[];
}

function CategorySection({ words, existingWords = [], category, onAddWord, onRemoveWord }: CategorySectionProps) {
	const [newWord, setNewWord] = useState('');
	const createWordItems = useCallback((words: string[]) => words.map(w => ({ label: w, id: w })), []);

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
					items={createWordItems(words)}
					onRemove={keys => onRemoveWord([...keys][0] as string)}
					renderEmptyState={() => <span className={style({ marginStart: 2 })}>No words added yet...</span>}
				>
					{item => <Tag>{item.label}</Tag>}
				</TagGroup>
				<TagGroup size="S" items={createWordItems(existingWords)} renderEmptyState={() => <></>}>
					{item => <Tag>{item.label}</Tag>}
				</TagGroup>
			</Content>
		</Card>
	);
}

function hasWords(wordBank: WordBankType) {
	return Object.keys(wordBank.words).some(key => wordBank.words[key].length > 0);
}

function onlyDBWords(dbWordBank: WordBankType, localWordBank: WordBankType, category: string): string[] {
	const dbWords = new Set(dbWordBank.words[category]);
	const localWords = new Set(localWordBank.words[category]);

	return Array.from(exceptSets(dbWords, localWords));
}
