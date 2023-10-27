import { Box, Buffer } from '.'


export function render_buffer_to_image_data(box: Box, image_data: ImageData): void {
	console.assert(image_data.width == box.width)
	console.assert(image_data.height == box.height)

	for (let tile_index = 0; tile_index < box.data.length; tile_index++) {
		const tile = box.data[tile_index]
		const tile_def = box.tiles.get(tile[0])
		const color = tile_def.color

		const pix_index = tile_index * 4
		image_data.data.set(color, pix_index)
	}
}
