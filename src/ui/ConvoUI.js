import * as Config from "../config/Config"

export default class {
	constructor(arkona) {
		this.arkona = arkona
		this.group = arkona.game.add.group()
		this.group.x = 0
		this.group.y = Config.HEIGHT - Config.CONVO_HEIGHT

		this.background = arkona.game.add.graphics(0, 0, this.group)
		this.background.beginFill(0x000000)
		this.background.drawRect(0, 0, Config.WIDTH, Config.CONVO_HEIGHT)
		this.background.endFill()
		this.background.lineStyle(1, 0x883311, 1);
		this.background.moveTo(0, 0)
		this.background.lineTo(Config.WIDTH, 0)

		this.npcStyle = {
			font: "bold 24px " + Config.ARKONA_FONT_FAMILY_NAME,
			fill: "#ccc",
			boundsAlignH: "left",
			boundsAlignV: "top",
			wordWrap: true,
			wordWrapWidth: Config.WIDTH
		}
		this.npcMessage = arkona.game.add.text(5, 40, "Pos: ", this.npcStyle, this.group)
		this.npcMessage.setShadow(1, 1, "rgba(0,0,0,1)", 2)
		this.npcMessage.setTextBounds(5, 5, Config.WIDTH - 10, Config.CONVO_HEIGHT - 10)

		this.pcStyle = {
			font: "bold 20px " + Config.FONT_FAMILY_NAME,
			fill: "#ccc",
			boundsAlignH: "left",
			boundsAlignV: "top",
			wordWrap: true,
			wordWrapWidth: Config.WIDTH
		}
		this.pcStyleActive = {
			font: "bold 24px " + Config.FONT_FAMILY_NAME,
			fill: "#ff4",
			boundsAlignH: "left",
			boundsAlignV: "top",
			wordWrap: true,
			wordWrapWidth: Config.WIDTH
		}
		this.pcAnswer = []
		for(let i = 0; i < 5; i++) {
			let m = arkona.game.add.text(15, 5, "Pos: ", this.pcStyle, this.group)
			m.setShadow(1, 1, "rgba(0,0,0,1)", 2)
			m.setTextBounds(15, 5, Config.WIDTH - 20, Config.CONVO_HEIGHT - 10)
			m.visible = false
			this.pcAnswer.push(m)
		}

		this.npcName = arkona.game.add.text(5, 0, "", {
			font: "bold 20px " + Config.FONT_FAMILY_NAME,
			fill: "#831",
			boundsAlignH: "left",
			boundsAlignV: "top",
			wordWrap: true,
			wordWrapWidth: Config.WIDTH
		}, this.group)
		this.npcName.setShadow(1, 1, "rgba(0,0,0,1)", 2)
		this.npcName.setTextBounds(5, 5, Config.WIDTH - 10, Config.CONVO_HEIGHT - 10)

		this.group.visible = false
	}

	start(npc) {
		this.npcName.text = npc.getName() + ":"
		this.show(npc.options.convo)
	}

	show(convo) {
		if(convo == null || !convo.isComplete()) this.end()
		else {
			this.convo = convo.eval(this.arkona)
			this.activeIndex = 0
			this.npcMessage.text = this.convo.getQuestion(this.arkona)
			for(let a of this.pcAnswer) a.visible = false
			let y = 125
			let index = 0
			for (let i = 0; i < this.convo.answers.length; i++) {
				if(this.convo.answers[i].eval(this.arkona)) {
					this.pcAnswer[index].text = " " + this.convo.answers[i].answer
					this.pcAnswer[index].visible = true
					this.pcAnswer[index].y = y
					this.pcAnswer[index].answerIndex = i
					y += 30
					index++
				}
			}
			this.answerCount = index
			this.showActiveAnswer()
			this.group.visible = true
		}
	}

	change(dy) {
		this.activeIndex += dy
		if(this.activeIndex < 0) this.activeIndex = this.answerCount - 1
		else if(this.activeIndex >= this.answerCount) this.activeIndex = 0
		this.showActiveAnswer()
	}

	select() {
		this.show(this.convo.answers[this.pcAnswer[this.activeIndex].answerIndex].getResult())
	}

	showActiveAnswer() {
		for(let i = 0; i < this.answerCount; i++) {
			this.pcAnswer[i].setStyle(i == this.activeIndex ? this.pcStyleActive : this.pcStyle)
		}
	}

	end() {
		for(let a of this.pcAnswer) a.visible = false
		this.group.visible = false
	}
}