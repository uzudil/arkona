import 'pixi'
import 'p2'
import Phaser from 'phaser'
import $ from 'jquery'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import EditorState from './states/Editor'

class Game extends Phaser.Game {

	constructor() {
		let width = document.documentElement.clientWidth > 768 ? 768 : document.documentElement.clientWidth
		let height = document.documentElement.clientHeight > 1024 ? 1024 : document.documentElement.clientHeight

		super(width, height, Phaser.AUTO, 'content', null)
		$("#palette").height((height - 46) + "px")

		this.state.add('Boot', BootState, false)
		this.state.add('Splash', SplashState, false)
		this.state.add('Editor', EditorState, false)

		this.state.start('Boot')
	}
}

window.game = new Game()
