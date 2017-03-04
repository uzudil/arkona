import Phaser from "phaser"
import * as Config from "../config/Config"
import Transition from "../ui/Transition"

const STAR_COUNT = 200
const TEXT = [
	"Our story begins in space...",

	"After the last incident on Targ, your next mission was\n" +
	"supposed to be quick and lucrative.\n\n" +
	"But mercenary missions rarely play out without complications...",

	"You did find the Alteran Disruptor - the object of your quest.\n" +
	"However, with it you also managed to acquire the unyielding wrath\n" +
	"of the agents of Kronos.",

	"The Disruptor doesn't exactly come with a user's manual.\n\n" +
	"The only thing you seem to remember about it is that the\n" +
	"part-machine, part-organic device can 'learn'...",

	"After a near career- and life-ending battle you leave the\n" +
	"ruins of your ship.\n\n" +
	"Strapping the disruptor on your arm, you point your landing\n" +
	"craft at the nearest inhabited planet...",
]

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = "#000000"
	}

	preload() {

	}

	create() {
		this.stars = []
		this.transition = new Transition()
		this.stateIndex = 0

		for (let i = 0; i < STAR_COUNT; i++) {
			let star = this.game.add.graphics(Math.random() * Config.WIDTH, Math.random() * Config.HEIGHT)
			star.beginFill(0xccccaa)
			star.drawRect(0, 0, 2, 2)
			star.endFill()
			star.speed = Math.random() * 3
			star.scale.set(3 - star.speed, 3 - star.speed)
			this.stars.push(star)
		}

		this.text = this.game.add.text(Config.WIDTH/2, Config.HEIGHT/2, this.getText(),
			{font: "bold 24px " + Config.FONT_FAMILY, fill: "#ff8", boundsAlignH: "left", boundsAlignV: "top"})
		this.text.anchor.set(0.5, 0.5)

		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		this.esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
		this.transition.fadeOut()
	}

	render() {
		this.stars.forEach(star => {
			star.x -= this.game.time.elapsedMS / (60 * 0.1 * star.speed)
			if(star.x < -10) {
				star.x = Config.WIDTH + 10
				star.speed = Math.random() * 3
				star.scale.set(3 - star.speed, 3 - star.speed)
			}
		})
	}

	update() {
		if (this.space.justDown) {
			this.stateIndex++
			if (this.stateIndex >= TEXT.length) {
				this.startGame()
			} else {
				this.text.text = this.getText()
			}
		} else if (this.esc.justDown) {
			this.startGame()
		}
	}

	getText() {
		return TEXT[this.stateIndex]
	}

	startGame() {
		this.transition.fadeIn(() => this.state.start("Arkona"))
	}
}
