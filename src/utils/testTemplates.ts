import type { Template } from '@/types';

const testTemplateText = [
	`I used to be a normal [occupation] until one [adjective] day when I was bitten by a radioactive [animal]. Suddenly, I could [verb] faster than a [vehicle] and [verb] higher than a [noun]! Now I fight crime as the [adjective] [noun]-[gender], protector of [place]!`,
	`To make the world's best [food], you'll need [number] cups of [noun plural], a pinch of [adjective] [noun], and [number] [adjective] [animal plural]. Mix everything in a [adjective] [container] and [verb] for [number] minutes. Serve to your [adjective] [family member] and watch them [verb]!`,
	'The brave knight [Name:1] rode their [adjective:1] [land animal:1] to the [place:1]. At the [place:1], [name:1] found a [adjective:2] [noun:1]. "I must bring this [noun:1] to [place]," said [name:1]. But suddenly, the [land animal:1] started to [verb:1]! "Stop [verb:1]ing!" shouted [name:1]. "We need to get this [adjective:2] [noun:1] away before the [adjective:1] [noun:2] arrives!" But instead they found themselves at [place]!',
];

export const testTemplates: Template[] = testTemplateText.map((text, idx) => {
	return {
		text,
		shareId: idx.toString(),
		title: `Story ${idx + 1}`,
	} satisfies Template;
});
