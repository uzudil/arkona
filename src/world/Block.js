import Phaser from 'phaser'
import * as Config from '../config/Config'
import $ from 'jquery'

function _key(x, y, z) {
	return x + "." + y + "." + z
}

function _visit(name, worldX, worldY, fx) {
	let block = Config.BLOCKS[name]
	for(let xx = worldX - block.size[0]; xx < worldX; xx++) {
		for (let yy = worldY - block.size[1]; yy < worldY; yy++) {
			fx(xx, yy)
		}
	}
}

function _visit3(name, worldX, worldY, worldZ, fx) {
	let block = Config.BLOCKS[name]
	_visit(name, worldX, worldY, (xx, yy) => {
		if(block.size[2] == 0) {
			fx(xx, yy, 0)
		} else {
			for (let zz = worldZ; zz < worldZ + block.size[2]; zz++) {
				fx(xx, yy, zz)
			}
		}
	})
}

export function isFlat(sprite) {
	return sprite && isFlatByName(sprite.name)
}

function isFlatByName(name) {
	return Config.BLOCKS[name].size[2] == 0
}

class ImageInfo {
	constructor(name, image) {
		this.name = name
		this.image = image
	}
}

class BlockInfo {
	constructor(x, y, z, imageInfo) {
		this.x = x
		this.y = y
		this.z = z
		this.imageInfos = [ imageInfo ]
	}
}

class Layer {
	constructor(game, name, sorted) {
		this.game = game
		this.name = name
		this.sorted = sorted
		this.group = game.add.group()
		this.infos = {} // 3d space
		this.world = {} // origin space
	}

	reset() {
		this.infos = {}
		this.world = {}
		while(this.group.children.length > 0) this.group.children[0].destroy()
	}

	hasImage(name, x, y) {
		let key = _key(x, y, 0)
		let info = this.world[key]
		return info && info.imageInfos.find(i => i.name == name)
	}

	set(name, x, y, z, sprite, skipInfo) {
		this.group.add(sprite)
		if(!skipInfo) {
			// todo: remove data from previous place
			this.updateInfo(name, x, y, z, sprite)
		}
	}

	clear(name, x, y, z) {
		let key = _key(x, y, z)
		let info = this.world[key]
		if (info) {
			for (let imageInfo of info.imageInfos) imageInfo.image.destroy()
			delete this.world[key]
		}

		let block = Config.BLOCKS[name]
		if(block.size[2] > 0) {
			_visit3(name, x, y, z, (xx, yy, zz) => {
				let key = _key(xx, yy, zz)
				let info = this.infos[key]
				if (info) {
					for (let imageInfo of info.imageInfos) imageInfo.image.destroy()
					delete this.infos[key]
				}

				if (x == xx && y == yy && z == zz) {
					delete this.world[key]
				}
			})
		}
	}

	updateInfo(name, x, y, z, image) {
		let key = _key(x, y, z)
		let info = this.world[key]
		if (info == null) {
			info = new BlockInfo(x, y, z, new ImageInfo(name, image))
			this.world[key] = info
		} else {
			info.imageInfos.push(new ImageInfo(name, image))
		}

		let block = Config.BLOCKS[name]
		if(block.size[2] > 0) {
			_visit3(name, x, y, z, (xx, yy, zz) => {
				let key = _key(xx, yy, zz)
				let info = this.infos[key]
				if (info == null) {
					info = new BlockInfo(x, y, z, new ImageInfo(name, image))
					this.infos[key] = info
				} else {
					info.imageInfos.push(new ImageInfo(name, image))
				}
			})
		}
	}

	/**
	 * The lowest empty z coordinate at this location.
	 *
	 * @param worldX
	 * @param worldY
	 * @param sprite
	 */
	getTopAt(worldX, worldY, sprite) {
		let maxZ = 0
		if(sprite && !isFlat(sprite)) {
			_visit(sprite.name, worldX, worldY, (xx, yy) => {
				for (let z = 15; z >= 0; z--) {
					let info = this.infos[_key(xx, yy, z)]
					if (info) {
						if (z + 1 > maxZ) maxZ = z + 1
						break
					}
				}
			})
		}
		return maxZ
	}

	isFree(worldX, worldY, worldZ, w, h, d) {
		for(let xx = worldX - w; xx < worldX; xx++) {
			for (let yy = worldY - h; yy < worldY; yy++) {
				for (let zz = worldZ; zz < worldZ + d; zz++) {
					let info = this.infos[_key(xx, yy, zz)]
					if (info) return false
				}
			}
		}
		return true
	}

	sort() {
		if(this.sorted) {
			// from: https://mazebert.com/2013/04/18/isometric-depth-sorting/
			this.group.customSort((a, b) => {
				return a.isoDepth > b.isoDepth ? 1 : (a.isoDepth < b.isoDepth ? -1 : 0);
			})
		}
	}

	move(dx, dy) {
		this.group.x += dx
		this.group.y += dy
	}

	save() {
		return {
			name: this.name,
			world: Object.keys(this.world).map(key => {
				let info = this.world[key]
				return {
					x: info.x,
					y: info.y,
					z: info.z,
					images: info.imageInfos.map(ii => ii.name)
				}
			})
		}
	}

	load(layerInfo, blocks) {
		for(let info of layerInfo.world) {
			for (let image of info.images) {
				blocks.set(image, info.x, info.y, info.z)
			}
		}
		this.sort()
	}
}

/**
 * A map section made of blocks.
 *
 * Some ideas came from: https://mazebert.com/2013/04/18/isometric-depth-sorting/
 */
export default class {

	constructor(game) {
		this.game = game
		this.floorLayer = new Layer(game, "floor")
		this.edgeLayer = new Layer(game, "edge")
		this.objectLayer = new Layer(game, "object", true)
		this.roofLayer = new Layer(game, "roof")
		this.layers = [
			this.floorLayer, this.edgeLayer, this.objectLayer, this.roofLayer
		]
		this.layersByName = {}
		for(let layer of this.layers) this.layersByName[layer.name] = layer
	}

	newMap(name, w, h) {
		this.name = name
		this.w = w
		this.h = h
		for(let layer of this.layers) layer.reset()

		for(let x = 0; x < w; x += 4) {
			for(let y = 0; y < h; y += 4) {
				this.set('grass', x, y, 0)
			}
		}
	}

	isInBounds(x, y) {
		return x >= 0 && x < this.w && y >= 0 && y < this.h
	}

	isGrass(x, y) {
		return this.floorLayer.hasImage("grass", x, y)
	}

	_getLayer(name) {
		let size = Config.BLOCKS[name].size
		let layer
		if(size[2] > 0) {
			layer = this.objectLayer
		} else if(name.indexOf(".edge") > 0) {
			layer = this.edgeLayer
		} else {
			layer = this.floorLayer
		}
		return layer
	}

	clear(name, x, y, z) {
		this._getLayer(name).clear(name, x, y, z)
	}

	set(name, x, y, z, skipInfo) {
		let screenX, screenY
		[ screenX, screenY ] = this.toScreenCoords(x, y, z)

		let sprite = this.game.add.image(screenX, screenY, 'sprites', name)
		let size = Config.BLOCKS[name].size

		this._saveInSprite(sprite, name, x, y, z)

		let baseHeight = size[1] * Config.GRID_SIZE
		sprite.anchor.setTo(1 - baseHeight / sprite._frame.width, 1)

		this._getLayer(name).set(name, x, y, z, sprite, skipInfo)
		return sprite
	}

	moveTo(sprite, x, y, z, skipInfo) {
		// move to new position
		let screenX, screenY
		[ screenX, screenY ] = this.toScreenCoords(x, y, z)

		this._saveInSprite(sprite, null, x, y, z)

		sprite.x = screenX
		sprite.y = screenY

		this._getLayer(sprite.name).set(sprite.name, x, y, z, sprite, skipInfo)

		if(!skipInfo) {
			// todo: remove data from previous place

			this.updateInfo(sprite.name, x, y, z, sprite)
		}
	}

	_saveInSprite(sprite, name, x, y, z) {
		// set some calculated values
		if(name) sprite.name = name
		sprite.gamePos = [x, y, z]
		sprite.isoDepth = x + y + 0.001 * z
	}

	/**
	 * The lowest empty z coordinate at this location.
	 *
	 * @param worldX
	 * @param worldY
	 * @param sprite
	 */
	getTopAt(worldX, worldY, sprite) {
		return this.objectLayer.getTopAt(worldX, worldY, sprite)
	}


	isFree(worldX, worldY, worldZ, w, h, d) {
		return this.objectLayer.isFree(worldX, worldY, worldZ, w, h, d)
	}

	sort() {
		this.objectLayer.sort()
	}

	toScreenCoords(worldX, worldY, worldZ) {
		return [
			(worldX - worldY) * Config.GRID_SIZE + this.game.world.centerX,
			((worldY + worldX - worldZ) + 10) * Config.GRID_SIZE
		]
	}

	toWorldCoords(screenX, screenY) {
		let sx = (screenX - this.game.world.centerX - this.floorLayer.group.x) / Config.GRID_SIZE
		let sy = (screenY - this.floorLayer.group.y) / Config.GRID_SIZE
		let worldY = (sy - 10 - sx) / 2
		let worldX = sx + worldY
		return [
			(worldX)|0,
			(worldY)|0,
			0 // todo: figure this out?
		]
	}

	toScreenCoordsFloor(worldX, worldY) {
		return this.toScreenCoords(worldX, worldY, 0)
	}

	move(dx, dy) {
		for(let layer of this.layers) layer.move(dx, dy)
	}

	save() {
		return JSON.stringify({
			version: Config.MAP_VERSION,
			name: this.name,
			width: this.w,
			height: this.h,
			layers: this.layers.map(layer => layer.save())
		})
	}

	load() {
		$.ajax({
			url: "/assets/maps/" + this.name + ".json",
			dataType: "json",
			success: (data) => {
				this.newMap(this.name, data.width, data.height)
				for(let layerInfo of data.layers) {
					this.layersByName[layerInfo.name].load(layerInfo, this)
				}
			}
		})
	}
}
