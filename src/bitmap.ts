import { RGBA } from './util'

export class Bitmap {
	width: number
	height: number
	use_alpha: boolean
	channel_count: number

	buffer: ArrayBuffer
	data: Uint8ClampedArray


	constructor(width: number, height: number, use_alpha = false) {
		this.width = width
		this.height = height
		this.channel_count = (use_alpha ? 4 : 3)
		this._reset_data()
	}


	private _reset_data(): void {
		const buffer_size = this.width * this.height * this.channel_count
		this.buffer = new ArrayBuffer(buffer_size)
		this.data = new Uint8ClampedArray(this.buffer)
	}

	resize(width: number, height: number): void {
		if (this.width == width && this.height == height) return
		this.width = width
		this.height = height
		this._reset_data()
	}

	get_pixel(x: number, y: number): RGBA {
		x = Math.floor(x)
		y = Math.floor(y)
		if (x < 0 || y < 0 || x >= this.width || y >= this.height)
			return [0, 0, 0, 0]

		const index = (y * this.width + x) * this.channel_count

		const r = this.data[index + 0]
		const g = this.data[index + 1]
		const b = this.data[index + 2]
		const a = this.use_alpha ? this.data[index + 3] : 255
		return [r, g, b, a]
	}

	set_pixel(x: number, y: number, color: RGBA): void {
		x = Math.floor(x)
		y = Math.floor(y)
		if (x < 0 || y < 0 || x >= this.width || y >= this.height)
			return

		const index = (y * this.width + x) * this.channel_count

		this.data[index + 0] = color[0]
		this.data[index + 1] = color[1]
		this.data[index + 2] = color[2]
		if (this.use_alpha)
			this.data[index + 3] = color[3]
	}

	clear(): void {
		this.data.fill(0)
	}
}
