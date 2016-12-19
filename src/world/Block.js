import Phaser from 'phaser'
import * as Config from '../config/Config'
import $ from 'jquery'

class BlockInfo {
	constructor() {
		this.clear()
	}

	set(x, y, z, sprite, name, objects) {
		this.x = x
		this.y = y
		this.z = z
		this.sprite = sprite
		this.name = name
		this.objects = objects
	}

	clear() {
		this.x = this.y = this.z = 0
		this.sprite = null
		this.name = null
		this.objects = []
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
		this.group = game.add.group()
		this.floor = game.add.group()

		this.game.world.bringToTop(this.group)
	}

	newMap(name, w, h) {
		this.name = name
		this.w = w
		this.h = h

		this.infos = {}
		this.world = {}
		while(this.group.children.length > 0) this.group.children[0].destroy()
		while(this.floor.children.length > 0) this.floor.children[0].destroy()

		for(let x = 0; x < w; x += 4) {
			for(let y = 0; y < h; y += 4) {
				this.addFloor('grass', x, y)
			}
		}
	}

	addFloor(name, x, y) {
		let screenX, screenY
		[ screenX, screenY ] = this.toScreenCoordsFloor(x, y)

		let sprite = this.game.add.sprite(screenX, screenY, 'sprites', name)
		sprite.gamePos = [x, y, 0]

		this.floor.add(sprite)
		sprite.anchor.setTo(0.5, 1)

		// save coord data
		this._saveCoordData(name, x, y, 0)

		return sprite
	}

	addSprite(name, x, y, z, skipInfo) {
		let screenX, screenY
		[ screenX, screenY ] = this.toScreenCoords(x, y, z)

		let sprite = this.game.add.sprite(screenX, screenY, 'sprites', name)
		this.group.add(sprite)

		this._saveInSprite(sprite, name, x, y, z)

		let size = Config.BLOCKS[name].size
		let baseHeight = size[1] * Config.GRID_SIZE
		sprite.anchor.setTo(1 - baseHeight / sprite._frame.width, 1)

		if(!skipInfo) {
			this.updateInfo(name, x, y, z, sprite)
		}

		return sprite
	}

	_saveInSprite(sprite, name, x, y, z) {
		// set some calculated values
		if(name) sprite.name = name
		sprite.gamePos = [x, y, z]
		sprite.isoDepth = x + y + 0.001 * z
	}

	removeSprite(sprite) {
		this.clearInfo(sprite.name, sprite.gamePos[0], sprite.gamePos[1], sprite.gamePos[2])
	}

	setSprite(sprite, x, y, z, skipInfo) {
		// move to new position
		let screenX, screenY
		[ screenX, screenY ] = this.toScreenCoords(x, y, z)

		this._saveInSprite(sprite, null, x, y, z)

		sprite.x = screenX
		sprite.y = screenY

		if(!skipInfo) {
			this.updateInfo(sprite.name, x, y, z, sprite)
		}
	}

	clearInfo(name, x, y, z) {
		// delete block data
		this._visit3(name, x, y, z, (xx, yy, zz) => {
			let key = this._key(xx, yy, zz)
			let info = this.infos[key]
			if(info) {
				delete this.infos[key]
			}
		})

		// delete coord. data
		let key = this._key(x, y, 0)
		let info = this.world[key]
		if(info) {
			let n = info.indexOf(name)
			if(n >= 0) info.splice(n, 1)
		}
	}

	updateInfo(name, x, y, z, sprite) {
		// save block data
		this._visit3(name, x, y, z, (xx, yy, zz) => {
			let key = this._key(xx, yy, zz)
			let info = this.infos[key]
			if(info == null) {
				info = new BlockInfo()
				this.infos[key] = info
			}
			info.set(x, y, z, sprite, name, [])
		})

		// save in coordinate map
		this._saveCoordData(name, x, y, z)
	}

	_saveCoordData(name, x, y, z) {
		let key = this._key(x, y, z)
		let info = this.world[key]
		if(!info) {
			info = []
			this.world[key] = info
		}
		info.push(name)
	}

	debugSprite(sprite) {
		this._visit3(sprite.name, sprite.gamePos[0], sprite.gamePos[1], sprite.gamePos[2], (xx, yy, zz) => {
			let key = this._key(xx, yy, zz)
			let info = this.infos[key]
			console.log(key + ": ", info)
		})
	}

	_key(x, y, z) {
		return x + "." + y + "." + z
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
		if(sprite && !this.isFlat(sprite)) {
			this._visit(sprite.name, worldX, worldY, (xx, yy) => {
				for (let z = 15; z >= 0; z--) {
					let info = this.infos[this._key(xx, yy, z)]
					if (info) {
						if (z + 1 > maxZ) maxZ = z + 1
						break
					}
				}
			})
		}
		return maxZ
	}

	isFlat(sprite) {
		return sprite && this.isFlatByName(sprite.name)
	}

	isFlatByName(name) {
		return Config.BLOCKS[name].size[2] == 0
	}

	_visit(name, worldX, worldY, fx) {
		let block = Config.BLOCKS[name]
		for(let xx = worldX - block.size[0]; xx < worldX; xx++) {
			for (let yy = worldY - block.size[1]; yy < worldY; yy++) {
				fx(xx, yy)
			}
		}
	}

	_visit3(name, worldX, worldY, worldZ, fx) {
		let block = Config.BLOCKS[name]
		this._visit(name, worldX, worldY, (xx, yy) => {
			for (let zz = worldZ; zz < worldZ + block.size[2]; zz++) {
				fx(xx, yy, zz)
			}
		})
	}

	addTree(name, x, y, z) {
		this.addSprite("trunk", x, y, z)
		this.addSprite(name, x, y, z + Config.BLOCKS["trunk"].size[2])
	}

	sort() {
		// from: https://mazebert.com/2013/04/18/isometric-depth-sorting/
		this.group.customSort((a, b) => {
			return a.isoDepth > b.isoDepth ? 1 : (a.isoDepth < b.isoDepth ? -1 : 0);
		})
	}

	toScreenCoords(worldX, worldY, worldZ) {
		return [
			(worldX - worldY) * Config.GRID_SIZE + this.game.world.centerX,
			((worldY + worldX - worldZ) + 10) * Config.GRID_SIZE
		]
	}

	toWorldCoords(screenX, screenY) {
		let sx = (screenX - this.game.world.centerX - this.floor.x) / Config.GRID_SIZE
		let sy = (screenY - this.floor.y) / Config.GRID_SIZE
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
		this.floor.x += dx
		this.floor.y += dy
		this.group.x += dx
		this.group.y += dy
	}

	save() {
		return JSON.stringify({
			version: Config.MAP_VERSION,
			name: this.name,
			width: this.w,
			height: this.h,
			world: this.world
		})
	}

	load() {
		$.ajax({
			url: "/assets/maps/" + this.name + ".json",
			dataType: "json",
			success: (data) => {
				this.newMap(this.name, data.width, data.height)
				for(let key in data.world) {
					let [x, y, z] = key.split(".").map(s => parseInt(s, 10))
					for(let name of data.world[key]) {
						if(this.isFlatByName(name)) {
							this.addFloor(name, x, y)
						} else {
							this.addSprite(name, x, y, z)
						}
					}
				}
			}
		})
	}
}
