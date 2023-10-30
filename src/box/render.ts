import { Box } from '.'


// ~ 1-2ms to get tile id
// ~ 3-4ms to set data to color
export function render_all(box: Box, image_data: ImageData): void {
	console.assert(image_data.width == box.width)
	console.assert(image_data.height == box.height)

	for (let tile_index = 0; tile_index < box.data.length; tile_index++) {
		const tile = box.data[tile_index]

		const pix_index = tile_index * 4
		image_data.data[pix_index + 0] = box.tile_colors[tile * 3 + 0]
		image_data.data[pix_index + 1] = box.tile_colors[tile * 3 + 1]
		image_data.data[pix_index + 2] = box.tile_colors[tile * 3 + 2]
		image_data.data[pix_index + 3] = 255
	}
}

export function render_dirty(box: Box, image_data: ImageData): void {
	console.assert(image_data.width == box.width)
	console.assert(image_data.height == box.height)

	for (const index of box.dirty_indices) {
		render_tile_to_image(box, image_data, index)
	}
	for (const index of box.updated_indices) {
		render_tile_to_image(box, image_data, index)
	}
}


export function render_tile_to_image(box: Box, image_data: ImageData, index: number) {
	const tile = box.data[index]
	if (index < 0) return
	if (index >= box.size) return
	const pix_index = index * 4
	image_data.data[pix_index + 0] = box.tile_colors[tile * 3 + 0]
	image_data.data[pix_index + 1] = box.tile_colors[tile * 3 + 1]
	image_data.data[pix_index + 2] = box.tile_colors[tile * 3 + 2]
}

export function render_dirty_to_image(box: Box, image_data: ImageData): void {
	console.assert(image_data.width == box.width)
	console.assert(image_data.height == box.height)

	for (const index of box.dirty_indices) {
		if (index < 0) continue
		if (index >= box.size) continue

		const pix_index = index * 4
		image_data.data[pix_index + 0] = 0
		image_data.data[pix_index + 1] = 255
		image_data.data[pix_index + 2] = 0
		image_data.data[pix_index + 3] = 255
	}

	for (const index of box.updated_indices) {
		const pix_index = index * 4
		image_data.data[pix_index + 0] = 255
		image_data.data[pix_index + 1] = 0
		image_data.data[pix_index + 2] = 0
		image_data.data[pix_index + 3] = 255
	}
}
