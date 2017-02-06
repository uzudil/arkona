import Phaser from "phaser"
import { centerGameObjects, loadSettings, saveSettings } from "../utils"
import * as Config from "../config/Config"
import Creature from "../models/Creature"
import $ from "jquery"
import Transition from "../ui/Transition"

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
		this.load.atlas("sprites", "assets/images/arkona.png?cb=" + Date.now(), null, Config.toJson(), Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas("sprites2", "assets/images/arkona2.png?cb=" + Date.now(), null, Config.toJson(2), Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

		this.load.image("logo", "./assets/images/logo.png")
		this.load.shader("shader", "/assets/shaders/logo.frag?cb=" + Date.now());
		this.load.shader("shader2", "/assets/shaders/logo2.frag?cb=" + Date.now());

		Creature.preload(this.game)
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
		this.game.stage.backgroundColor = "#222222";

		this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader("shader"))
		this.filter.addToWorld(0, 0, Config.WIDTH, Config.HEIGHT, 0, 0)

		this.logo = this.add.image(this.game.world.centerX - 256, 50, "logo")
		this.filter2 = new Phaser.Filter(this.game, {
			iChannel0: { type: "sampler2D", value: this.logo.texture, textureData: { repeat: true } }
		}, this.game.cache.getShader("shader2"))
		this.filter2.setResolution(512, 256)
		this.logo.filters = [ this.filter2 ]

		var style = {font: "bold 36px " + Config.FONT_FAMILY_NAME, fill: "#888"};
		this.menu = []
		let y = 400
		for(let s of ["Game Editor", "New Game", "Load Game", "Options"]) {
			let m = this.game.add.text(this.game.world.centerX, y, s, style)
			m.anchor.setTo(0.5, 0.5)
			this.menu.push(m)
			y += 50
		}
		style = {font: "bold 20px " + Config.FONT_FAMILY_NAME, fill: "#555"};
		this.copyright = this.game.add.text(this.game.world.centerX, 720, "MMXVII \u00A9 Gabor Torok", style);
		this.copyright.anchor.setTo(0.5, 0.5)

		this.menuIndex = 0
		this.updateMenu()

		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

		this.transition = new Transition()
	}

	updateMenu() {
		var style = {font: "bold 36px " + Config.FONT_FAMILY_NAME, fill: "#888"};
		var activeStyle = {font: "bold 42px " + Config.FONT_FAMILY_NAME, fill: "#c8c"};
		for(let i = 0; i < this.menu.length; i++) {
			this.menu[i].setStyle(i == this.menuIndex ? activeStyle : style)
		}
	}

	update() {
		this.filter.update()
		this.filter2.update()
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
				this.transition.fadeIn(() => {
					this.state.start("Arkona")
				})
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
