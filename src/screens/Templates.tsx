import { useCallback, useMemo, useState, type JSX } from 'react';
import { PinInput } from 'react-input-pin-code';

import {
	ActionButton,
	ActionMenu,
	Button,
	ButtonGroup,
	Card,
	Content,
	CustomDialog,
	Dialog,
	DialogTrigger,
	Footer,
	Form,
	Heading,
	IllustratedMessage,
	MenuItem,
	ProgressCircle,
	Tag,
	TagGroup,
	Text,
	TextField,
} from '@react-spectrum/s2';
import Delete from '@react-spectrum/s2/icons/Delete';
import EmptyIllustration from '@react-spectrum/s2/illustrations/linear/NoLibraries';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { PageLayout } from '@/components/PageLayout';
import { ShareCodeEntryDialog } from '@/components/ShareCodeDialog';
import { deleteWordbank, ensureWordbankExists } from '@/database';
import { useSelector } from '@/store';
import { selectTemplates } from '@/store/templatesSlice';
import type { Template } from '@/types';
import { extractCategories } from '@/utils/extractCategories';
import { capitalize } from '@/utils/helperFunctions';

export function Templates() {
	const templates = useSelector(selectTemplates);

	let component: JSX.Element;
	if (!templates.length) {
		component = (
			<IllustratedMessage
				UNSAFE_style={{
					borderWidth: 1,
					borderColor: '#beccea',
					borderStyle: 'solid',
					borderRadius: 8,
					paddingBottom: 8,
				}}
			>
				<EmptyIllustration />
				<Heading>No templates yet</Heading>
				<Content>Get started by creating one!</Content>
				<ButtonGroup>
					<Button variant="premium">Create</Button>
				</ButtonGroup>
			</IllustratedMessage>
		);
	} else {
		component = (
			<>
				{templates.map(t => (
					<TemplateItem
						key={t.shareId}
						template={t}
						onShare={() => ensureWordbankExists(t)}
						onDelete={() => deleteWordbank(t.shareId)}
					/>
				))}
			</>
		);
	}

	return (
		<PageLayout isEmptyPage={!templates.length} className={style({ gap: 24 })}>
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
				<Heading level={1} styles={style({ fontWeight: 'normal', color: 'heading' })}>
					My templates
				</Heading>
				<ShareCodeEntryDialog
					buttonText="Enter share code"
					onSubmit={() => new Promise(r => setTimeout(() => r(true), 400))}
				/>
			</div>
			<div
				className={style({
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					width: {
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
}

function TemplateItem({ template, onDelete, onEdit, onShare }: TemplateItemProps) {
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
					<DialogTrigger>
						<Button variant="secondary" onPress={wrapInLoader(onShare, setIsSharing)}>
							Share
						</Button>
						<CustomDialog isDismissible size="S">
							<div className={style({ display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
								{isSharing ? (
									<ProgressCircle isIndeterminate />
								) : (
									<ActionButton onPress={() => navigator.clipboard.writeText(shareId)}>
										{shareId}
									</ActionButton>
								)}
							</div>
						</CustomDialog>
					</DialogTrigger>
					<Button variant="accent" onPress={onEdit}>
						Edit
					</Button>
				</ButtonGroup>
			</Footer>
		</Card>
	);
}
