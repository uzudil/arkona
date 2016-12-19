export const BLOCKS = {
	"trunk": { size: [2, 2, 4], pos: [0, 0], dim: [32, 48] },
	"brown": { size: [4, 4, 3], pos: [32, 0], dim: [64, 48] },
	"oak": { size: [4, 4, 4], pos: [64, 64], dim: [64, 64] },
	"pine": { size: [4, 4, 4], pos: [128, 64], dim: [64, 64] },
	"grass": { size: [4, 4, 0], pos: [96, 0], dim: [64, 64] },
	"wood.column": { size: [1, 1, 6], pos: [176, 0], dim: [16, 64] },
	"stone.wall.x": { size: [4, 1, 6], pos: [216, 0], dim: [40, 96] },
	"stone.wall.y": { size: [1, 4, 6], pos: [280, 0], dim: [40, 96] }
}

export const GRID_SIZE = 8
export const DEBUG_COORDS = false

export function toCss(name) {
	return "" +
		"background-position: -" + BLOCKS[name].pos[0] + "px -" + BLOCKS[name].pos[1] + "px; " +
		"width: " + BLOCKS[name].dim[0] + "px; " +
		"height: " + BLOCKS[name].dim[1] + "px; ";
}

/**
 * Convert BLOCKS into a format that can be understood by phaser's atlas().
 *
 * @returns a json structure describing our blocks
 */
export function toJson() {
	let d = {
		frames: Object.keys(BLOCKS).map(key => {
			let obj = BLOCKS[key]
			return {
				filename: key,
				frame: { x: obj.pos[0], y: obj.pos[1], w: obj.dim[0], h: obj.dim[1] },
				rotated: false,
				trimmed: true,
				sourceSize: { w: obj.dim[0], h: obj.dim[1] },
				spriteSourceSize: {x: 0, y: 0, w: obj.dim[0], h: obj.dim[1]}
			}
		}),
		meta: {
			scale: "1",
			format: "RGBA8888",
			app: "http://www.codeandweb.com/texturepacker",
			version: "1.0",
			smartupdate: "$TexturePacker:SmartUpdate:b6887183d8c9d806808577d524d4a2b9:1e240ffed241fc58aca26b0e5d350d80:71eda69c52f7d9873cb6f00d13e1e2f8$",
			image: "arkona.png",
			size: {"h": 1600, "w": 1200}
		}
	}
	return d;
}
