import {MOVE_ATTACK} from "./Config"

export const MONSTERS = {
	goblin: {
		creature: "goblin",
		speed: 100,
		animationSpeed: 10,
		movement: MOVE_ATTACK,
		alive: {
			health: 10,
			strength: 2
		}
	},
	ogre: {
		creature: "ogre",
		speed: 80,
		animationSpeed: 10,
		movement: MOVE_ATTACK,
		alive: {
			health: 30,
			strength: 8
		}
	}
}
