import {MOVE_ANCHOR} from "./Config"
import {MONSTERS} from "./Monsters"
import * as FARM_CONVO from "../convo/farm"
import * as MEDIAN_CONVO from "../convo/median"
import * as ELDUN_CONVO from "../convo/eldun"
import * as ARCHIVES_CONVO from "../convo/archives"

export const LEVELS = {
	farm: {
		map: "farm",
		startPos: [102, 28, 0],
		npcs: [
			{
				creature: "woman_brown",
				x: 55, y: 66,
				options: {
					movement: MOVE_ANCHOR,
					name: "Sharya",
					convo: FARM_CONVO.SHARYA
				},
			},
			{ creature: "cow", x: 42, y: 97, options: { convo: FARM_CONVO.COW } },
			{ creature: "cow", x: 42, y: 89, options: { convo: FARM_CONVO.COW } }
		],
		onLoad: function(arkona) {
			if(!arkona.gameState["intro_seen"]) {
				arkona.gameState["intro_seen"] = true
				arkona.narrate("You have crash landed on a strange planet and your ship is damaged. " +
					"How will you get back home? " +
					"Perhaps you should ask someone for help?")
			}
		},
		connect: [
			{
				src: { dir: "w" },
				dst: { map: "woods", x: 219, y: 89 }
			},
            {
                src: { dir: "n" },
                dst: { map: "woods4", x: 84, y: 152 }
            }
		]

	},
	orc_cave: {
		map: "orc_cave",
		startPos: [62, 6, 0],
		startDir: "s",
		lamplight: true,
		connect: [
			{
				src: { x: 64, y: 1, z: 0 },
				dst: { map: "woods", x: 22, y: 100, dir: "e" }
			}
		],
		monsters: [
			{ monster: MONSTERS.goblin, pos: [ [28, 13], [26, 20], [9, 57], [15, 62], [54, 59], [58,49], [62, 37] ] },
			{ monster: MONSTERS.ogre, pos: [ [19, 8] ] },
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
			},
			{
				src: { x: 18, y: 105, z: 0 },
				dst: { map: "orc_cave", x: 62, y: 6, dir: "s" }
			}
		],
		generators: [
			{ x: 157, y: 99, z: 0, type: MONSTERS.goblin, count: 2 },
			{ x: 20, y: 85, z: 0, type: MONSTERS.goblin, count: 2 },
			{ x: 99, y: 84, z: 0, type: MONSTERS.goblin },
			{ x: 196, y: 48, z: 0, type: MONSTERS.goblin },
			{ x: 125, y: 23, z: 0, type: MONSTERS.goblin }
		],
		actions: [
			{
				type: "use_object", x: 90, y: 93, z: 0,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => arkona.showOverlay("sign", "To Median")
			},
			{
				type: "use_object", x: 89, y: 15, z: 0,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => arkona.showOverlay("sign", "To Eldun")
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
			{ creature: "monk", x: 50, y: 59, options: { movement: MOVE_ANCHOR, name: "Brother Aradun", convo: MEDIAN_CONVO.ARADUN } },
		],
		connect: [
			{
				src: { dir: "e" },
				dst: { map: "woods", x: 1, y: 37 }
			},
			{
				src: { x: 74, y: 8, z: 0 },
				dst: { map: "archives" },
				test: (arkona) => arkona.gameState["archives_open"]
			}
		],
		onLoad: function(arkona) {
			if(!arkona.gameState["median_visited"]) {
				arkona.gameState["median_visited"] = true
				arkona.narrate("In the distance you see crumbling stone huts surrounded by a few fruit trees and a small vegetable garden. " +
					"A robed figure in black paces back and forth in the court yard, his face lined with worry.")
			} else if(arkona.gameState["archives_open"]) {
				arkona.level.removeNpcByName(arkona, "Brother Xan")
				arkona.level.removeNpcByName(arkona, "Brother Fran")
				arkona.level.removeNpcByName(arkona, "Brother Smen")
			}
		},
		actions: [
			{
				type: "use_object", x: 65, y: 7, z: 0,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => arkona.showOverlay("sign", arkona.gameState["archives_open"] ? "The Archives" : "The Archives [Closed]")
			}
		]
	},
	archives: {
		map: "archives",
		startPos: [31, 6, 0],
		startDir: "s",
		connect: [
			{
				src: { x: 32, y: 1, z: 0 },
				dst: { map: "median", x: 66, y: 10, dir: "n" }
			}
		],
		npcs: [
			{ creature: "monk", x: 8, y: 16, options: { movement: MOVE_ANCHOR, name: "Brother Xan", convo: ARCHIVES_CONVO.XAN } },
			{ creature: "monk", x: 60, y: 8, options: { movement: MOVE_ANCHOR, name: "Brother Fran", convo: ARCHIVES_CONVO.FRAN } },
			{ creature: "monk", x: 65, y: 68, options: { movement: MOVE_ANCHOR, name: "Brother Smen", convo: ARCHIVES_CONVO.SMEN } }
		],
		actions: [
			{
				type: "use_object", x: 24, y: 66, z: 0,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => {
					if(!arkona.gameState["pazu_cell"]) {
						arkona.gameState["pazu_cell"] = true
						arkona.narrate("This room must have belonged to brother Pazu. " +
							"Crumpled papers are stacked high on a small desk. " +
							"A lone candelabra stands oddly placed at the center of the room; underneath ashes cover the floor.")
					}
				}
			},
			{
				type: "use_object", x: 2, y: 65, z: 0,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => {
					if(arkona.gameState["see_pazus_notes"]) {
						if(arkona.gameState["green_sky_stone"]) {
							arkona.narrate("You remember the weird green stone you found on these shelves.")
						} else {
							arkona.narrate("You thoroughly search the shelves. " +
								"Hidden behind a large book you find a strange green stone.")
							arkona.gameState["green_sky_stone"] = true
						}
					} else {
						arkona.narrate("You look through the books on the shelves but nothing catches your interest.")
					}
				}
			},
			{
				type: "use_object", x: 9, y: 59, z: 0,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => {
					if(arkona.gameState["see_pazus_notes"]) {
						arkona.gameState["urhaw_notes"] = true
						arkona.narrate("At first glance this chest contains only dirty laundry. " +
							"However after some delicate rifling, you find some hastily hidden notes." +
							"'The green sky stone found me, bless the Kada'. " +
							"'Through it I feel the Raighd speak the Illumis'. " +
							"'In the tower of Urhaw, pass the stone through the first gates'. " +
							"'Beware the grey race, fear will raise them from the Raighd'.")
					} else {
						arkona.narrate("This chest seems to contain Pazu's laundry.")
					}
				}
			}
		]
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
			},
			{
				src: { dir: "e" },
				dst: { map: "woods4", x: 4, y: 110 }
			}
		]
	},
	woods4: {
		map: "woods4",
		startPos: [4, 80, 0],
		connect: [
			{
				src: { dir: "s" },
				dst: { map: "farm", x: 70, y: 2 }
			},
			{
				src: { dir: "w" },
				dst: { map: "woods2", x: 123, y: 152 }
			},
			{
				src: { dir: "e" },
				dst: { map: "harbor", x: 2, y: 34 }
			}
		]
	},
	woods3: {
		map: "woods3",
		startPos: [4, 80, 0],
		connect: [
			{
				src: { dir: "s" },
				dst: { map: "eldun", x: 30, y: 2 }
			},
			{
				src: { dir: "n" },
				dst: { map: "voln", x: 80, y: 152 }
			}
		]
	},
	voln: {
		map: "voln",
		startPos: [4, 80, 0],
		connect: [
			{
				src: { dir: "s" },
				dst: { map: "woods3", x: 94, y: 2 }
			}
		],
        npcs: [
            { creature: "cow", x: 66, y: 91, options: { convo: FARM_CONVO.COW } }
        ],
	},
	harbor: {
		map: "harbor",
		startPos: [4, 80, 0],
		connect: [
			{
				src: { dir: "w" },
				dst: { map: "woods4", x: 155, y: 32 }
			}
		]
	},
	eldun: {
		map: "eldun",
		startPos: [94, 73, 0],
		connect: [
			{
				src: { dir: "s" },
				dst: { map: "woods2", x: 63, y: 0 }
			},
			{
				src: { dir: "n" },
				dst: { map: "woods3", x: 65, y: 152 }
			},
			{
				src: { x: 7, y: 84, z: 0 },
				dst: { map: "ravenous", x: 62, y: 9, dir: "s" }
			}
		],
		npcs: [
			{ creature: "man_blue", x: 80, y: 74, options: { movement: MOVE_ANCHOR, name: "Arton", convo: ELDUN_CONVO.ARTON } },
			{ creature: "woman", x: 92, y: 84, options: { movement: MOVE_ANCHOR, name: "Sara", convo: ELDUN_CONVO.SARA } },
			{ creature: "monk_red", x: 131, y: 51, z: 7, options: { movement: MOVE_ANCHOR, name: "Marisan of Eldun", convo: ELDUN_CONVO.MARISAN } },
		],
		actions: [
			{
				type: "use_object", x: 135, y: 57, z: 0, allow: (arkona) => arkona.gameState["marisan_key"] == true
			},
			{
				type: "use_object", x: 133, y: 53, z: 0,
				allow: (arkona) => arkona.gameState["marisan_key"] == true && arkona.gameState["marisan_purple_tome"] != true,
				action: (arkona) => {
					arkona.gameState["marisan_purple_tome"] = true
					arkona.narrate("You carefully inspect the books on this shelf. " +
						"After considering many, you pick a large purple tome with ornately gilded lettering. " +
						"You can't understand its text but hopefully Marisan can make sense of it.")
				}
			},
			{
				type: "use_object", x: 137, y: 62, z: 14,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => arkona.showOverlay("raighd")
			},
			{
				type: "use_object", x: 56, y: 57, z: 0,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => arkona.showOverlay("sign", "Eldun")
			},
			{
				type: "use_object", x: 9, y: 76, z: 0,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => arkona.showOverlay("sign", "Ravenous")
			},
			{
				type: "use_object", x: 25, y: 14, z: 0,
				// eslint-disable-next-line no-unused-vars
				allow: (arkona) => true,
				action: (arkona) => arkona.showOverlay("sign", "to Voln")
			},
		]
	},
	ravenous: {
		map: "ravenous",
		startPos: [62, 12, 0],
		startDir: "s",
		lamplight: true,
		connect: [
			{
				src: { x: 64, y: 5, z: 0 },
				dst: { map: "eldun", x: 11, y: 80, dir: "w" }
			}
		],
		onLoad: function(arkona) {
			if(!arkona.gameState["ravenous_visited"]) {
				arkona.gameState["ravenous_visited"] = true
				arkona.narrate("The air is cold and stale in this vast underground cave. " +
					"Oppressive claustrophobia threatens to overwhelm your senses. " +
					"Sounds of stone scraping on stone can be heard in the darkness.")
			}
		},
	},
	demo: {
		map: "demo",
		startPos: [31, 16, 0],
		connect: []
	}
}
