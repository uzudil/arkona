import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import * as Config from '../config/Config'

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

	}

	create() {
		this.state.start('Editor')
	}

}
