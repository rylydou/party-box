import { Buffer } from '.'


export class Box {
	width: number
	height: number

	front_buffer: Buffer
	back_buffer: Buffer

	swap_buffers() {
		const temp = this.front_buffer
		this.front_buffer = this.back_buffer
		this.back_buffer = temp
	}

	update(updater_callback: (front: Buffer, back: Buffer) => void) {
		updater_callback(this.front_buffer, this.back_buffer)
		this.swap_buffers()
	}
}
