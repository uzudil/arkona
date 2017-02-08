import {BLOCKS} from "../config/Blocks"

/*
 A (more) correct way of sorting isometric shapes, as described here:
 https://shaunlebron.github.io/IsometricBlocks/
 */
export default class {
	spriteMovedTo(sprite, x, y, z) {
		sprite.hexBounds = this._hexBounds(sprite, x, y, z)
		sprite.boxBounds = this._boxBounds(sprite, x, y, z)
		sprite.isoIndex = 0
	}

	// This is O(n^2)
	prepareToSort(sprites) {
		// figure out which sprite is behind which other one (ie. create dag)
		// let t = Date.now()
		let behind = this._createDAG(sprites)
		// let t2 = Date.now()

		// depth sort the dag
		let isoCount = 0
		let seen = {}
		for(let sprite of sprites) {
			this._visitSpritesBehind(behind, sprite, seen, (currentSprite) => {
				currentSprite.isoIndex = isoCount++
			})
		}
		// console.log("DAG: create=" + (t2 - t) + " visit=" + (Date.now() - t2) + " sprites=" + sprites.length)
	}

	_visitSpritesBehind(behind, sprite, seen, fx) {
		//console.log("VISIT: " + sprite.key)
		if(behind[sprite.key] && behind[sprite.key].length > 0) {
			for (let spriteBehind of behind[sprite.key]) {
				if (seen[spriteBehind.key] == null) {
					try {
						this._visitSpritesBehind(behind, spriteBehind, seen, fx)
					} catch(exc) {
						// sometimes we get a max stacksize error here
						console.error(exc)
					}
				}
			}
		}
		if(seen[sprite.key] == null) {
			seen[sprite.key] = true
			//console.log("ASSIGN: " + sprite.key)
			fx(sprite)
		}
	}

	/**
	 * Create the DAG. As an optimization, only store sprites that are currently
	 * visible. Since each step requires a resort, we can get away with this.
	 * @param sprites
	 * @returns a map of key->[list of sprites] where the value is a list of sprites "behind" the key
	 * @private
	 */
	_createDAG(sprites) {
		let behind = {}
		for(let a of sprites) {
			if(!a.renderable) continue
			for(let b of sprites) {
				if(!b.renderable) continue
				if(a != b) {
					if (this._doHexagonsOverlap(a.hexBounds, b.hexBounds) &&
						this._isBoxInBehind(a.boxBounds, b.boxBounds)) {
						if(behind[b.key] == null) {
							behind[b.key] = []
						}
						behind[b.key].push(a)
					}
				}
			}
		}
		return behind
	}

	compareSprites(a, b) {
		return a.isoIndex > b.isoIndex ? 1 : (a.isoIndex < b.isoIndex ? -1 : 0);
	}

	_isBoxInBehind(box1, box2) {

		// test for intersection x-axis
		// (lower x value is in front)
		if (box1.xmin >= box2.xmax) { return false; }
		else if (box2.xmin >= box1.xmax) { return true; }

		// test for intersection y-axis
		// (lower y value is in front)
		if (box1.ymin >= box2.ymax) { return false; }
		else if (box2.ymin >= box1.ymax) { return true; }

		// test for intersection z-axis
		// (higher z value is in front)
		if (box1.zmin >= box2.zmax) { return false; }
		else if (box2.zmin >= box1.zmax) { return true; }

	}

	_doHexagonsOverlap(hex1, hex2) {
		// Hexagons overlap if and only if all axis regions overlap.
		return (
			this._intersect(hex1.xmin, hex1.xmax, hex2.xmin, hex2.xmax) &&
			this._intersect(hex1.ymin, hex1.ymax, hex2.ymin, hex2.ymax) &&
			this._intersect(hex1.hmin, hex1.hmax, hex2.hmin, hex2.hmax)
		)
	}

	_intersect(min1, max1, min2, max2) {
		return (min1 < max2) && (min2 < max1)
	}

	_boxBounds(sprite, x, y, z) {
		let block = BLOCKS[sprite.name]
		return {
			xmin: x - block.size[0],
			xmax: x,
			ymin: y - block.size[1],
			ymax: y,
			zmin: z,
			zmax: z + block.size[2]
		}
	}

	_hexBounds(sprite, x, y, z) {
		let block = BLOCKS[sprite.name]
		return {
			xmin: this._spaceToIso(x - block.size[0], y, z + block.size[2]).x,
			xmax: this._spaceToIso(x, y, z).x,
			ymin: this._spaceToIso(x, y - block.size[1], z + block.size[2]).y,
			ymax: this._spaceToIso(x, y, z).y,
			hmin: this._spaceToIso(x - block.size[0], y, z).h,
			hmax: this._spaceToIso(x, y - block.size[1], z).h
		}
	}

	// Convert a 3D space position to a 2D isometric position.
	_spaceToIso(x, y, z) {

		// New XY position simply adds Z to X and Y.
		let isoX = x - z
		let isoY = y - z

		return {
			x: isoX,
			y: isoY,

			// Compute horizontal distance from origin.
			h: (isoX - isoY),

			// Compute vertical distance from origin.
			v: (isoX + isoY) / 2
		}
	}
}