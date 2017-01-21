import {MOVE_ANCHOR} from './Config'
import * as FARM_CONVO from '../convo/farm'
import * as MEDIAN_CONVO from '../convo/median'

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
					convo: FARM_CONVO.SHARYA
				},
			},
			{ creature: 'cow', x: 37, y: 97, options: { convo: FARM_CONVO.COW } },
			{ creature: 'cow', x: 42, y: 89, options: { convo: FARM_CONVO.COW } }
		],
		onLoad: function(arkona) {
			if(!arkona.gameState["intro_seen"]) {
				arkona.gameState["intro_seen"] = true
				arkona.narrate("After many adventures, you successfully escaped from the agents of Kronos. " +
					"However, now you have crash landed on a strange planet and your ship is damaged. " +
					"How will you get back home? " +
					"Perhaps you should ask someone for help?")
			}
		},
		connect: [
			{
				src: { dir: "w" },
				dst: { map: "woods", x: 219, y: 89 }
			}
		]

	},
	woods: {
		map: "woods",
		startPos: [1, 37, 0],
		connect: [
			{
				src: { dir: "e" },
				dst: { map: "farm", x: 4, y: 20 }
			},
			{
				src: { dir: "w" },
				dst: { map: "median", x: 72, y: 66 }
			},
			{
				src: { dir: "n" },
				dst: { map: "woods2", x: 52, y: 194 }
			}
		]

	},
	median: {
		map: "median",
		startPos: [72, 66, 0],
		npcs: [
			{ creature: "monk", x: 9, y: 7, options: { movement: MOVE_ANCHOR, name: "Brother Xan", convo: MEDIAN_CONVO.XAN } },
			{ creature: "monk", x: 31, y: 5, options: { movement: MOVE_ANCHOR, name: "Brother Fran", convo: MEDIAN_CONVO.FRAN } },
			{ creature: "monk", x: 45, y: 26, options: { movement: MOVE_ANCHOR, name: "Brother Smen", convo: MEDIAN_CONVO.SMEN } },
			{ creature: "monk", x: 52, y: 65, options: { movement: MOVE_ANCHOR, name: "Brother Aradun", convo: MEDIAN_CONVO.ARADUN } },
		],
		connect: [
			{
				src: { dir: "e" },
				dst: { map: "woods", x: 1, y: 37 }
			}
		],
		onLoad: function(arkona) {
			if(!arkona.gameState["median_visited"]) {
				arkona.gameState["median_visited"] = true
				arkona.narrate("In the distance you see crumbling stone huts surrounded by a few fruit trees and a small vegetable garden. " +
					"A robed figure in black paces back and forth in the court yard, his face lined with worry.")
			}
		},
	},
	woods2: {
		map: "woods2",
		startPos: [52, 194, 0],
		connect: [
			{
				src: { dir: "s" },
				dst: { map: "woods", x: 92, y: 1 }
			},
			{
				src: { dir: "n" },
				dst: { map: "eldun", x: 135, y: 155 }
			}
		]
	},
	eldun: {
		map: "eldun",
		startPos: [135, 155, 0],
		connect: [
			{
				src: { dir: "s" },
				dst: { map: "woods2", x: 63, y: 0 }
			}
		]
	}
}
