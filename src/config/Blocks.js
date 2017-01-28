// don't chane the names
export const BLOCKS = {
	"trunk": { size: [2, 2, 4], pos: [0, 0], dim: [31, 48] },
	"trunk.wide": { size: [4, 4, 4], pos: [192, 384], dim: [64, 56] },
	"brown": { size: [4, 4, 3], pos: [32, 0], dim: [64, 48] },
	"oak": { size: [4, 4, 4], pos: [64, 64], dim: [64, 64] },
	"pine": { size: [4, 4, 4], pos: [128, 64], dim: [64, 64] },
	"dead": { size: [4, 4, 4], pos: [256, 384], dim: [64, 64] },

	// floors
	// blendLevels: 0=no blend, 1=blends into 0, 2=blends into 0 & 1
	"grass": { size: [4, 4, 0], pos: [96, 0], dim: [64, 64], options: { blendLevel: 0 } },
	"mud": { size: [4, 4, 0], pos: [96, 128], dim: [64, 64], options: { blendLevel: 1 } },
	"straw": { size: [4, 4, 0], pos: [0, 176], dim: [64, 64], options: { blendLevel: 0 }  },
	"sand": { size: [4, 4, 0], pos: [128, 192], dim: [64, 64], options: { blendLevel: 1 } },
	"moss": { size: [4, 4, 0], pos: [336, 128], dim: [64, 64], options: { blendLevel: 1 } },
	"bramble": { size: [4, 4, 0], pos: [336, 288], dim: [64, 64], options: { blendLevel: 1 } },
	"water": { size: [4, 4, 0], pos: [416, 128], dim: [64, 64], options: { blendLevel: 1, filter: "water" } },
	"road": { size: [4, 4, 0], pos: [368, 208], dim: [64, 64], options: { blendLevel: 1 } },
	"scree": { size: [4, 4, 0], pos: [448, 0], dim: [64, 64], options: { blendLevel: 1, sprites: 2 } },
	"lava": { size: [4, 4, 0], pos: [416, 192], dim: [64, 64], options: { blendLevel: 2, sprites: 2, filter: "lava"  } },
	"room.floor.stone": { size: [4, 4, 0], pos: [288, 208], dim: [64, 64], options: { blendLevel: 0 } },

	// edges
	"grass.edge1.w": { size: [2, 2, 0], pos: [176, 128], dim: [32, 32] },
	"grass.edge1.n": { size: [2, 2, 0], pos: [208, 128], dim: [32, 32] },
	"grass.edge1.e": { size: [2, 2, 0], pos: [208, 160], dim: [32, 32] },
	"grass.edge1.s": { size: [2, 2, 0], pos: [176, 160], dim: [32, 32] },
	"grass.edge2.w": { size: [2, 2, 0], pos: [256, 128], dim: [32, 32] },
	"grass.edge2.n": { size: [2, 2, 0], pos: [288, 128], dim: [32, 32] },
	"grass.edge2.e": { size: [2, 2, 0], pos: [288, 160], dim: [32, 32] },
	"grass.edge2.s": { size: [2, 2, 0], pos: [256, 160], dim: [32, 32] },
	"grass.edge3.w": { size: [2, 2, 0], pos: [208, 208], dim: [32, 32] },
	"grass.edge3.n": { size: [2, 2, 0], pos: [240, 208], dim: [32, 32] },
	"grass.edge3.e": { size: [2, 2, 0], pos: [240, 240], dim: [32, 32] },
	"grass.edge3.s": { size: [2, 2, 0], pos: [208, 240], dim: [32, 32] },
	"grass.edge.bank.w": { size: [2, 2, 0], pos: [336, 192], dim: [32, 42], options: { sprites: 2 } },
	"grass.edge.bank.n": { size: [2, 2, 0], pos: [368, 192], dim: [32, 42], options: { sprites: 2 } },
	"grass.edge.bank.s": { size: [2, 2, 0], pos: [336, 240], dim: [32, 32], options: { sprites: 2 } },
	"grass.edge.bank.e": { size: [2, 2, 0], pos: [368, 240], dim: [32, 32], options: { sprites: 2 } },
	"scree.edge.bank.w": { size: [2, 2, 0], pos: [256, 192], dim: [32, 42], options: { sprites: 2 } },
	"scree.edge.bank.n": { size: [2, 2, 0], pos: [288, 192], dim: [32, 42], options: { sprites: 2 } },
	"scree.edge.bank.s": { size: [2, 2, 0], pos: [256, 240], dim: [32, 32], options: { sprites: 2 } },
	"scree.edge.bank.e": { size: [2, 2, 0], pos: [288, 240], dim: [32, 32], options: { sprites: 2 } },

	// stamps
	"mud.puddle": { size: [2, 2, 0], pos: [64, 128], dim: [32, 32], options: { stamp: true } },
	"straw.stamp": { size: [4, 4, 0], pos: [64, 192], dim: [64, 64], options: { stamp: true }  },
	"ashes": { size: [2, 2, 0], pos: [128, 48], dim: [32, 32], options: { sprites: 2, stamp: true } },
	"ashes.big": { size: [4, 4, 0], pos: [130, 80], dim: [60, 64], options: { sprites: 2, tamp: true } },
	"blood.big": { size: [4, 4, 0], pos: [128, 192], dim: [64, 64], options: { sprites: 2, stamp: true } },
	"blood.small": { size: [4, 4, 0], pos: [128, 256], dim: [32, 32], options: { sprites: 2, stamp: true } },

	"wood.column": { size: [1, 1, 6], pos: [176, 0], dim: [16, 64] },
	"stone.wall.x": { size: [4, 1, 6], pos: [216, 0], dim: [40, 96] },
	"stone.wall.y": { size: [1, 4, 6], pos: [280, 0], dim: [40, 96] },
	"wood.wall.x": { size: [4, 1, 6], pos: [896, 0], dim: [40, 96] },
	"wood.wall.y": { size: [1, 4, 6], pos: [960, 0], dim: [40, 96] },

	// new doors
	"regular.door.x": { size: [1, 3, 6], pos: [192, 306], dim: [32, 80] },
	"regular.door.y": { size: [3, 1, 6], pos: [224, 306], dim: [32, 80] },

	"mountain1": { size: [4, 4, 8], pos: [0, 256], dim: [64, 96] },
	"mountain2": { size: [4, 4, 8], pos: [64, 256], dim: [64, 96] },
	"mountain3": { size: [4, 4, 4], pos: [128, 272], dim: [64, 64] },

	"corn": { size: [2, 2, 4], pos: [0, 384], dim: [32, 48] },
	"fence.ew": { size: [4, 1, 4], pos: [64, 384], dim: [40, 64] },
	"fence.ns": { size: [1, 4, 4], pos: [112, 384], dim: [40, 64] },

	// placeholder for creatures
	"2x2x4.placeholder": { size: [2, 2, 4], pos: [400, 0], dim: [32, 64] },
	"4x4x4.placeholder": { size: [4, 4, 4], pos: [400, 0], dim: [64, 64] },

	// arkona 2
	"chair.w": { size: [1, 1, 2], pos: [0, 0], dim: [16, 32], options: { sprites: 2 } },
	"chair.n": { size: [1, 1, 2], pos: [100, 0], dim: [16, 32], options: { sprites: 2 } },
	"bed.ns": { size: [3, 6, 2], pos: [32, 0], dim: [64, 72], options: { sprites: 2 } },
	"chest.ns": { size: [2, 2, 2], pos: [132, 0], dim: [20, 32], options: { sprites: 2 } },
	"chest.ew": { size: [2, 2, 2], pos: [156, 0], dim: [20, 32], options: { sprites: 2 } },
	"table": { size: [3, 2, 3], pos: [192, 0], dim: [48, 64], options: { sprites: 2 } },
	"straw-bale": { size: [2, 6, 2], pos: [0, 80], dim: [64, 64], options: { sprites: 2 } },
	"chimney.ns": { size: [3, 1, 10], pos: [96, 48], dim: [32, 104], options: { sprites: 2 } },
	"corpse": { size: [4, 4, 1], pos: [192, 192], dim: [56, 56], options: { sprites: 2 } },
	"pod": { size: [8, 8, 8], pos: [192, 64], dim: [96, 96], options: { sprites: 2 } },
	"well": { size: [5, 5, 6], pos: [312, 0], dim: [80, 112], options: { sprites: 2 } },
	"flowers.yellow.big": { size: [2, 2, 2], pos: [528, 0], dim: [36, 40], options: { sprites: 2 } },
	"flowers.yellow.small": { size: [1, 1, 2], pos: [576, 0], dim: [16, 20], options: { sprites: 2 } },
	"flowers.red.big": { size: [2, 2, 2], pos: [528, 48], dim: [36, 40], options: { sprites: 2 } },
	"flowers.red.small": { size: [1, 1, 2], pos: [576, 48], dim: [16, 20], options: { sprites: 2 } },
	"flowers.green.big": { size: [2, 2, 2], pos: [528, 96], dim: [36, 40], options: { sprites: 2 } },
	"flowers.green.small": { size: [1, 1, 2], pos: [576, 96], dim: [16, 20], options: { sprites: 2 } },
	"stalagmite.big": { size: [2, 2, 4], pos: [448, 64], dim: [32, 64], options: { sprites: 2 } },
	"stalagmite.small": { size: [1, 1, 3], pos: [496, 64], dim: [16, 40], options: { sprites: 2 } },

	// roofs
	"roof.ns": { size: [10, 10, 6], pos: [496, 0], dim: [164, 172] },
	"roof.ew": { size: [10, 10, 6], pos: [688, 0], dim: [164, 172] },
	"roof.ns.brown": { size: [10, 10, 3], pos: [448, 192], dim: [164, 164] },
	"roof.ew.brown": { size: [10, 10, 3], pos: [640, 192], dim: [176, 180] },
}
