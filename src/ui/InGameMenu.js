import $ from "jquery"

export default class {
	constructor(arkona) {
		this.arkona = arkona
		this.elShadow = $("#overlay-shadow")
		this.el = $("#in-game-menu")
		$("#save-game").click(() => {
			arkona.saveGame()
			this.hide()
		})
		$("#load-game").click(() => {
			if(confirm("Abandon current game?")) {
				this.hide()
				this.arkona.transition.fadeIn(() => {
					arkona.loadGame(true)
				})
			}
		})
		$("#resume-game").click(() => this.hide())
		$("#quit-game").click(() => {
			if(confirm("Quite game. Are you sure?")) location.reload()
		})
	}

	show() {
		this.elShadow.show()
		this.el.show()
		this.visible = true
	}

	hide() {
		this.elShadow.hide()
		this.el.hide()
		this.visible = false
	}
}