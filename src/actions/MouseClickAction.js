import UseObject from "./UseObject"
import Talk from "./Talk"

export default class {

	constructor() {
		this.sprite = null
		this.talk = new Talk()
		this.useObject = new UseObject()
	}

	getType() {
		return "mouse_click"
	}

	getPos() {
		return this.sprite ? this.sprite.gamePos : null
	}

	// eslint-disable-next-line no-unused-vars
	check(arkona) {
		return this.sprite && arkona.canPlayerReach(this.sprite) &&
			(this.talk.isValid(this.sprite) || this.useObject.isValid(arkona, this.sprite))
	}

	// eslint-disable-next-line no-unused-vars
	setContext(context) {
		this.sprite = context
	}

	run(arkona) {
		return this.useObject.setSprite(this.sprite).run(arkona) ||
			this.talk.setSprite(this.sprite).run(arkona)
	}
}