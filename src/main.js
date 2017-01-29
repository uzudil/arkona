import 'pixi'
import 'p2'
import Phaser from 'phaser'
import $ from 'jquery'
import { loadSettings } from './utils'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import EditorState from './states/Editor'
import ArkonaState from './states/Arkona'

import * as Config from './config/Config'

class Game extends Phaser.Game {

	constructor() {
		let o = loadSettings()
		// set to Phaser.AUTO for webgl (this will result in more fan noise)
		super(Config.WIDTH, Config.HEIGHT, o["use_webgl"] ? Phaser.AUTO : Phaser.CANVAS, 'content', null)
		$("#palette").height((Config.HEIGHT - 46) + "px")

		this.state.add('Boot', BootState, false)
		this.state.add('Splash', SplashState, false)
		this.state.add('Editor', EditorState, false)
		this.state.add('Arkona', ArkonaState, false)

		this.state.start('Boot')
	}
}

window.game = new Game()
