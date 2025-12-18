import { useCallback, useMemo, useState, type ComponentProps } from 'react';
import { PinInput } from 'react-input-pin-code';

import { Button, Content, CustomDialog, DialogTrigger, InlineAlert } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { SHARE_CODE_LENGTH } from '@/utils/constants';

const initialState = Array.from({ length: SHARE_CODE_LENGTH }).map(_ => '');

interface ShareCodeEntryDialogProps {
	buttonText: string;
	buttonSize?: ComponentProps<typeof Button>['size'];
	onSubmit: (val: string) => Promise<boolean>;
	onRouteToPage?: (shareCode: string) => unknown;
}

export function ShareCodeEntryDialog({
	buttonText,
	buttonSize = 'S',
	onSubmit,
	onRouteToPage,
}: ShareCodeEntryDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isValid, setIsValid] = useState(true);
	const [isValidating, setIsValidating] = useState(false);
	const [currentState, setCurrentState] = useState<string[]>(initialState);

	const onCompleteInput = useCallback(
		async (values: string[]) => {
			setIsValidating(true);
			if (await onSubmit(values.join(''))) {
				setIsValid(true);
				setTimeout(() => {
					setIsOpen(false);
					onRouteToPage?.(values.join(''));
				}, 700);
			} else {
				setIsValid(false);
			}
			setIsValidating(false);
		},
		[onSubmit, onRouteToPage],
	);

	// https://luffy84217.github.io/react-input-pin-code/?path=/story/getting-started--page#validate--format
	const validationState = useMemo(() => {
		if (isValid && isFullShareCode(currentState)) {
			return '.';
		}
		return isValid || isValidating ? undefined : '';
	}, [isValid, isValidating, currentState]);

	return (
		<DialogTrigger
			isOpen={isOpen}
			onOpenChange={newState => {
				if (newState) {
					setIsValid(true);
					setIsValidating(false);
					setCurrentState(initialState);
				}
				setIsOpen(newState);
			}}
		>
			<Button size={buttonSize}>{buttonText}</Button>
			<CustomDialog padding="none" isDismissible>
				<div
					className={style({
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignContent: 'center',
						padding: 32,
						gap: 8,
					})}
				>
					<PinInput
						autoTab
						autoFocus
						values={currentState}
						onChange={(_, __, values) => {
							setCurrentState(values);
							setIsValid(true);
							if (isFullShareCode(values)) {
								onCompleteInput(values);
							}
						}}
						showState={isValidating ? false : true}
						validate={validationState}
						format={char => char.toUpperCase()}
						placeholder=""
						size="lg"
						type="text"
					/>
					{isFullShareCode(currentState) && !isValidating && !isValid && (
						<InlineAlert variant="negative">
							<Content>The provided code is invalid</Content>
						</InlineAlert>
					)}
				</div>
			</CustomDialog>
		</DialogTrigger>
	);
}

function isFullShareCode(values: string[]) {
	return values.filter(Boolean).length === SHARE_CODE_LENGTH;
}
