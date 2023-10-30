import { RGBA } from '../util'

export type TileID = number

export interface TileDefinition {
	name: string
	char: string
	color: RGBA
}

export interface Tile extends TileDefinition {
	id: TileID
}

export function create_tile(id: TileID, def: TileDefinition): Tile {
	return {
		...def,
		id,
	}
}
