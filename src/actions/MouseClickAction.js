import UseObject from "./UseObject"
import Talk from "./Talk"
import Attack from "./Attack"

export default class {

	constructor() {
		this.sprite = null
		this.talk = new Talk()
		this.useObject = new UseObject()
		this.attack = new Attack()
		this.action = null
	}

	getType() {
		return "mouse_click"
	}

	getPos() {
		return this.sprite ? this.sprite.gamePos : null
	}

	check(arkona) {
		this.action = null
		if(this.sprite && arkona.player.canReach(this.sprite)) {
			if(this.useObject.isValid(arkona, this.sprite)) {
				this.action = this.useObject
			} else if(this.talk.isValid(this.sprite)) {
				this.action = this.talk
			} else if(this.attack.isValid(this.sprite)) {
				this.action = this.attack
			}
		}
		return this.action != null
	}

	setContext(context) {
		this.sprite = context
	}

	run(arkona) {
		return this.action.setSprite(this.sprite).run(arkona)
	}
}