const DIRS = ["e", "ne", "n", "nw", "w", "sw", "s", "se"]

function dirsFrom(startDir) {
	let idx = DIRS.indexOf(startDir)
	let dirs = []
	for(let i = 0; i < DIRS.length; i++) {
		dirs.push(DIRS[idx])
		idx++
		if(idx >= DIRS.length) idx = 0
	}
	return dirs
}

export const CREATURES = {
	cow: {
		src: "assets/creatures/cow.png",
		dim: [64, 64],
		blockName: "4x4x4.placeholder",
		dirs: {
			walk: dirsFrom("s"),
			stand: dirsFrom("sw")
		},
		speed: 2.5
	},
	man: {
		src: "assets/creatures/man.png",
		dim: [64, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: dirsFrom("e"),
			stand: dirsFrom("se"),
			attack: dirsFrom("e")
		},
		frameCounts: {
			attack: 1
		},
		speed: 2.0
	},
	goblin: {
		src: "assets/creatures/goblin.png",
		dim: [64, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: dirsFrom("w"),
			stand: dirsFrom("w"),
			attack: dirsFrom("w")
		},
		speed: 2.5
	},
	man_blue: {
		src: "assets/creatures/man-blue.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: dirsFrom("e"),
			stand: dirsFrom("se")
		},
		speed: 2.0
	},
	man_yellow: {
		src: "assets/creatures/man-yellow.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: dirsFrom("e"),
			stand: dirsFrom("se")
		},
		speed: 2.0
	},
	monk: {
		src: "assets/creatures/monk.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: dirsFrom("e"),
			stand: dirsFrom("s")
		},
		speed: 2.0
	},
	monk_blue: {
		src: "assets/creatures/monk-blue.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: dirsFrom("e"),
			stand: dirsFrom("s")
		},
		speed: 2.0
	},
	monk_red: {
		src: "assets/creatures/monk-red.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: dirsFrom("e"),
			stand: dirsFrom("s")
		},
		speed: 2.0
	},
	woman: {
		src: "assets/creatures/woman.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: dirsFrom("e"),
			stand: dirsFrom("se")
		},
		speed: 2.0
	},
	woman_brown: {
		src: "assets/creatures/woman.brown.png",
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: dirsFrom("e"),
			stand: dirsFrom("se")
		},
		speed: 2.0
	}
}
