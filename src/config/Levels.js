import {MOVE_ANCHOR} from './Config'

export const LEVELS = {
	farm: {
		map: "farm",
		startPos: [102, 28, 0],
		npcs: [
			{ creature: 'woman_brown', x: 55, y: 66, options: { movement: MOVE_ANCHOR } },
			{ creature: 'cow', x: 37, y: 97 },
			{ creature: 'cow', x: 42, y: 89 }
		]
	}
}
