export * from './color'
export * from './geom'
export * from './math'
export * from './rand'
export * from './vec2'

/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/OffscreenCanvasRenderingContext2D) */
export interface RenderContext extends CanvasCompositing, CanvasDrawImage, CanvasDrawPath, CanvasFillStrokeStyles, CanvasFilters, CanvasImageData, CanvasImageSmoothing, CanvasPath, CanvasPathDrawingStyles, CanvasRect, CanvasShadowStyles, CanvasState, CanvasText, CanvasTextDrawingStyles, CanvasTransform {
	readonly canvas: CanvasLike
}

export interface CanvasLike {
	width: number
	height: number
}
