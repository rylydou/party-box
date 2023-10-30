export function lerp(start: number, end: number, t: number) {
	return start * (1.0 - t) + t * end
}

export function sqr(x: number): number {
	return x * x
}

export function clamp(value: number, min: number, max: number) {
	if (value < min) {
		return min
	}
	if (value > max) {
		return max
	}
	return value
}
