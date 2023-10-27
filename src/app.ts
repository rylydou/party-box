import { Box, update_all } from './box'
import { fill_canvas } from './canvas_auto_size'
import { center_rect } from './utils'


const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D


let w = 100
let h = 100

let box_w = 800
let box_h = 800
let box_x = 0
let box_y = 0
const box = new Box({
	width: 100, height: 100,
	tiles: [
		{ name: 'Air', char: '.', color: [0, 0, 0, 0], },
		{ name: 'Brick', char: 'W', color: [255, 255, 255, 255], },
		{ name: 'Sand', char: 'S', color: [255, 255, 0, 255], },
		{ name: 'Water', char: 'W', color: [0, 0, 255, 255], },
	]
})
const box_canvas = new OffscreenCanvas(100, 100)
const box_ctx = box_canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
const box_image_data = box_ctx.getImageData(0, 0, box_ctx.canvas.width, box_ctx.canvas.height)


let update_time = 0
let draw_time = 0

export function init() {
	fill_canvas(canvas, resize)

	window.onpointermove = (ev) => pointer_move(ev.x, ev.y)
	window.onpointerdown = (ev) => pointer_down(ev.x, ev.y)

	setInterval(update, 100)
}

function resize() {
	w = ctx.canvas.width
	h = ctx.canvas.height;
	[box_x, box_y] = center_rect(w, h, box_w, box_h)

	draw()
}


function pointer_move(px: number, py: number) {
	pointer_down(px, py)
}

function pointer_down(px: number, py: number) {
	const [bx, by] = get_box_coord(px, py)
	if (bx < 0 || by < 0 || bx >= box.width || by >= box.height) return

	box.set_tile(bx, by, [1, 0])

	draw()
}


function update() {
	update_time = Date.now()
	box.update(update_all)
	update_time = Date.now() - update_time

	draw()
}

function draw() {
	ctx.imageSmoothingEnabled = false
	box_ctx.imageSmoothingEnabled = false

	const w = ctx.canvas.width
	const h = ctx.canvas.height
	ctx.clearRect(0, 0, w, h)

	draw_time = Date.now()
	box.render_to_image_data(box_image_data)
	draw_time = Date.now() - draw_time

	box_ctx.putImageData(box_image_data, 0, 0)
	ctx.drawImage(box_canvas, box_x, box_y, box_w, box_h)

	ctx.strokeStyle = '#1b1c33'
	ctx.lineWidth = 4
	ctx.strokeRect(box_x - 4, box_y - 4, box_w + 8, box_h + 8)

	ctx.fillStyle = '#3a4466'
	ctx.font = 'bold 16px monospace'
	ctx.textAlign = 'left'
	ctx.textBaseline = 'top'
	ctx.fillText(`U:${update_time}ms D:${draw_time}ms`, 16, 16)
	ctx.fillText(`I:${box.current_iteration}`, 16, 16 + 24)
}


function get_box_coord(cx: number, cy: number): [number, number] {
	return [
		Math.floor((cx - box_x) * (box.width / box_w)),
		Math.floor((cy - box_y) * (box.height / box_h)),
	]
}
