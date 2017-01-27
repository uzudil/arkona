import Phaser from 'phaser'
import * as Config from '../config/Config'
import {BLOCKS} from '../config/Blocks'
import ImpreciseSort from './ImpreciseSort'
import DAGSort from './DAGSort'
import $ from 'jquery'
import * as Filters from './Filters'

function getBlendLevel(block) {
	return block && block.options && block.options["blendLevel"] ? block.options["blendLevel"] : Config.NO_BLEND
}

function _key(x, y, z) {
	return x + "." + y + "." + z
}

function _visit(name, worldX, worldY, fx) {
	let block = BLOCKS[name]
	for(let xx = worldX - block.size[0]; xx < worldX; xx++) {
		for (let yy = worldY - block.size[1]; yy < worldY; yy++) {
			fx(xx, yy)
		}
	}
}

function _visit3(name, worldX, worldY, worldZ, fx) {
	let block = BLOCKS[name]
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
	return BLOCKS[name].size[2] == 0
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
	constructor(game, parentGroup, name, sorted, sortingStrategy) {
		this.game = game
		this.name = name
		this.sorted = sorted
		this.sortingStrategy = sortingStrategy || new ImpreciseSort()

		this.filterGroup = game.add.group(parentGroup)
		this.group = game.add.group(parentGroup)
		this.infos = {} // 3d space
		this.world = {} // origin space
	}

	destroy() {
		this.infos = {} // 3d space
		this.world = {} // origin space
		for(let c of this.filterGroup.children) {
			c.destroy()
		}
		for(let c of this.group.children) {
			c.destroy()
		}
	}

	reset() {
		this.infos = {}
		this.world = {}
		while(this.filterGroup.children.length > 0) this.filterGroup.children[0].destroy()
		while(this.group.children.length > 0) this.group.children[0].destroy()
	}

	hasImage(name, x, y) {
		let key = _key(x, y, 0)
		let info = this.world[key]
		return info && info.imageInfos.find(i => i.name == name)
	}

	getBlendLevel(x, y) {
		let key = _key(x, y, 0)
		let info = this.world[key]
		return info && info.imageInfos && info.imageInfos.length > 0
			? getBlendLevel(BLOCKS[info.imageInfos[0].name])
			: Config.NO_BLEND
	}

	getGroup(name) {
		let block = BLOCKS[name]
		return block.options && block.options.filter ? this.filterGroup : this.group
	}

	set(name, x, y, z, sprite, skipInfo) {
		this.getGroup(name).add(sprite) // ok to do even if already in group
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

		let block = BLOCKS[name]
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
		if(!info) info = this.world[key]
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

		let block = BLOCKS[name]
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

			let block = BLOCKS[image.name]
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
			this.sortingStrategy.prepareToSort(this.group.children)
			this.group.customSort(this.sortingStrategy.compareSprites)
		}
	}

	move(dx, dy) {
		this.filterGroup.x += dx
		this.filterGroup.y += dy
		this.group.x += dx
		this.group.y += dy
	}

	moveTo(x, y) {
		this.filterGroup.x = x
		this.filterGroup.y = y
		this.group.x = x
		this.group.y = y
	}

	findClosest(image, range, fx) {
		let found = false
		// todo: instead of -2, it should be -width/2
		_visit3d(image.gamePos[0] - 2 + (range/2)|0, image.gamePos[1] - 2 + (range/2)|0, image.gamePos[2], range, range, range, (xx, yy, zz) => {
			let info = this.infos[_key(xx, yy, zz)]
			if (info && info.imageInfos) {
				let imageInfo = info.imageInfos.find(ii => fx(ii.image))
				if (imageInfo) {
					found = imageInfo.image
					return false
				}
			}
			return true
		})
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
 */
export default class {

	constructor(game, editorMode) {
		this.game = game
		this.group = game.add.group()
		this.zoom = editorMode ? 1 : Config.GAME_ZOOM
		this.group.scale.set(this.zoom)
		this.floorLayer = new Layer(game, this.group, "floor")
		this.edgeLayer = new Layer(game, this.group, "edge")
		this.stampLayer = new Layer(game, this.group, "stamp")
		this.objectLayer = new Layer(game, this.group, "object", true, new DAGSort())
		this.roofLayer = new Layer(game, this.group, "roof", true)
		this.layers = [
			this.floorLayer, this.edgeLayer, this.stampLayer, this.objectLayer, this.roofLayer
		]
		this.layersByName = {}
		for(let layer of this.layers) this.layersByName[layer.name] = layer

		Filters.create(game)

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

	getBlendLevel(x, y) {
		return this.isInBounds(x, y) ? this.floorLayer.getBlendLevel(x, y) : Config.NO_BLEND
	}

	toggleRoof() {
		this.roofLayer.group.visible = !this.roofLayer.group.visible
	}

	getFloor(x, y) {
		return this.isInBounds(x, y) ? this.floorLayer.getFloorAt(x, y) : null
	}

	checkRoof(worldX, worldY) {
		let under = this.roofLayer.infos[_key(worldX, worldY, 6)] != null
		if(under == this.roofLayer.group.visible) this.toggleRoof()
	}

	_getLayer(name) {
		let block = BLOCKS[name]
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
				if(layer != this.floorLayer) layer.clearAll(x, y, z)
			}
		}
	}

	// todo: figure out zoom from game.scale
	centerOn(image) {
		let [ screenX, screenY ] = this.toScreenCoords(image.gamePos[0], image.gamePos[1], image.gamePos[2])
		screenX = -(screenX - Config.WIDTH / this.zoom / 2)
		screenY = -(screenY - Config.HEIGHT / this.zoom / 2)
		for(let layer of this.layers) layer.moveTo(screenX, screenY)
	}

	_getSprites(name) {
		let b = BLOCKS[name]
		return b.options == null || b.options["sprites"] == null ? "sprites" : "sprites" + b.options.sprites
	}

	set(name, rx, ry, rz, skipInfo, loaderFx) {
		let [layer, x, y, z, offsX, offsY] = this._getLayerAndXYZ(name, rx, ry, rz)

		let screenX, screenY
		[ screenX, screenY ] = this.toScreenCoords(x + offsX, y + offsY, z)

		let block = BLOCKS[name]

		let sprite
		if(loaderFx) {
			sprite = loaderFx(screenX, screenY)
		} else {
			sprite = this.game.add.image(screenX, screenY, this._getSprites(name), name, layer.getGroup(name))
			if(block.options && block.options.filter && Filters.FILTERS[block.options.filter]) {
				sprite.texture.isTiling = true
				sprite.filters = [ Filters.FILTERS[block.options.filter] ]
			}
		}

		let size = block.size

		this._saveInSprite(sprite, name, x, y, z)
		layer.sortingStrategy.spriteMovedTo(sprite, x, y, z)

		let baseHeight = size[1] * Config.GRID_SIZE
		let anchorX = 1 - baseHeight / sprite.texture.width
		sprite.anchor.setTo(anchorX, 1)

		if(Config.DEBUG_BLOCKS && layer == this.objectLayer) {
			let gfx = this.game.add.graphics(screenX + block.dim[0] * anchorX, screenY - block.dim[1], layer.group)
			gfx.lineStyle(1, 0xffffff, 1)
			gfx.drawRect(0, 0, block.dim[0], block.dim[1])
			sprite.debugGraphics = gfx
		} else {
			sprite.debugGraphics = null
		}

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
			layer.sortingStrategy.spriteMovedTo(sprite, x, y, z)

			sprite.x = screenX
			sprite.y = screenY

			if(sprite.debugGraphics) {
				sprite.debugGraphics.x = screenX
				sprite.debugGraphics.y = screenY
			}

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
			let block = BLOCKS[name]
			if(getBlendLevel(block) == Config.NO_BLEND) {
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
			let blendLevel = this.getBlendLevel(gx, gy)
			if (blendLevel == Config.NO_BLEND) {
				this.clearEdge(gx, gy)
			} else {
				let n = blendLevel > this.getBlendLevel(gx, gy - Config.GROUND_TILE_H)
				let s = blendLevel > this.getBlendLevel(gx, gy + Config.GROUND_TILE_H)
				let w = blendLevel > this.getBlendLevel(gx - Config.GROUND_TILE_W, gy)
				let e = blendLevel > this.getBlendLevel(gx + Config.GROUND_TILE_W, gy)
				this.setEdge(gx, gy, { n: n, s: s, e: e, w: w })
			}
		}
	}

	clearEdge(gx, gy) {
		this.clear("grass.edge1.n", gx, gy, 0)
	}

	setEdge(gx, gy, edges) {
		this.clearEdge(gx, gy)

		let ground = this.getFloor(gx, gy)
		for(let dir in EDGE_OFFSET) {
			if(edges[dir]) {
				let name
				if(ground && ground.indexOf("lava") >= 0) {
					name = "scree.edge.bank"
				} else if(ground && ground.indexOf("water") >= 0) {
					name = "grass.edge.bank"
				} else {
					let index = 1 + ((Math.random() * 2) | 0)
					name = "grass.edge" + index
				}
				this.set(name + "." + dir, gx, gy, 0)
			}
		}
	}

	isStamp(name) {
		let block = BLOCKS[name]
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
		sprite.key = _key(x, y, z)
		sprite.gamePos = [x, y, z]
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

	findClosestObject(image, range, fx) {
		return this.objectLayer.findClosest(image, range, fx)
	}

	destroy() {
		for(let layer of this.layers) layer.destroy()
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

	update() {
		Filters.update()
	}
}
