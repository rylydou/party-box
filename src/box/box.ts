import { Tile, TileDefinition, create_tile, render_dirty, TileID } from '.'
import { RGBA, length_sqr, sqr } from '../util'


export interface BoxOptions {
	width: number
	height: number
	tiles: TileDefinition[]
}

export class Box {
	width: number
	height: number
	size: number
	tiles: Tile[]
	tile_colors: number[]

	data: TileID[]
	updated_indices = new Set<number>()
	dirty_indices = new Set<number>()


	constructor(options: BoxOptions) {
		this.width = options.width
		this.height = options.height
		this.size = this.width * this.height

		let tile_id = 0
		this.tiles = Array(options.tiles.length)
		this.tile_colors = Array(options.tiles.length * 3)
		for (const tile_def of options.tiles) {
			const tile = create_tile(tile_id, tile_def)
			this.tiles[tile_id] = tile

			this.tile_colors[tile_id * 3 + 0] = tile.color[0]
			this.tile_colors[tile_id * 3 + 1] = tile.color[1]
			this.tile_colors[tile_id * 3 + 2] = tile.color[2]
			// this.tile_colors[tile_id + 3] = tile.color[3]

			tile_id++
		}

		this.data = Array(this.size)
		this.data.fill(0)
	}


	update(updater_callback: (box: Box) => void): void {
		this.updated_indices.clear()
		updater_callback(this)
	}

	get_index(x: number, y: number): number {
		return y * this.width + x
	}

	get_coord(index: number): [number, number] {
		return [index % this.width, Math.floor(index / this.width)]
	}

	get_tile(x: number, y: number, fallback: TileID = 1000): TileID {
		if (x < 0) return fallback
		if (y < 0) return fallback
		if (x >= this.width) return fallback
		if (y >= this.height) return fallback

		const index = this.get_index(x, y)
		return this.data[index]
	}

	set_tile(x: number, y: number, tile: TileID): void {
		if (x < 0) return
		if (y < 0) return
		if (x >= this.width) return
		if (y >= this.height) return

		const index = this.get_index(x, y)
		this.data[index] = tile
		// return
		// WARN: If setting a tile on the edge then tiles on the opposite side will be marked dirty.
		this.dirty_indices.add(index + this.width - 1) // Bottom Left
		this.dirty_indices.add(index + this.width) // Bottom
		this.dirty_indices.add(index + this.width + 1) // Bottom Right

		this.dirty_indices.add(index - 1) // Left
		this.dirty_indices.add(index) // Center
		this.dirty_indices.add(index + 1) // Right

		this.dirty_indices.add(index - this.width - 1) // Top Left
		this.dirty_indices.add(index - this.width) // Top
		this.dirty_indices.add(index - this.width + 1) // Top Right
	}

	set_updated(x: number, y: number): void {
		const index = this.get_index(x, y)
		this.updated_indices.add(index)
	}

	is_updated(x: number, y: number): boolean {
		const index = this.get_index(x, y)
		return this.updated_indices.has(index)
	}

	set_circle(x: number, y: number, tile: TileID, radius: number) {
		if (radius == 0) {
			this.set_tile(x, y, tile)
			// this.set_updated(x, y)
			return
		}

		for (let yy = -radius; yy <= radius; yy++) {
			for (let xx = -radius; xx <= radius; xx++) {
				if (length_sqr(xx, yy) > sqr(radius) + 1) continue
				this.set_tile(x + xx, y + yy, tile)
				// this.set_updated(x + xx, y + yy)
			}
		}
	}
}
