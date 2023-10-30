import { Box } from '.'
import { rand, randi } from '../util'


export function update_tile(box: Box, x: number, y: number): void {
	const tile = box.get_tile(x, y)

	if (tile == 2 || tile == 3) {
		const b_tile = box.get_tile(x, y + 1)
		const can_fall_down = b_tile == 0 || (tile == 2 && b_tile == 3)
		if (can_fall_down) {
			box.set_tile(x, y, b_tile)
			box.set_tile(x, y + 1, tile)
			box.set_updated(x, y + 1)
		}
		else {
			const bl_tile = box.get_tile(x - 1, y + 1)
			const br_tile = box.get_tile(x + 1, y + 1)
			const can_fall_left = bl_tile == 0 || (tile == 2 && bl_tile == 3)
			const can_fall_right = br_tile == 0 || (tile == 2 && br_tile == 3)

			if (can_fall_left && !(can_fall_right && rand())) {
				box.set_tile(x, y, bl_tile)
				box.set_tile(x - 1, y + 1, tile)
				box.set_updated(x - 1, y + 1)
			}
			else if (can_fall_right) {
				box.set_tile(x, y, br_tile)
				box.set_tile(x + 1, y + 1, tile)
				box.set_updated(x + 1, y + 1)
			}
			else if (tile == 3) {
				const can_go_left = box.get_tile(x - 1, y) == 0
				const can_go_right = box.get_tile(x + 1, y) == 0
				if (can_go_left && !(can_go_right && rand())) {
					box.set_tile(x, y, 0)
					box.set_tile(x - 1, y, tile)
					box.set_updated(x - 1, y)
				}
				else if (can_go_right) {
					box.set_tile(x, y, 0)
					box.set_tile(x + 1, y, tile)
					box.set_updated(x + 1, y)
				}
			}
		}
	}
}


export function update_dirty(box: Box): void {
	// let count = 0

	let arr = Array.from(box.dirty_indices)
	box.dirty_indices.clear()
	// arr.sort()
	// arr.reverse()
	for (const index of arr) {
		if (index < 0) continue
		if (index >= box.size) continue
		if (box.updated_indices.has(index)) continue
		// box.dirty_indices.delete(index)

		const [x, y] = box.get_coord(index)
		update_tile(box, x, y)

		// count += 1
		// if (count > 5000) return
	}
}

export function update_all(box: Box): void {
	const w = box.width
	const h = box.height
	// for (let y = 0; y < w; y++) {
	for (let y = h; y >= 0; y--) {
		for (let x = 0; x < w; x++) {
			if (box.is_updated(x, y)) continue
			update_tile(box, x, y)
		}
	}
}

export function update_random(box: Box, iterations: number): void {
	for (let iteration = 0; iteration < iterations; iteration++) {
		const x = randi(box.width)
		const y = randi(box.height)
		update_tile(box, x, y)
	}
}
