import { PageLayout } from '@/components/PageLayout';
import type { Template } from '@/types';

interface TemplateCreationProps {
	existingTemplate?: Template;
}

export function TemplateCreation({ existingTemplate }: TemplateCreationProps) {
	return <PageLayout>Hi</PageLayout>;
}
