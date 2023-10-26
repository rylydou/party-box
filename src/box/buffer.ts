import { Tile } from '.'


export class Buffer {
	width: number
	height: number
	tiles: Tile[]
	dirty_indices: Set<number>

	get_index(x: number, y: number): number {
		return y * this.width + x
	}

	get_coord(index: number): [number, number] {
		return [index % this.width, Math.floor(index / this.width)]
	}

	get_tile(x: number, y: number, fallback: Tile): Tile {
		if (x < 0) return fallback
		if (y < 0) return fallback
		if (x >= this.width) return fallback
		if (y >= this.height) return fallback
		const index = this.get_index(x, y)
		return this.tiles[index]
	}

	set_tile(x: number, y: number, tile: Tile): void {
		var index = this.get_index(x, y)
		this.tiles[index] = tile
		this.dirty_indices.add(index)
		// WARN: If setting a tile on the edge then tiles on the opposite side will be marked dirty.
		this.dirty_indices.add(this.get_index(x - 1, y))
		this.dirty_indices.add(this.get_index(x + 1, y))
		this.dirty_indices.add(this.get_index(x, y - 1))
		this.dirty_indices.add(this.get_index(x, y + 1))
		this.dirty_indices.add(this.get_index(x - 1, y - 1))
		this.dirty_indices.add(this.get_index(x + 1, y - 1))
		this.dirty_indices.add(this.get_index(x - 1, y + 1))
		this.dirty_indices.add(this.get_index(x + 1, y + 1))
	}
}
