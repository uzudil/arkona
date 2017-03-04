import * as Config from "../config/Config"

export default class {
	constructor(arkona) {
		this.arkona = arkona
		this.image = this.arkona.game.add.image(0, Config.HEIGHT, "device", this.group)
		this.image.anchor.set(0, 1)
	}
}