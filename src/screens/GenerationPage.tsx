import { IllustratedMessage, Heading, Content, ButtonGroup, LinkButton } from '@react-spectrum/s2';
import EmptyIllustration from '@react-spectrum/s2/illustrations/linear/NoLibraries';

import { PageLayout } from '@/components/PageLayout';
import type { Template } from '@/types';

interface GenerationPageProps {
	template?: Template;
}

export function GenerationPage({ template }: GenerationPageProps) {
	return (
		<PageLayout title="Generate story" showBackButton={!!template}>
			{!template && <NoTemplate />}
			{/* TODO: generation functionality */}
		</PageLayout>
	);
}

function NoTemplate() {
	return (
		<IllustratedMessage>
			<EmptyIllustration />
			<Heading>Uh oh!</Heading>
			<Content>This story no longer exists.</Content>
			<ButtonGroup>
				<LinkButton href="/">Return</LinkButton>
			</ButtonGroup>
		</IllustratedMessage>
	);
}
