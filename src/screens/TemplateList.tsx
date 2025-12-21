import { useCallback, useMemo, useState, type JSX } from 'react';

import {
	ActionButton,
	ActionMenu,
	Button,
	ButtonGroup,
	Card,
	Content,
	CustomDialog,
	DialogTrigger,
	Footer,
	Heading,
	IllustratedMessage,
	MenuItem,
	ProgressCircle,
	Tag,
	TagGroup,
	Text,
	UNSTABLE_ToastQueue,
} from '@react-spectrum/s2';
import Delete from '@react-spectrum/s2/icons/Delete';
import Edit from '@react-spectrum/s2/icons/Edit';
import EmptyIllustration from '@react-spectrum/s2/illustrations/linear/NoLibraries';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { PageLayout } from '@/components/PageLayout';
import { ShareCodeEntryDialog } from '@/components/ShareCodeDialog';
import { deleteSavedTemplate, deleteWordbank, ensureWordbankExists, getAllSavedTemplates } from '@/database';
import type { Template } from '@/types';
import { capitalize, extractCategories } from '@/utils/helperFunctions';

export function TemplateList() {
	const [templateList, setTemplatesList] = useState(getAllSavedTemplates());

	let component: JSX.Element;
	if (!templateList.length) {
		component = (
			<IllustratedMessage>
				<EmptyIllustration />
				<Heading>No templates yet</Heading>
				<Content>Get started by creating one!</Content>
			</IllustratedMessage>
		);
	} else {
		component = (
			<>
				{templateList.map(t => (
					<TemplateItem
						key={t.shareId}
						template={t}
						onShare={() => ensureWordbankExists(t)}
						onDelete={async () => {
							try {
								await deleteWordbank(t.shareId);
								deleteSavedTemplate(t.shareId);
								setTemplatesList(prev => prev.filter(template => template.shareId !== t.shareId));
							} catch {
								UNSTABLE_ToastQueue.negative('Something went wrong');
							}
						}}
					/>
				))}
			</>
		);
	}

	return (
		<PageLayout
			isEmptyPage={!templateList.length}
			className={style({ gap: 24 })}
			title="My stories"
			headerActions={
				<div
					className={style({
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'end',
						gap: 8,
					})}
				>
					<Button variant="accent">Create</Button>
					<ShareCodeEntryDialog
						buttonText="Enter share code"
						onSubmit={() => new Promise(r => setTimeout(() => r(true), 400))}
					/>
				</div>
			}
		>
			<div
				className={style({
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					width: {
						// auto?
						default: 'full',
						md: 500,
						lg: 600,
					},
				})}
			>
				{component}
			</div>
		</PageLayout>
	);
}

type VoidPromise = () => Promise<void>;
interface TemplateItemProps {
	template: Template;
	onEdit?: VoidFunction;
	onShare?: VoidPromise;
	onDelete?: VoidPromise;
	onGenerate?: VoidPromise;
}

function TemplateItem({ template, onGenerate, onDelete, onEdit, onShare }: TemplateItemProps) {
	const { shareId, title, text } = template;
	const categories = useMemo(() => extractCategories(text).map(c => ({ id: c, label: capitalize(c) })), [text]);
	const [isSharing, setIsSharing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const wrapInLoader = useCallback(
		(fn: VoidPromise | undefined, loadingSetter: (loading: boolean) => void) => async () => {
			if (!fn) return;

			loadingSetter(true);
			await fn();
			loadingSetter(false);
		},
		[],
	);

	return (
		<Card styles={style({ width: 'full' })}>
			<Content>
				<Text slot="title">{title}</Text>
				<Text slot="description">{text}</Text>
				<ActionMenu>
					<MenuItem onAction={onEdit} isDisabled={isDeleting}>
						<Edit />
						<Text>Edit</Text>
					</MenuItem>
					<MenuItem UNSAFE_style={{ color: '#d73220' }} onAction={wrapInLoader(onDelete, setIsDeleting)}>
						<Delete />
						<Text>Delete</Text>
					</MenuItem>
				</ActionMenu>
			</Content>
			<Footer>
				<TagGroup label="Categories" selectionMode="none" maxRows={2} size="S" items={categories}>
					{category => <Tag>{category.label}</Tag>}
				</TagGroup>
				<ButtonGroup>
					<ShareButton
						shareId={shareId}
						onShare={wrapInLoader(onShare, setIsSharing)}
						isSharing={isSharing}
						isDisabled={isDeleting}
					/>
					<Button variant="premium" isDisabled={isDeleting} onPress={onGenerate}>
						Generate
					</Button>
				</ButtonGroup>
			</Footer>
		</Card>
	);
}

interface ShareButtonProps {
	shareId: string;
	onShare: VoidPromise;
	isSharing: boolean;
	isDisabled?: boolean;
}

function ShareButton({ shareId, onShare, isSharing }: ShareButtonProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<DialogTrigger isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<Button variant="secondary" onPress={onShare}>
				Share
			</Button>
			<CustomDialog isDismissible size="S">
				<div
					className={style({
						display: 'grid',
						gridTemplateColumns: '1fr 2fr',
						gridTemplateRows: '1fr 1fr',
						gap: 4,
					})}
				>
					<Text
						styles={style({
							gridColumnStart: '1',
							gridRowStart: '1',
							fontSize: 'heading',
							fontWeight: 'title',
							marginBottom: 0,
						})}
					>
						Share ID
					</Text>
					{!isSharing && (
						<Text
							styles={style({
								gridColumnStart: '1',
								gridRowStart: '2',
								color: 'GrayText',
								fontSize: 'body-sm',
							})}
						>
							Click to copy
						</Text>
					)}
					<div
						className={style({
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gridColumnStart: '2',
							gridRowStart: 'span 2',
						})}
					>
						{isSharing ? (
							<ProgressCircle isIndeterminate />
						) : (
							<ActionButton
								size="XL"
								onPress={() => {
									navigator.clipboard.writeText(shareId);
									UNSTABLE_ToastQueue.positive('Copied', { timeout: 3000 });
									setTimeout(() => {
										setIsDialogOpen(false);
									}, 500);
								}}
							>
								{shareId}
							</ActionButton>
						)}
					</div>
				</div>
			</CustomDialog>
		</DialogTrigger>
	);
}
