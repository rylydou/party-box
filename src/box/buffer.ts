import { TileData } from '.'


export class Buffer {
	width: number
	height: number
	size: number
	data: TileData[]
	dirty_indices = new Set<number>()


	constructor(width: number, height: number) {
		this.width = width
		this.height = height
		this.size = width * height
		this.data = Array(this.size)
		this.data.fill(0)
		for (let index = 0; index < this.size; index++) {
			this.dirty_indices.add(index)
		}
	}


	get_index(x: number, y: number): number {
		return y * this.width + x
	}

	get_coord(index: number): [number, number] {
		return [index % this.width, Math.floor(index / this.width)]
	}

	get_tile(x: number, y: number, fallback: TileData): TileData {
		if (x < 0) return fallback
		if (y < 0) return fallback
		if (x >= this.width) return fallback
		if (y >= this.height) return fallback
		const index = this.get_index(x, y)
		return this.data[index]
	}

	set_tile(x: number, y: number, tile: TileData): void {
		const index = this.get_index(x, y)
		this.data[index] = tile
		return
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
