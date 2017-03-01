import {range} from "../utils"
import * as Config from "../config/Config"

export default class {
	constructor(game, name, blocks, x, y, z, animationInfos, blockName) {
		this.game = game
		this.name = name
		this.blocks = blocks
		this.animationSpeed = Config.ANIMATION_SPEED
		this.lastDir = null

		this.sprite = this.blocks.set(blockName, x, y, z, false, (screenX, screenY) => {
			let sprite = this.game.add.sprite(screenX, screenY, this.name)
			let index = 0
			for(let i = 0; i < animationInfos.length; i++) {
				index = this.loadAnimationFrames(animationInfos[i], index, sprite)
			}
			return sprite
		})
		this.blocks.sort()
	}

	loadAnimationFrames(animationInfo, index, sprite) {
		for (let dir of animationInfo.dirs) {
			let anim = sprite.animations.add(animationInfo.name + "." + dir, range(index, index + animationInfo.frameCount))
			if(animationInfo.name == "attack") {
				// switch back to stand after attack animation
				anim.onComplete.add(() => this.setAnimation("stand", this.lastDir));
			}
			index += animationInfo.frameCount
		}
		return index
	}

	centerOn() {
		this.blocks.centerOn(this.sprite, Config.GAME_ZOOM)
	}

	moveTo(nx, ny, nz) {
		return this.blocks.moveTo(this.sprite, nx, ny, nz)
	}

	setAnimation(name, dir) {
		this.lastDir = dir
		if(name == "stand") {
			if(dir) {
				this.sprite.animations.play("stand." + dir)
			} else {
				this.sprite.animations.stop()
			}
		} else if(name == "walk") {
			this.sprite.animations.play(name + "." + dir, this.animationSpeed, true)
		} else {
			this.sprite.animations.play(name + "." + dir, this.animationSpeed)
		}
	}
}