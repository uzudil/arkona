import {BLOCKS} from "./Blocks"

export const WIDTH = 1024
export const HEIGHT = 768
export const NARRATE_HEIGHT = 100
export const CONVO_HEIGHT = 220
export const GROUND_TILE_W = BLOCKS["grass"].size[0]
export const GROUND_TILE_H = BLOCKS["grass"].size[1]
export const GRID_SIZE = 8
export const MAP_VERSION = 1
export const PLAYER_SPEED = 1.33
export const DOORS = Object.keys(BLOCKS).filter(name => name.indexOf(".door.") >= 0)
export const UNSTABLE_FLOORS = [ "water", "bramble", "lava" ]
export const ANIMATION_SPEED = 8
export const GAME_ZOOM = 2
export const DIR_N = "n"
export const DIR_NE = "ne"
export const DIR_E = "e"
export const DIR_SE = "se"
export const DIR_S = "s"
export const DIR_SW = "sw"
export const DIR_W = "w"
export const DIR_NW = "nw"
export const DIR_NONE = "none"
export const DIRS = [DIR_E, DIR_NE, DIR_N, DIR_NW, DIR_W, DIR_SW, DIR_S, DIR_SE]
export const MOVE_RANDOM = "random"
export const MOVE_ANCHOR = "anchor"
export const MOVE_ATTACK = "attack"
export const MOVE_NEAR_PLAYER = "near_player"
export const STOP_TIME = 3000
export const NEAR_DIST = 4
export const MID_DIST = 16
export const FAR_DIST = 26
export const ACTION_DIST = 6
export const DEBUG_BLOCKS = false
// export const FONT_FAMILY = "Trade Winds"
export const FONT_FAMILY = "Trade Winds"
export const FONT_FAMILY_NAME = "Trade Winds"
export const ARKONA_FONT_FAMILY = "Old Standard TT"
export const ARKONA_FONT_FAMILY_NAME = "Old Standard TT"
export const MAX_Z = 15
export const START_MAP = "farm"
export const PLAYER_CREATURE_NAME = "man"

export const NO_BLEND = 0
export const BLENDS = 1
export const BLEND_TO_BLEND = 2

export const MOVE_DELTA = {
	w: [-1, 0],
	e: [1, 0],
	n: [0, -1],
	s: [0, 1],
	// diagonal move: 1^2=x^2+x^2 ==> x ~= sqrt(0.5) ~= 0.71
	nw: [-0.71, -0.71],
	se: [0.71, 0.71],
	sw: [-0.71, 0.71],
	ne: [0.71, -0.71],
}

export function getRandomDir() {
	return DIRS[(Math.random() * DIRS.length)|0]
}

export function getOppositeDoor(name) {
	let dir = name.substring(name.length - 1)
	return name.substring(0, name.length - 1) + (dir == "x" ? "y" : "x")
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

export function getDirToLocation(fromX, fromY, toX, toY) {
	let dx = toX - fromX
	let dy = fromY - toY
	let theta = Math.atan2(dy, dx)
	let angle = theta/Math.PI*180
	let e = 22.5
	let oct = angle / e
	let dir;
	if((oct >= 0 && oct <= 1) || (oct < 0 && oct > -1)) dir = DIR_E;
	else if(oct >= 1 && oct < 3) dir = DIR_NE;
	else if(oct >= 3 && oct < 5) dir = DIR_N;
	else if(oct >= 5 && oct < 7) dir = DIR_NW;
	else if(oct >= 7 || oct < -7) dir = DIR_W;
	else if(oct >= -7 && oct < -5) dir = DIR_SW;
	else if(oct >= -5 && oct < -3) dir = DIR_S;
	else if(oct >= -3 && oct < -1) dir = DIR_SE;
	else throw "Can't find direction for angle=" + angle;
	// console.warn("from=" + fromX.toFixed(2) + "," + fromY.toFixed(2) +
	// 	" to " + toX.toFixed(2) + "," + toY.toFixed(2) +
	// 	" angle=" + angle.toFixed(2) +
	// 	" oct=" + oct.toFixed(2) +
	// 	" dir=" + dir)
	return dir
}

export function dirsFrom(startDir) {
	let idx = DIRS.indexOf(startDir)
	let dirs = []
	for(let i = 0; i < DIRS.length; i++) {
		dirs.push(DIRS[idx])
		idx++
		if(idx >= DIRS.length) idx = 0
	}
	return dirs
}
