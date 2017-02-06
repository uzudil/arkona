import $ from "jquery"
import { toCss } from "../config/Config"
import { BLOCKS } from "../config/Blocks"

export default class {
	constructor(editor) {
		this.el = $("#palette")
		this.el.empty()
		for(let key in BLOCKS) {
			this.el.append("<div id='" + key + "' class='block' style='" + toCss(key) + "'></div>")
		}
		$("#palette .block").click((event) => {
			editor.setActiveBlock($(event.currentTarget).attr("id"))
		})
	}
}