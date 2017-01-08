import {range} from '../utils'

const DEFAULT_DIRS = {
	walk: ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'],
	stand: ['se', 'e', 'ne', 'n', 'nw', 'w', 'sw', 's']
}

export const CREATURES = {
	cow: {
		src: 'assets/creatures/cow.png',
		dim: [64, 64],
		blockName: '4x4x4.placeholder',
		dirs: {
			walk: ['s', 'se', 'e', 'ne', 'n', 'nw', 'w', 'sw'],
			stand: ['sw', 's', 'se', 'e', 'ne', 'n', 'nw', 'w']
		}
	},
	man: {
		src: 'assets/creatures/man.png',
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: DEFAULT_DIRS
	},
	woman: {
		src: 'assets/creatures/woman.png',
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: DEFAULT_DIRS
	}
}

export default class {

	static preload(game) {
		for(let k in CREATURES) {
			let c = CREATURES[k]
			game.load.spritesheet(k, c.src + "?cb=" + Date.now(), ...c.dim)
		}
	}

	constructor(game, name, blocks, zoom, x, y, z) {
		this.game = game
		this.name = name
		this.blocks = blocks
		this.zoom = zoom
		this.info = CREATURES[this.name]

		this.sprite = this.blocks.set(this.info.blockName, x, y, z, false, (screenX, screenY) => {
			let sprite = this.game.add.sprite(screenX, screenY, this.name)
			let index = 0
			for(let dir of this.info.dirs.walk) {
				sprite.animations.add("walk." + dir, range(index, index + 4))
				index += 4
			}
			for(let dir of this.info.dirs.stand) {
				sprite.animations.add("stand." + dir, [index++])
			}
			return sprite
		})
		this.blocks.sort()
		this.blocks.centerOn(this.sprite, this.zoom)
	}
}
