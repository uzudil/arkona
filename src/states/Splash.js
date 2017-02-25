import Phaser from "phaser"
import { centerGameObjects, loadSettings, saveSettings } from "../utils"
import * as Config from "../config/Config"
import Creature from "../models/Creature"
import $ from "jquery"
import Transition from "../ui/Transition"
import Arkona from "./Arkona"

export default class extends Phaser.State {
	init() {
	}

	preload() {
		this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, "loaderBg")
		this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, "loaderBar")
		centerGameObjects([this.loaderBg, this.loaderBar])

		this.load.setPreloadSprite(this.loaderBar)
		//
		// load your assets
		//
		this.atlas()
		this.atlas(2)
		this.atlas(3)
		this.atlas(4)

		this.load.image("logo", "./assets/images/logo.png")
		this.load.image("back", "./assets/images/back.png")

		Creature.preload(this.game)
	}

	atlas(n) {
		if(n == null) {
			this.load.atlas("sprites", "assets/images/arkona.png?cb=" + Date.now(), null, Config.toJson(), Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		} else {
			this.load.atlas("sprites" + n, "assets/images/arkona" + n + ".png?cb=" + Date.now(), null, Config.toJson(n), Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		}
	}

	create() {
		$("#close-options").click(()=>{
			$(".dialog").hide()
			window.location.reload()
		});
		$("#use-webgl").click(()=>{
			let o = loadSettings()
			o["use_webgl"] = $("#use-webgl").is(":checked")
			saveSettings(o)
		});

		this.loaderBg.kill()
		this.loaderBar.kill()
		this.game.stage.backgroundColor = "#000000";


		this.back = this.add.image(512, 400, "back")
		this.back.anchor.setTo(0.5, 0.5)

		this.logo = this.add.image(750, 100, "logo")
		this.logo.anchor.setTo(0.5, 0)

		var style = {font: "bold 20px " + Config.FONT_FAMILY, fill: "#888"};
		this.menu = []
		let y = 230
		for(let s of ["Game Editor", "New Game", "Load Game", "Options"]) {
			let m = this.game.add.text(750, y, s, style)
			m.anchor.setTo(0.5, 0.5)
			this.menu.push(m)
			y += 35
		}
		style = {font: "bold 11px " + Config.FONT_FAMILY, fill: "#555"};
		this.copyright = this.game.add.text(this.game.world.centerX, 720, "MMXVII \u00A9 Gabor Torok", style);
		this.copyright.anchor.setTo(0.5, 0.5)

		this.menuIndex = 0
		this.updateMenu()

		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

		this.transition = new Transition()
	}

	updateMenu() {
		var style = {font: "bold 20px " + Config.FONT_FAMILY, fill: "#888"};
		var activeStyle = {font: "bold 22px " + Config.FONT_FAMILY, fill: "#6ac"};
		for(let i = 0; i < this.menu.length; i++) {
			this.menu[i].setStyle(i == this.menuIndex ? activeStyle : style)
		}
	}

	update() {
		let oldMenu = this.menuIndex
		if (this.cursors.up.justDown) {
			this.menuIndex--
		} else if (this.cursors.down.justDown) {
			this.menuIndex++
		}
		if (this.menuIndex >= this.menu.length) this.menuIndex = 0
		else if (this.menuIndex < 0) this.menuIndex = this.menu.length - 1
		if (oldMenu != this.menuIndex) this.updateMenu()

		if(this.space.justDown) {
			if(this.menuIndex == 0) {
				$("#right-menu").show()
				this.state.start("Editor")
			} else if(this.menuIndex == 1) {
				// new game
				if(!Arkona.doesSaveGameExist() || confirm("Delete saved game?")) {
					this.transition.fadeIn(() => {
						this.state.start("Arkona")
					})
				}
			} else if(this.menuIndex == 2) {
				// load game
				this.transition.fadeIn(() => {
					this.state.start("Arkona", true, false, { loadGame: true })
				})
			} else if(this.menuIndex == 3) {
				let o = loadSettings()
				$("#use-webgl").attr("checked", o["use_webgl"])
				$("#options").show();
			}
		}
	}
}
