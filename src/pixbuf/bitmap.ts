import { RGBA } from '../utils'

export class Bitmap {
	image_data: ImageData

	get width() { return this.image_data.width }
	get height() { return this.image_data.height }

	constructor(image_data: ImageData) {
		this.image_data = image_data
	}


	get_pixel(x: number, y: number): RGBA {
		const width = this.image_data.width
		const height = this.image_data.height
		const data = this.image_data.data

		x = Math.floor(x)
		y = Math.floor(y)
		if (x < 0 || y < 0 || x >= width || y >= height)
			return [0, 0, 0, 0]

		const index = (y * this.image_data.width + x) * 4

		const r = data[index + 0]
		const g = data[index + 1]
		const b = data[index + 2]
		const a = data[index + 3]
		return [r, g, b, a]
	}

	set_pixel(x: number, y: number, color: RGBA): void {
		const width = this.image_data.width
		const height = this.image_data.height
		const data = this.image_data.data

		x = Math.floor(x)
		y = Math.floor(y)
		if (x < 0 || y < 0 || x >= width || y >= height)
			return

		const index = (y * width + x) * 4

		data[index + 0] = color[0]
		data[index + 1] = color[1]
		data[index + 2] = color[2]
		data[index + 3] = color[3]
	}

	clear(): void {
		const data = this.image_data.data
		data.fill(0)
	}
}
