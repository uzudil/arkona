import 'pixi'
import 'p2'
import Phaser from 'phaser'
import $ from 'jquery'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import EditorState from './states/Editor'

class Game extends Phaser.Game {

	constructor() {
		let height = 768
		let width = 1024

		super(width, height, Phaser.AUTO, 'content', null)
		$("#palette").height((height - 46) + "px")

		this.state.add('Boot', BootState, false)
		this.state.add('Splash', SplashState, false)
		this.state.add('Editor', EditorState, false)

		this.state.start('Boot')
	}
}

window.game = new Game()
