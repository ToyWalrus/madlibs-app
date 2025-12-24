/**
 * Generates a random light color using HSB color space
 * to ensure colors are bright and pastel-like
 */
export function generateLightColor(): string {
	const hue = Math.random() * 360;
	const saturation = 15 + Math.random() * 15; // 15-30% for very light colors
	const brightness = 92 + Math.random() * 8; // 92-100% for very light colors

	const c = (brightness / 100) * (saturation / 100);
	const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
	const m = brightness / 100 - c;

	let r = 0,
		g = 0,
		b = 0;
	if (hue < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (hue < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (hue < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (hue < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (hue < 300) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}

	const toHex = (val: number) =>
		Math.round((val + m) * 255)
			.toString(16)
			.padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
