import * as Config from "../config/Config"

export default class {
	constructor(arkona) {
		this.arkona = arkona
		this.bitmapData = this.arkona.game.add.bitmapData(Config.WIDTH, Config.HEIGHT)

		let grd= this.bitmapData.context.createRadialGradient(
			Config.WIDTH/2,Config.HEIGHT/2,Config.HEIGHT*0.5,
			Config.WIDTH/2,Config.HEIGHT/2,Config.HEIGHT*0.1)
		grd.addColorStop(0, "black")
		grd.addColorStop(1, "rgba(0,0,0,0)")

		this.bitmapData.context.fillStyle = grd
		this.bitmapData.context.fillRect(0, 0, Config.WIDTH, Config.HEIGHT)

		// add to game
		this.overlay = this.arkona.game.add.sprite(0, 0, this.bitmapData)
		this.overlay.visible = false
	}

	setVisible(visible) {
		this.overlay.visible = visible
	}
}