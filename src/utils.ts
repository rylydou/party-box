export type Color = [number, number, number, number]

export function center_rect(cw: number, ch: number, rw: number, rh: number): [number, number] {
	return [(cw - rw) / 2, (ch - rh) / 2]
}

export function rand(max: number): number {
	return Math.floor(Math.random() * max)
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
