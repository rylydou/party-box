import { Tile, TileDefinition, create_tile, render_buffer_to_image_data, TileID } from '.'


export interface BoxOptions {
	width: number
	height: number
	tiles: TileDefinition[]
}

export class Box {
	width: number
	height: number
	size: number
	tiles = new Map<TileID, Tile>()

	data: TileID[]
	updated_data: boolean[]
	dirty_indices = new Set<number>()


	constructor(options: BoxOptions) {
		this.width = options.width
		this.height = options.height
		this.size = this.width * this.height

		let tile_id = 0
		for (const tile_def of options.tiles) {
			const tile = create_tile(tile_id, tile_def)
			this.tiles.set(tile_id, tile)
			tile_id++
		}

		this.data = Array(this.size)
		this.data.fill(0)
		this.updated_data = Array(this.size)
		this.updated_data.fill(false)

		for (let index = 0; index < this.size; index++) {
			this.dirty_indices.add(index)
		}
	}


	update(updater_callback: (box: Box) => void): void {
		this.updated_data.fill(false)
		updater_callback(this)
	}

	render_to_image_data(image_data: ImageData): void {
		render_buffer_to_image_data(this, image_data)
	}


	get_index(x: number, y: number): number {
		return y * this.width + x
	}

	get_coord(index: number): [number, number] {
		return [index % this.width, Math.floor(index / this.width)]
	}

	get_tile(x: number, y: number, fallback: TileID): TileID {
		if (x < 0) return fallback
		if (y < 0) return fallback
		if (x >= this.width) return fallback
		if (y >= this.height) return fallback
		const index = this.get_index(x, y)
		return this.data[index]
	}

	set_tile(x: number, y: number, tile: TileID): void {
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
