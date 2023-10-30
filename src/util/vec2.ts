import { lerp, sqr } from '.'


export type Vec2 = [number, number]


export function length_sqr(x: number, y: number): number {
	return sqr(x) + sqr(y)
}
export function dist_sqr(x1: number, y1: number, x2: number, y2: number): number {
	return length_sqr(x2 - x1, y2 - y1)
}

export function round2(x: number, y: number): Vec2 {
	return [Math.round(x), Math.round(y)]
}

export function lerp2(x1: number, y1: number, x2: number, y2: number, t: number): Vec2 {
	return [lerp(x1, x2, t), lerp(y1, y2, t)]
}

export function* line_on_grid(x1: number, y1: number, x2: number, y2: number): Generator<Vec2> {
	const n = diagonal_distance(x1, y1, x2, y2)
	for (let step = 0; step <= n; step++) {
		const t = n === 0 ? 0.0 : step / n
		yield round2(...lerp2(x1, y1, x2, y2, t))
	}
}

export function diagonal_distance(x1: number, y1: number, x2: number, y2: number): number {
	const dx = x2 - x1
	const dy = y2 - y1
	return Math.max(Math.abs(dx), Math.abs(dy))
}
