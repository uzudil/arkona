import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import * as Config from '../config/Config'
import $ from 'jquery'

export default class extends Phaser.State {
	init() {
	}

	preload() {
		this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
		this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
		centerGameObjects([this.loaderBg, this.loaderBar])

		this.load.setPreloadSprite(this.loaderBar)
		//
		// load your assets
		//
		this.load.atlas('sprites', 'assets/images/arkona.png?cb=' + Date.now(), null, Config.toJson(), Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

		this.load.image('logo', './assets/images/logo.png')

	}

	create() {
		this.loaderBg.kill()
		this.loaderBar.kill()
		this.game.stage.backgroundColor = "#222222";
		this.logo = this.add.image(this.game.world.centerX, 200, 'logo')
		this.logo.anchor.setTo(0.5, 0.5)

		var style = {font: "bold 36px Nunito", fill: "#888"};
		this.menu = []
		let y = 400
		for(let s of ["Game Editor", "New Game", "Load Game"]) {
			let m = this.game.add.text(this.game.world.centerX, y, s, style)
			m.anchor.setTo(0.5, 0.5)
			this.menu.push(m)
			y += 50
		}
		style = {font: "bold 20px Nunito", fill: "#555"};
		this.copyright = this.game.add.text(this.game.world.centerX, 720, "MMXVII \u00A9 Gabor Torok", style);
		this.copyright.anchor.setTo(0.5, 0.5)

		this.menuIndex = 0
		this.updateMenu()

		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
	}

	updateMenu() {
		var style = {font: "bold 36px Nunito", fill: "#888"};
		var activeStyle = {font: "bold 42px Nunito", fill: "#c8c"};
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
				this.state.start('Editor')
			} else if(this.menuIndex == 1) {
				// new game
				this.state.start('Arkona')
			} else if(this.menuIndex == 2) {
				// load game
				this.state.start('Arkona', true, false, { loadGame: true })
			}
		}
	}

}
