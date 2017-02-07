export const centerGameObjects = (objects) => {
	objects.forEach(function (object) {
		object.anchor.setTo(0.5)
	})
}

export const setResponsiveWidth = (sprite, percent, parent) => {
	let percentWidth = (sprite.texture.width - (parent.width / (100 / percent))) * 100 / sprite.texture.width
	sprite.width = parent.width / (100 / percent)
	sprite.height = sprite.texture.height - (sprite.texture.height * percentWidth / 100)
}

export const getRandom = (list) => list[(Math.random() * list.length) | 0]

export const range = (start, end) => { return [...Array(end-start).keys()].map(v => start+v) }

export const dist3d = (ax, ay, az, bx, by, bz) => {
	let dx = ax - bx
	let dy = ay - by
	let dz = az - bz
	return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

export const inRect = (x, y, rx, ry, rw, rh) => {
	return x >= rx && x < rx + rw && y >= ry && y < ry + rh
}


export function loadSettings() {
	let o = window.localStorage["arkona"]
	if (o) return JSON.parse(o)
	else return {}
}

export function saveSettings(o) {
	window.localStorage["arkona"] = JSON.stringify(o)
}

export const flatten = list => list.reduce(
	(a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);