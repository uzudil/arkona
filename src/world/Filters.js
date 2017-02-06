import Phaser from "phaser"

export const FILTERS = {}

export function preload(state) {
	state.load.shader("water", "/assets/shaders/water.frag?cb=" + Date.now());
	state.load.shader("simpleWater", "/assets/shaders/simpleWater.frag?cb=" + Date.now());
	state.load.shader("lava", "/assets/shaders/lava.frag?cb=" + Date.now());
	// these have to be loaded separately (ie not from the atlas) in order to be able to work with the shaders
	state.load.image("water-texture", "assets/images/water.png?cb=" + Date.now());
	state.load.image("lava-texture", "assets/images/lava.png?cb=" + Date.now());
}

export function create(game) {
	FILTERS["water"] = _initSimpleWater(game)
	FILTERS["lava"] = _initLava(game)
}

// function _initWater(game) {
// 	let sprite = game.add.sprite(-500, -500, "water-texture")
// 	let filter = new Phaser.Filter(game, null, game.cache.getShader("water"))
// 	filter.setResolution(sprite.texture.width, sprite.texture.height)
// 	return filter
// }

function _initSimpleWater(game) {
	let sprite = game.add.sprite(-500, -500, "water-texture")
	let filter = new Phaser.Filter(game, {
		iChannel0: { type: "sampler2D", value: sprite.texture, textureData: { repeat: true } }
	}, game.cache.getShader("simpleWater"))
	filter.setResolution(sprite.texture.width * 2, sprite.texture.height * 2)
	return filter
}

function _initLava(game) {
	let sprite = game.add.sprite(-550, -550, "lava-texture")
	let filter = new Phaser.Filter(game, {
		iChannel0: { type: "sampler2D", value: sprite.texture, textureData: { repeat: true } }
	}, game.cache.getShader("lava"))
	filter.setResolution(sprite.texture.width, sprite.texture.height)
	return filter
}

export function update() {
	try {
		for(let key in FILTERS) {
			FILTERS[key].update()
		}
	} catch(e) {
		console.error(e)
	}
}