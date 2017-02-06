import $ from "jquery"

export default class {
	constructor() {
		this.el = $("#curtains")
		if(this.el.length == 0) {
			$("body").append("<div id='curtains' style='" +
				"display: none; " +
				"background: #000; " +
				"position: absolute; " +
				"top: 0; left: 0; " +
				"width: 100%; height: 100%;" +
				"z-index: 1000;" +
				"'><img src='/assets/images/loading.svg' style='" +
				"position: relative; " +
				"top: 50%; left: 50%; " +
				"margin-left: -32px; " +
				"margin-top: -32px; " +
				"'" +
				"</div>")
			this.el = $("#curtains")
		}
	}

	fadeIn(onDone) {
		setTimeout(() => {
			this.el.fadeIn(onDone)
		}, 100)
	}

	fadeOut(onDone) {
		setTimeout(() => {
			this.el.fadeOut(onDone)
		}, 100)
	}
}
