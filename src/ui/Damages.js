import * as Config from "../config/Config"

const SPEED = 0.1
const TTL = 1500

export default class {
	constructor(arkona) {
		this.arkona = arkona
		this.damages = []
	}

	add(amount, worldX, worldY, worldZ, isPlayerDamage) {
		let [screenX, screenY] = this.arkona.blocks.toAbsScreenCoords(worldX, worldY, worldZ)
		let eol = Date.now() + TTL
		let sprite = this.arkona.game.add.text(screenX, screenY - 50, "" + amount, this._getStyle(isPlayerDamage, eol));
		sprite.ttl = eol
		sprite.isPlayerDamage = isPlayerDamage
		this.damages.push(sprite)
	}

	update() {
		let now = Date.now()
		for(let i = 0; i < this.damages.length; i++) {
			let sprite = this.damages[i]
			if(now > sprite.ttl) {
				this.damages.splice(i, 1)
				sprite.destroy()
				i--
			} else {
				sprite.y -= this.arkona.game.time.elapsedMS / (60 * SPEED)
				sprite.setStyle(this._getStyle(sprite.isPlayerDamage, sprite.ttl))
			}
		}
	}

	_getStyle(isPlayerDamage, ttl) {
		let p = (ttl - Date.now()) / TTL
		return {font: "bold 32px " + Config.FONT_FAMILY, fill: (isPlayerDamage ? "rgba(255,64,32," + p + ")" : "rgba(255,255,64," + p + ")"), boundsAlignH: "left", boundsAlignV: "top"}
	}
}
