import './main.sass'
import { fill_canvas } from './canvas'
import { center_rect } from './utils'


const canvas = document.getElementById('box_canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D


function init() {
	fill_canvas(canvas, draw)
	draw()
}


function draw() {
	const w = ctx.canvas.width
	const h = ctx.canvas.height
	ctx.clearRect(0, 0, w, h)

	const box_w = 800
	const box_h = 800
	const [box_x, box_y] = center_rect(w, h, box_w, box_h)
	ctx.strokeStyle = '#1b1c33'
	ctx.lineWidth = 4
	ctx.strokeRect(box_x, box_y, box_w, box_h)
}


init()
