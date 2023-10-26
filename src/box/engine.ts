import { Buffer } from '.'


export function update_dirty(front: Buffer, back: Buffer): void {
	back.dirty_indices.clear()

	for (const index of front.dirty_indices) {
		const [x, y] = front.get_coord(index)
		update_tile(front, back, x, y)
	}
}

export function update_all(front: Buffer, back: Buffer): void {
	back.dirty_indices.clear()

	const w = front.width
	const h = front.height
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			update_tile(front, back, x, y)
		}
	}
}


export function update_tile(front: Buffer, back: Buffer, x: number, y: number): void {
	const fallback = 1000
	const index = x * front.width + y

	const l = front.get_tile(x - 1, y, fallback)
	const r = front.get_tile(x + 1, y, fallback)
	const t = front.get_tile(x, y - 1, fallback)
	const b = front.get_tile(x, y + 1, fallback)
	const tl = front.get_tile(x - 1, y - 1, fallback)
	const tr = front.get_tile(x + 1, y - 1, fallback)
	const bl = front.get_tile(x - 1, y + 1, fallback)
	const br = front.get_tile(x + 1, y + 1, fallback)
	const cen = front[index]

	let out = cen
	back[index] = out
}
