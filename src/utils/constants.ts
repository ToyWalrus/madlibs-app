import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import type { WordBank } from '@/types';

export const SHARE_CODE_LENGTH = 5;
export const EMPTY_WORD_BANK: WordBank = { categories: [], words: {}, totalWordsNeeded: {} };
export const flex1 = style({ flexBasis: 0, flexGrow: 1, flexShrink: 1 });
export const categoryRegex = /\[([A-z\d ]+?)(:\d)?\]/gm;
