/**
 * A fast but imprecise way to sort the blocks
 * Originally from: https://mazebert.com/2013/04/18/isometric-depth-sorting/
 */
export default class {
	spriteMovedTo(sprite, x, y, z) {
		sprite.isoDepth = x + y + 0.001 * z
	}

	// eslint-disable-next-line no-unused-vars
	prepareToSort(sprites) {
	}

	compareSprites(a, b) {
		return a.isoDepth > b.isoDepth ? 1 : (a.isoDepth < b.isoDepth ? -1 : 0);
	}
}
