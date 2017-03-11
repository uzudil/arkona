import {dirsFrom} from "./Config"

export const CREATURES = {
	cow: {
		src: "assets/creatures/cow.png",
		dim: [64, 64],
		blockName: "4x4x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("s") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("sw") },
		],
		speed: 2.5
	},
	man: {
		src: "assets/creatures/man.png",
		dim: [64, 64],
		blockName: "2x2x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("e") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("se") },
			{ name: "attack", frameCount: 1, dirs: dirsFrom("e") },
		],
		speed: 2.0
	},
	goblin: {
		src: "assets/creatures/goblin.png",
		dim: [64, 64],
		blockName: "2x2x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("w") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("w") },
			{ name: "attack", frameCount: 2, dirs: dirsFrom("w") },
		],
		speed: 2.5
	},
	ogre: {
		src: "assets/creatures/ogre.png",
		dim: [96, 96],
		blockName: "4x4x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("w") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("w") },
			{ name: "attack", frameCount: 2, dirs: dirsFrom("w") },
		],
		speed: 2.5
	},
	man_blue: {
		src: "assets/creatures/man-blue.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("e") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("se") },
		],
		speed: 2.0
	},
	man_yellow: {
		src: "assets/creatures/man-yellow.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("e") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("se") },
		],
		speed: 2.0
	},
	monk: {
		src: "assets/creatures/monk.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("s") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("s") },
		],
		speed: 2.0
	},
	monk_blue: {
		src: "assets/creatures/monk-blue.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("s") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("s") },
		],
		speed: 2.0
	},
	monk_red: {
		src: "assets/creatures/monk-red.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("s") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("s") },
		],
		speed: 2.0
	},
	woman: {
		src: "assets/creatures/woman.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("e") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("se") },
		],
		speed: 2.0
	},
	woman_brown: {
		src: "assets/creatures/woman.brown.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		animations: [
			{ name: "walk", frameCount: 4, dirs: dirsFrom("e") },
			{ name: "stand", frameCount: 1, dirs: dirsFrom("se") },
		],
		speed: 2.0
	}
}
