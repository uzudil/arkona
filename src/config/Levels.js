import {MOVE_ANCHOR} from './Config'
import * as FARM_CONVO from '../convo/farm'

export const LEVELS = {
	farm: {
		map: "farm",
		startPos: [102, 28, 0],
		npcs: [
			{
				creature: 'woman_brown',
				x: 55, y: 66,
				options: {
					movement: MOVE_ANCHOR,
					name: "Sharya",
					convo: FARM_CONVO.CONVO.ref("sharya.start")
				},
			},
			{ creature: 'cow', x: 37, y: 97 },
			{ creature: 'cow', x: 42, y: 89 }
		],
		onLoad: function(arkona) {
			arkona.narrate("After many adventures, you successfully escaped from the agents of Kronos. " +
				"However, now you have crash landed on a strange planet and your ship is damaged. " +
				"How will you get back home? " +
				"Perhaps you should ask someone for help?")
		}
	}
}
