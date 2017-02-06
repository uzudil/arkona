import Phaser from "phaser"
import WebFont from "webfontloader"
import {FONT_FAMILY, ARKONA_FONT_FAMILY} from "../config/Config"
import * as Filters from "../world/Filters"

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = "#000000"
		this.fontsReady = false
		this.fontsLoaded = this.fontsLoaded.bind(this)
	}

	preload() {
		WebFont.load({
			google: {
				families: [FONT_FAMILY, ARKONA_FONT_FAMILY]
			},
			active: this.fontsLoaded
		})

		let text = this.add.text(this.world.centerX, this.world.centerY, "loading fonts", {
			font: "16px Arial",
			fill: "#dddddd",
			align: "center"
		})
		text.anchor.setTo(0.5, 0.5)

		this.load.image("loaderBg", "./assets/images/loader-bg.png")
		this.load.image("loaderBar", "./assets/images/loader-bar.png")

		Filters.preload(this)
	}

	render() {
		if (this.fontsReady) {
			this.state.start("Splash")
		}
	}

	fontsLoaded() {
		this.fontsReady = true
	}

}
