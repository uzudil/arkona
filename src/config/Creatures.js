const DEFAULT_DIRS = {
	walk: ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'],
	stand: ['se', 'e', 'ne', 'n', 'nw', 'w', 'sw', 's']
}

export const CREATURES = {
	cow: {
		src: 'assets/creatures/cow.png',
		dim: [64, 64],
		blockName: '4x4x4.placeholder',
		dirs: {
			walk: ['s', 'se', 'e', 'ne', 'n', 'nw', 'w', 'sw'],
			stand: ['sw', 's', 'se', 'e', 'ne', 'n', 'nw', 'w']
		},
		speed: 250
	},
	man: {
		src: 'assets/creatures/man.png',
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: DEFAULT_DIRS,
		speed: 200
	},
	monk: {
		src: 'assets/creatures/monk.png',
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: {
			walk: ['s', 'se', 'e', 'ne', 'n', 'nw', 'w', 'sw'],
			stand: ['s', 'se', 'e', 'ne', 'n', 'nw', 'w', 'sw']
		},
		speed: 200
	},
	woman: {
		src: 'assets/creatures/woman.png',
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: DEFAULT_DIRS,
		speed: 200
	},
	woman_brown: {
		src: 'assets/creatures/woman.brown.png',
		dim: [32, 64],
		blockName: "2x2x4.placeholder",
		dirs: DEFAULT_DIRS,
		speed: 200
	}
}
