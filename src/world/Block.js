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

function _visit3d(worldX, worldY, worldZ, w, h, d, fx) {
	for(let xx = worldX - w; xx < worldX; xx++) {
		for (let yy = worldY - h; yy < worldY; yy++) {
			for (let zz = worldZ; zz < worldZ + d; zz++) {
				if(!fx(xx, yy, zz)) return false
			}
		}
	}
	return true
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
		this.unstableFloor = false // computed
	}

	removeImage(image, destroyImage) {
		for (let i = 0; i < this.imageInfos.length; i++) {
			if (this.imageInfos[i].image == image) {
				this.imageInfos.splice(i, 1)
				if(destroyImage) image.destroy()
				break
			}
		}
		return this.imageInfos.length == 0
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

	noEdge(x, y) {
		let key = _key(x, y, 0)
		let info = this.world[key]
		return info && info.imageInfos.find(i => {
				let block = Config.BLOCKS[i.name]
				return block.options && block.options.noEdge
			})
	}

	set(name, x, y, z, sprite, skipInfo) {
		this.group.add(sprite) // ok to do even if already in group
		if(!skipInfo) {
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
					delete this.infos[key]
				}
			})
		}
	}

	clearAll(x, y, z) {
		let key = _key(x, y, z)
		let info = this.infos[key]
		if (info) {
			// remove images and update the world
			let keyWorld = _key(info.x, info.y, info.z)
			let infoWorld = this.world[keyWorld]
			if (infoWorld) {
				for (let imageInfo of infoWorld.imageInfos) imageInfo.image.destroy()
				delete this.world[keyWorld]
			}

			// update infos
			for (let imageInfo of info.imageInfos) {
				_visit3(imageInfo.name, info.x, info.y, info.z, (xx, yy, zz) => {
					let keyInfo = _key(xx, yy, zz)
					let infoInfo = this.infos[keyInfo]
					if (infoInfo) {
						delete this.infos[keyInfo]
					}
				})
			}
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
		info.unstableFloor = info.imageInfos.find(ii => Config.UNSTABLE_FLOORS.indexOf(ii.name) >= 0)

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

	removeFromCurrentPos(image, destroyImage) {
		if(image && image.gamePos) {
			let key = _key(image.gamePos[0], image.gamePos[1], image.gamePos[2])
			let info = this.world[key]
			if (info && info.removeImage(image, destroyImage)) delete this.world[key]

			let block = Config.BLOCKS[image.name]
			if(block.size[2] > 0) {
				_visit3(image.name, image.gamePos[0], image.gamePos[1], image.gamePos[2], (xx, yy, zz) => {
					let key = _key(xx, yy, zz)
					let info = this.infos[key]
					if(info && info.removeImage(image)) delete this.infos[key]
				})
			}
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

	canMoveTo(sprite, x, y, z) {
		let fits = true
		_visit3(sprite.name, x, y, z, (xx, yy, zz) => {
			if(fits) {
				let info = this.infos[_key(xx, yy, zz)]
				if (info && info.imageInfos.find((ii) => ii.image != sprite)) {
					fits = false
					// todo: implement short-circuit, or reduce?
				}
			}
		})
		return fits
	}

	isFree(worldX, worldY, worldZ, w, h, d) {
		return _visit3d(worldX, worldY, worldZ, w, h, d, (xx, yy, zz) => {
			return !(this.infos[_key(xx, yy, zz)])
		})
	}

	getFloorAt(worldX, worldY) {
		let info = this.world[_key(worldX, worldY, 0)]
		return info && info.imageInfos.length > 0 ? info.imageInfos[0].name : null
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

	moveTo(x, y) {
		this.group.x = x
		this.group.y = y
	}

	findFirstAround(image, names, range) {
		let found = null
		if(image && image.gamePos) {
			_visit3d(image.gamePos[0], image.gamePos[1], image.gamePos[2], range, range, range, (xx, yy, zz) => {
				let info = this.infos[_key(xx, yy, zz)]
				if (info) {
					let imageInfo = info.imageInfos.find(ii => names.indexOf(ii.name) >= 0);
					if (imageInfo) {
						found = imageInfo.image
						return false
					}
				}
				return true
			})
		}
		return found
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


const EDGE_OFFSET = {
	n: [ -1, -3 ],
	s: [ -1, 1 ],
	e: [ 1, -1 ],
	w: [ -3, -1]
}

/**
 * A map section made of blocks.
 *
 * Some ideas came from: https://mazebert.com/2013/04/18/isometric-depth-sorting/
 */
export default class {

	constructor(game, editorMode) {
		this.game = game
		this.floorLayer = new Layer(game, "floor")
		this.edgeLayer = new Layer(game, "edge")
		this.stampLayer = new Layer(game, "stamp")
		this.objectLayer = new Layer(game, "object", true)
		this.roofLayer = new Layer(game, "roof", true)
		this.layers = [
			this.floorLayer, this.edgeLayer, this.stampLayer, this.objectLayer, this.roofLayer
		]
		this.layersByName = {}
		for(let layer of this.layers) this.layersByName[layer.name] = layer

		// cursor
		if(editorMode) {
			this.anchorDebug = this.game.add.graphics(0, 0)
			this.anchorDebug.anchor.setTo(0.5, 0.5)
			this.anchorDebug.beginFill(0xFF33ff)
			this.anchorDebug.drawRect(0, 0, Config.GRID_SIZE, Config.GRID_SIZE)
			this.anchorDebug.endFill()
			this.groundDebug = this.game.add.graphics(0, 0)
			this.groundDebug.lineStyle(1, 0xFFFF33, 1);
			this.groundDebug.drawRect(0, 0, Config.GRID_SIZE * 6, Config.GRID_SIZE * 6)
			this.groundDebug.angle = 45
		}
	}

	newMap(name, w, h, type) {
		this.name = name
		this.w = w
		this.h = h
		for(let layer of this.layers) layer.reset()

		if(type == 'grass') {
			for (let x = 0; x < w; x += 4) {
				for (let y = 0; y < h; y += 4) {
					this.set('grass', x, y, 0)
				}
			}
		}

		for(let layer of this.layers) layer.moveTo(0, 0)
	}

	drawCursor(x, y, z) {
		let gx = (((x / 4)|0) - 1) * 4
		let gy = (((y / 4)|0) - 1) * 4
		let [gsx, gsy] = this.toScreenCoords(gx, gy, 0)
		this.groundDebug.x = gsx + this.floorLayer.group.x
		this.groundDebug.y = gsy + this.floorLayer.group.y

		let [sx, sy] = this.toScreenCoords(x, y, 0)
		this.anchorDebug.x = sx + this.floorLayer.group.x
		this.anchorDebug.y = sy + this.floorLayer.group.y
	}

	isInBounds(x, y) {
		return x >= 0 && x < this.w && y >= 0 && y < this.h
	}

	isGrass(x, y) {
		return this.isInBounds(x, y) && this.floorLayer.hasImage("grass", x, y)
	}

	noEdge(x, y) {
		return this.isInBounds(x, y) && this.floorLayer.noEdge(x, y)
	}

	toggleRoof() {
		this.roofLayer.group.visible = !this.roofLayer.group.visible
	}

	checkRoof(worldX, worldY) {
		let under = this.roofLayer.infos[_key(worldX, worldY, 6)] != null
		if(under == this.roofLayer.group.visible) this.toggleRoof()
	}

	_getLayer(name) {
		let block = Config.BLOCKS[name]
		let size = block.size
		let layer
		if(this.isStamp(name)) {
			layer = this.stampLayer
		} else if(name.indexOf(".edge") > 0) {
			layer = this.edgeLayer
		} else if(name.indexOf("roof.") >= 0) {
			layer = this.roofLayer
		} else if(size[2] > 0) {
			layer = this.objectLayer
		} else {
			layer = this.floorLayer
		}
		return layer
	}

	_getLayerAndXYZ(name, x, y, z) {
		let layer = this._getLayer(name)
		if(z == 0 && layer == this.floorLayer) {
			x = ((x / Config.GROUND_TILE_W)|0) * Config.GROUND_TILE_W
			y = ((y / Config.GROUND_TILE_H)|0) * Config.GROUND_TILE_H
		}
		let offsX = 0
		let offsY = 0
		if(layer == this.edgeLayer) {
			[offsX, offsY] = EDGE_OFFSET[name.substring(name.length - 1)]
		}
		return [layer, x, y, z, offsX, offsY]
	}

	clear(name, rx, ry, rz) {
		let [layer, x, y, z] = this._getLayerAndXYZ(name, rx, ry, rz)
		layer.clear(name, x, y, z)
	}

	clearAll(x, y) {
		for(let z = 0; z < 16; z++){
			for(let layer of this.layers) {
				layer.clearAll(x, y, z)
			}
		}
	}

	// todo: figure out zoom from game.scale
	centerOn(image, zoom) {
		let [ screenX, screenY ] = this.toScreenCoords(image.gamePos[0], image.gamePos[1], image.gamePos[2])
		screenX = -(screenX - Config.WIDTH / zoom / 2)
		screenY = -(screenY - Config.HEIGHT / zoom / 2)
		for(let layer of this.layers) layer.moveTo(screenX, screenY)
	}

	_getSprites(name) {
		let b = Config.BLOCKS[name]
		return b.options == null || b.options["sprites"] == null ? "sprites" : "sprites" + b.options.sprites
	}

	set(name, rx, ry, rz, skipInfo, loaderFx) {
		let [layer, x, y, z, offsX, offsY] = this._getLayerAndXYZ(name, rx, ry, rz)

		let screenX, screenY
		[ screenX, screenY ] = this.toScreenCoords(x + offsX, y + offsY, z)

		let sprite
		if(loaderFx) {
			sprite = loaderFx(screenX, screenY)
		} else {
			sprite = this.game.add.image(screenX, screenY, this._getSprites(name), name)
		}
		let size = Config.BLOCKS[name].size

		this._saveInSprite(sprite, name, x, y, z)

		let baseHeight = size[1] * Config.GRID_SIZE
		sprite.anchor.setTo(1 - baseHeight / sprite._frame.width, 1)

		layer.set(name, x, y, z, sprite, skipInfo)
		if(!skipInfo) this.drawEdges(layer, name, x, y)
		return sprite
	}

	moveTo(sprite, rx, ry, rz, skipInfo) {
		let [layer, x, y, z, offsX, offsY] = this._getLayerAndXYZ(sprite.name, rx, ry, rz)
		if(layer.canMoveTo(sprite, x, y, z) && (skipInfo || this.isFloorSafe(x, y))) {

			layer.removeFromCurrentPos(sprite)

			// move to new position
			let screenX, screenY
			[screenX, screenY] = this.toScreenCoords(x + offsX, y + offsY, z)

			this._saveInSprite(sprite, null, x, y, z)

			sprite.x = screenX
			sprite.y = screenY

			layer.set(sprite.name, x, y, z, sprite, skipInfo)
			if(!skipInfo) this.drawEdges(layer, sprite.name, x, y)
			return true
		} else {
			return false
		}
	}

	isFloorSafe(x, y) {
		let fx = (((x + 2) / Config.GROUND_TILE_W)|0) * Config.GROUND_TILE_W
		let fy = (((y + 2) / Config.GROUND_TILE_H)|0) * Config.GROUND_TILE_H
		let info = this.floorLayer.world[_key(fx, fy, 0)]
		return info && !info.unstableFloor
	}

	replace(sprite, name) {
		let layer = this._getLayer(sprite.name)
		layer.removeFromCurrentPos(sprite, true)
		this.set(name, sprite.gamePos[0], sprite.gamePos[1], sprite.gamePos[2])
	}

	drawEdges(layer, name, x, y) {
		if(layer == this.floorLayer) {
			let block = Config.BLOCKS[name]
			if(block.options && block.options.noEdge) {
				this.clearEdge(x, y)
			} else {
				for (let xx = -1; xx <= 1; xx++) {
					for (let yy = -1; yy <= 1; yy++) {
						this.drawGroundEdges(x + xx * Config.GROUND_TILE_W, y + yy * Config.GROUND_TILE_H, name)
					}
				}
			}
		}
	}

	drawGroundEdges(gx, gy, ground) {
		if(this.isInBounds(gx, gy)) {
			if (this.noEdge(gx, gy)) {
				this.clearEdge(gx, gy)
			} else {
				let n = this.noEdge(gx, gy - Config.GROUND_TILE_H)
				let s = this.noEdge(gx, gy + Config.GROUND_TILE_H)
				let w = this.noEdge(gx - Config.GROUND_TILE_W, gy)
				let e = this.noEdge(gx + Config.GROUND_TILE_W, gy)
				this.setEdge(gx, gy, ground, { n: n, s: s, e: e, w: w })
			}
		}
	}

	clearEdge(gx, gy) {
		this.clear("grass.edge1.n", gx, gy, 0)
	}

	setEdge(gx, gy, ground, edges) {
		this.clearEdge(gx, gy)

		for(let dir in EDGE_OFFSET) {
			if(edges[dir]) {
				let index = ground && ground.indexOf('water') >= 0 ? 3 : 1 + ((Math.random() * 2) | 0)
				this.set("grass.edge" + index + "." + dir, gx, gy, 0)
			}
		}
	}

	isStamp(name) {
		let block = Config.BLOCKS[name]
		return block.options && block.options["stamp"]
	}

	fixEdges() {
		this.edgeLayer.reset()
		for (let xx = 0; xx < this.w; xx += Config.GROUND_TILE_W) {
			for (let yy = 0; yy < this.h; yy += Config.GROUND_TILE_H) {
				this.drawGroundEdges(xx, yy, this.floorLayer.getFloorAt(xx, yy))
			}
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
		for(let layer of this.layers) layer.sort()
	}

	toScreenCoords(worldX, worldY, worldZ) {
		return [
			((worldX - worldY) * Config.GRID_SIZE + this.game.world.centerX),
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

	move(dx, dy) {
		for(let layer of this.layers) layer.move(dx, dy)
	}

	findFirstAround(image, names, range) {
		return this._getLayer(names[0]).findFirstAround(image, names, range)
	}

	save() {
		let data = JSON.stringify({
			version: Config.MAP_VERSION,
			name: this.name,
			width: this.w,
			height: this.h,
			layers: this.layers.map(layer => layer.save())
		})
		$.ajax({
			type: 'POST',
			url: "http://localhost:9090/cgi-bin/upload.py",
			data: "name=" + this.name + "&file=" + data,
			//success: ()=>{alert("Success!");},
			//error: (error)=>{console.log("Error:", error); alert("error: " + error);},
			dataType: "text/json"
		});
	}

	load(name, onLoad) {
		this.name = name
		$.ajax({
			url: "/assets/maps/" + this.name + ".json",
			dataType: "json",
			success: (data) => {
				this.newMap(this.name, data.width, data.height, "empty")
				for(let layerInfo of data.layers) {
					this.layersByName[layerInfo.name].load(layerInfo, this)
				}
				if(onLoad) onLoad()
			}
		})
	}
}
