// don't chane the names
export const BLOCKS = {
	"trunk": { size: [2, 2, 4], pos: [0, 0], dim: [32, 48] },
	"brown": { size: [4, 4, 3], pos: [32, 0], dim: [64, 48] },
	"oak": { size: [4, 4, 4], pos: [64, 64], dim: [64, 64] },
	"pine": { size: [4, 4, 4], pos: [128, 64], dim: [64, 64] },

	"grass": { size: [4, 4, 0], pos: [96, 0], dim: [64, 64] },
	"mud.puddle": { size: [2, 2, 0], pos: [64, 128], dim: [32, 32] },
	"mud": { size: [4, 4, 0], pos: [96, 128], dim: [64, 64] },
	"sand": { size: [4, 4, 0], pos: [128, 192], dim: [64, 64] },
	"moss": { size: [4, 4, 0], pos: [336, 128], dim: [64, 64] },
	"water": { size: [4, 4, 0], pos: [416, 128], dim: [64, 64] },
	"road": { size: [4, 4, 0], pos: [368, 208], dim: [64, 64] },

	"grass.edge1.w": { size: [2, 2, 0], pos: [176, 128], dim: [32, 32] },
	"grass.edge1.n": { size: [2, 2, 0], pos: [208, 128], dim: [32, 32] },
	"grass.edge1.e": { size: [2, 2, 0], pos: [208, 160], dim: [32, 32] },
	"grass.edge1.s": { size: [2, 2, 0], pos: [176, 160], dim: [32, 32] },
	"grass.edge2.w": { size: [2, 2, 0], pos: [256, 128], dim: [32, 32] },
	"grass.edge2.n": { size: [2, 2, 0], pos: [288, 128], dim: [32, 32] },
	"grass.edge2.e": { size: [2, 2, 0], pos: [288, 160], dim: [32, 32] },
	"grass.edge2.s": { size: [2, 2, 0], pos: [256, 160], dim: [32, 32] },
	"grass.edge3.w": { size: [2, 2, 0], pos: [208, 208], dim: [32, 32] },
	"grass.edge3.n": { size: [2, 2, 0], pos: [240, 208], dim: [32, 32] },
	"grass.edge3.e": { size: [2, 2, 0], pos: [240, 240], dim: [32, 32] },
	"grass.edge3.s": { size: [2, 2, 0], pos: [208, 240], dim: [32, 32] },

	"wood.column": { size: [1, 1, 6], pos: [176, 0], dim: [16, 64] },
	"stone.wall.x": { size: [4, 1, 6], pos: [216, 0], dim: [40, 96] },
	"stone.wall.y": { size: [1, 4, 6], pos: [280, 0], dim: [40, 96] },
	"wood.door.y": { size: [1, 2, 6], pos: [336, 0], dim: [24, 68] },
	"wood.door.x": { size: [2, 1, 6], pos: [368, 0], dim: [24, 68] },

	"roof.ns": { size: [10, 10, 6], pos: [496, 0], dim: [164, 172] },
	"roof.ew": { size: [10, 10, 6], pos: [688, 0], dim: [164, 172] },
	"roof.ns.brown": { size: [10, 10, 3], pos: [448, 192], dim: [164, 164] },

	"room.floor.stone": { size: [4, 4, 0], pos: [288, 208], dim: [64, 64] },
}
export const GROUND_TILE_W = BLOCKS['grass'].size[0]
export const GROUND_TILE_H = BLOCKS['grass'].size[1]
export const GRID_SIZE = 8
export const MAP_VERSION = 1

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
	return {
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
}
