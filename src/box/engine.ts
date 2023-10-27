import { Box, TileID } from '.'


export function update_dirty(box: Box): void {
	box.dirty_indices.clear()

	for (const index of box.dirty_indices) {
		const [x, y] = box.get_coord(index)
		update_tile(box, x, y)
	}
}

export function update_all(box: Box): void {
	box.dirty_indices.clear()

	const w = box.width
	const h = box.height
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			if (box.updated_data[y * box.width + x]) continue
			update_tile(box, x, y)
		}
	}
}


export function update_tile(box: Box, x: number, y: number): void {
	const fallback = 1000 as TileID
	const tile = box.get_tile(x, y, fallback)
	if (tile == undefined) {
		console.log(`${x} ${y}`)
		return
	}


	if (tile[0] == 1) {
		if (box.get_tile(x, y + 1, fallback)[0] == 0) {
			box.set_tile(x, y, 0)
			box.set_tile(x, y + 1, 1)
			return
		}
	}
}
