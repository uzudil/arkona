import * as Config from "../config/Config"

export default class {
	constructor(arkona) {
		this.group = arkona.game.add.group()

		this.narratorTextBackground = arkona.game.add.graphics(0, 0, this.group)
		this.narratorTextBackground.beginFill(0x000000)
		this.narratorTextBackground.drawRect(0, 0, Config.WIDTH, Config.NARRATE_HEIGHT)
		this.narratorTextBackground.endFill()

		var style = {
			font: "bold 32px " + Config.FONT_FAMILY_NAME,
			fill: "#ccc",
			boundsAlignH: "left",
			boundsAlignV: "top",
			wordWrap: true,
			wordWrapWidth: Config.WIDTH
		}
		this.narratorMessage = arkona.game.add.text(5, 5, "Pos: ", style, this.group)
		this.narratorMessage.setShadow(1, 1, "rgba(0,0,0,1)", 2)
		this.narratorMessage.setTextBounds(5, 5, Config.WIDTH - 10, Config.NARRATE_HEIGHT - 10)

		this.group.visible = false
	}

	showFirstLine(message) {
		this.sentences = this.getSentences(message)
		this.sentenceIndex = 0
		this.showCurrentSentence()
		this.group.visible = true
	}

	showNextLine() {
		this.sentenceIndex++
		if(this.sentenceIndex >= this.sentences.length) {
			this.group.visible = false
		} else {
			this.showCurrentSentence()
		}
	}

	showCurrentSentence() {
		this.narratorMessage.text = this.sentences[this.sentenceIndex] + " <SPACE>"
	}

	getSentences(message) {
		let s = message.match( /[^\.!\?]+[\.!\?]+/g )
		return s ? s : [message]
	}
}