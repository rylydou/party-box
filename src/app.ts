import { Box, render_dirty, render_dirty_to_image as render_buffer_updates, update_all, update_dirty, render_all } from './box'
import { fill_canvas } from './directives/canvas_auto_size'
import { center_rect, line_on_grid } from './util'
import { Monitor } from './util/monitor'


const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D


let w = 100
let h = 100

let box_w = 1600
let box_h = 800
let box_x = 0
let box_y = 0
const box = new Box({
	width: 600, height: 300,
	tiles: [
		{ name: 'Air', char: '.', color: [0, 0, 0, 0], },
		{ name: 'Brick', char: 'W', color: [255, 255, 255, 255], },
		{ name: 'Sand', char: 'S', color: [255, 255, 0, 255], },
		{ name: 'Water', char: 'W', color: [0, 0, 255, 255], },
	]
})
const box_canvas = new OffscreenCanvas(box.width, box.height)
const box_ctx = box_canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
const box_image_data = box_ctx.getImageData(0, 0, box_ctx.canvas.width, box_ctx.canvas.height)
render_all(box, box_image_data)


let view_updates = false
let view_graph = false

let update_monitor = new Monitor(100)
let draw_monitor = new Monitor(100)

let is_paused = false

let mx = 0
let my = 0
let old_mx = 0
let old_my = 0

let draw_tile = 1
let draw_radius = 2
let draw_left_down = false
let draw_right_down = false


export function init() {
	window.addEventListener('mousemove', (ev) => {
		[mx, my] = get_box_coord(ev.x, ev.y)
	})
	window.addEventListener('mousedown', (ev) => {
		ev.preventDefault()
		switch (ev.button) {
			case 0: draw_left_down = true; break
			case 2: draw_right_down = true; break
			case 1:
				draw_tile = box.get_tile(mx, my) || 1
				break
		}
	})
	window.addEventListener('mouseup', (ev) => {
		ev.preventDefault()
		switch (ev.button) {
			case 0: draw_left_down = false; break
			case 2: draw_right_down = false; break
		}
	})

	window.addEventListener('contextmenu', (ev) => ev.preventDefault())

	window.addEventListener('keydown', (ev) => {
		switch (ev.key) {
			case 'a':
				if (draw_tile <= 0) break
				draw_tile -= 1
				draw()
				break
			case 'd':
				if (draw_tile >= box.tiles.length - 1) break
				draw_tile += 1
				draw()
				break
			case 's':
				if (draw_radius <= 0) break
				draw_radius -= 1
				draw()
				break
			case 'w':
				draw_radius += 1
				draw()
				break
			case 'u':
				view_updates = !view_updates
				draw()
				break
			case 'g':
				view_graph = !view_graph
				draw()
				break
			case ' ':
				if (ev.repeat) break
				is_paused = !is_paused
				draw()
				break
		}
	})

	fill_canvas(canvas, resize)
	frame()
}

function resize() {
	w = ctx.canvas.width
	h = ctx.canvas.height;
	[box_x, box_y] = center_rect(w, h, box_w, box_h)

	draw()
}

function frame() {
	let queue_redraw = false

	if (draw_left_down) {
		place_line(draw_tile)
		commit_box()
		queue_redraw = true
	}
	if (draw_right_down) {
		place_line(0)
		commit_box()
		queue_redraw = true
	}

	if (!is_paused) {
		update()
	}

	if (queue_redraw) {
		draw()
	}

	requestAnimationFrame(frame)

	old_mx = mx
	old_my = my
}


function update() {
	update_monitor.time_func(() => {
		// box.update(update_all)
		box.update(update_dirty)
		commit_box()
		// box.update((box) => update_random(box, 5000))
	})

	draw()
}

function draw() {
	ctx.imageSmoothingEnabled = false
	box_ctx.imageSmoothingEnabled = false

	const w = ctx.canvas.width
	const h = ctx.canvas.height
	ctx.clearRect(0, 0, w, h)

	box_ctx.putImageData(box_image_data, 0, 0)
	ctx.drawImage(box_canvas, box_x, box_y, box_w, box_h)

	// if (view_updates) {
	// 	render_buffer_updates(box, box_image_data)
	// 	box_ctx.putImageData(box_image_data, 0, 0)
	// 	ctx.globalAlpha = 0.5
	// 	ctx.drawImage(box_canvas, box_x, box_y, box_w, box_h)
	// 	ctx.globalAlpha = 1.0
	// }

	if (is_paused) {
		ctx.strokeStyle = '#333c57'
		ctx.lineWidth = 4
		ctx.strokeRect(box_x - 2, box_y - 2, box_w + 4, box_h + 4)
	}

	const tile = box.tiles[draw_tile]
	ctx.font = 'bold 16px sans-serif'
	ctx.fillStyle = `rgb(${tile.color.join(',')})`
	ctx.fillText(`Radius:${draw_radius} Tile:${tile.name}`, 16, 16 + 24)


	if (view_graph) {
		draw_stats()
	}
}

function draw_stats() {
	const x_scale = 2
	const y_mark = 1000 / 75
	ctx.save()
	ctx.translate(0, h)
	ctx.fillStyle = '#566c86'
	update_monitor.draw(ctx, y_mark, x_scale, -10)
	ctx.translate(update_monitor.data.length * x_scale, 0)
	ctx.fillStyle = '#566c86'
	draw_monitor.draw(ctx, y_mark, x_scale, -10)
	ctx.restore()

	ctx.fillStyle = '#566c86'
	ctx.font = 'bold 16px monospace'
	ctx.textAlign = 'left'
	ctx.textBaseline = 'top'
	ctx.fillText(`U:${update_monitor.current}ms (${update_monitor.average.toFixed(2)}ms) D:(${draw_monitor.average.toFixed(2)}ms) C:${box.dirty_indices.size}`, 16, 16)
}

function commit_box(): void {
	draw_monitor.time_func(() => {
		render_dirty(box, box_image_data)
	})
}


function place_line(tile: number): void {
	for (const point of line_on_grid(old_mx, old_my, mx, my)) {
		box.set_circle(...point, tile, draw_radius)
	}
}


function get_box_coord(cx: number, cy: number): [number, number] {
	return [
		Math.floor((cx - box_x) * (box.width / box_w)),
		Math.floor((cy - box_y) * (box.height / box_h)),
	]
}
