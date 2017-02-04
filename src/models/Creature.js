import {range} from '../utils'
import * as Config from '../config/Config'
import * as Creatures from '../config/Creatures'

export default class {

	static preload(game) {
		for(let k in Creatures.CREATURES) {
			let c = Creatures.CREATURES[k]
			game.load.spritesheet(k, c.src + "?cb=" + Date.now(), ...c.dim)
		}
	}

	constructor(game, name, blocks, x, y, z) {
		this.game = game
		this.name = name
		this.blocks = blocks
		this.info = Creatures.CREATURES[this.name]
		this.animationSpeed = Config.ANIMATION_SPEED

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
			sprite.creature = this
			return sprite
		})
		this.blocks.sort()
	}

	centerOn() {
		this.blocks.centerOn(this.sprite, Config.GAME_ZOOM)
	}

	moveTo(nx, ny, nz) {
		return this.blocks.moveTo(this.sprite, nx, ny, nz)
	}

	walk(dir) {
		this.sprite.animations.play('walk.' + dir, this.animationSpeed, true)
	}

	stand(dir) {
		if(dir) {
			this.sprite.animations.play('stand.' + dir)
		} else {
			this.sprite.animations.stop()
		}
	}
}
