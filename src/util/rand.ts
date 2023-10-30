export function rand(): boolean {
	return Math.random() < .5
}

export function randi(max: number): number {
	return Math.floor(Math.random() * max)
}
