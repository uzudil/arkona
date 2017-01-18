import {BLOCKS} from './Blocks'

export const WIDTH = 1024
export const HEIGHT = 768
export const NARRATE_HEIGHT = 100
export const CONVO_HEIGHT = 220
export const GROUND_TILE_W = BLOCKS['grass'].size[0]
export const GROUND_TILE_H = BLOCKS['grass'].size[1]
export const GRID_SIZE = 8
export const MAP_VERSION = 1
export const SPEED = 100
export const DOORS = Object.keys(BLOCKS).filter(name => name.indexOf(".door.") >= 0)
export const UNSTABLE_FLOORS = [ "water" ]
export const ANIMATION_SPEED = 8
export const GAME_ZOOM = 2
export const DIR_N = 'n'
export const DIR_NE = 'ne'
export const DIR_E = 'e'
export const DIR_SE = 'se'
export const DIR_S = 's'
export const DIR_SW = 'sw'
export const DIR_W = 'w'
export const DIR_NW = 'nw'
export const DIR_NONE = 'none'
export const DIRS = [DIR_N, DIR_NE, DIR_E, DIR_SE, DIR_S, DIR_SW, DIR_W, DIR_NW]
export const MOVE_RANDOM = "random"
export const MOVE_ANCHOR = "anchor"
export const STOP_TIME = 3000
export const NEAR_DIST = 4
export const DEBUG_BLOCKS = false
// export const FONT_FAMILY = "Trade Winds"
export const FONT_FAMILY = "Trade Winds"
export const FONT_FAMILY_NAME = "Trade Winds"
export const ARKONA_FONT_FAMILY = "Old Standard TT"
export const ARKONA_FONT_FAMILY_NAME = "Old Standard TT"

export function getRandomDir() {
	return DIRS[(Math.random() * DIRS.length)|0]
}

export function getOppositeDoor(name) {
	let dir = name.substring(name.length - 1)
	return name.substring(0, name.length - 1) + (dir == 'x' ? 'y' : 'x')
}

export function toCss(name) {
	let suffix = BLOCKS[name].options && BLOCKS[name].options["sprites"] ? BLOCKS[name].options.sprites : ""
	return "" +
		"background-image: url(\"/assets/images/arkona" + suffix + ".png\"); " +
		"background-position: -" + BLOCKS[name].pos[0] + "px -" + BLOCKS[name].pos[1] + "px; " +
		"width: " + BLOCKS[name].dim[0] + "px; " +
		"height: " + BLOCKS[name].dim[1] + "px; ";
}

/**
 * Convert BLOCKS into a format that can be understood by phaser's atlas().
 *
 * @returns a json structure describing our blocks
 */
export function toJson(sprites) {
	return {
		frames: Object.keys(BLOCKS).filter(key => _isOfSprite(sprites, key)).map(key => {
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
			size: {"h": 1024, "w": 1200}
		}
	}
}

function _isOfSprite(sprites, key) {
	let b = BLOCKS[key]
	return (sprites == null && (b.options == null || b.options.sprites == null)) ||
		(b.options && b.options.sprites == sprites)
}
