import $ from "jquery"
import {LEVELS} from "../config/Levels"

export default class {
    constructor() {
        $("#convo-editor").show()
        $("#levels").empty().append("<div class='convo-title'>Maps</div>").append(Object.keys(LEVELS).map(name => "<div class='level convo-line' id='" + name + "'>" + name + "</div>").sort())
        $(".level").click(event => this.showNpcs(event))
    }

    showNpcs(event) {
        let levelId = $(event.currentTarget).attr("id")
        $("#npcs").empty().append("<div class='convo-title'>NPCs with convos in " + levelId + "</div>");
        if(LEVELS[levelId].npcs) {
            for(let i = 0; i < LEVELS[levelId].npcs.length; i++) {
                let npc = LEVELS[levelId].npcs[i]
                let name = npc.creature
                if (npc.options && npc.options.convo) {
                    if (npc.options.name) name += " - " + npc.options.name
                    $("#npcs").append("<div class='npc convo-line' data-level_id='" + levelId + "' data-npc_index='" + i + "'>" + name + "</div>")
                }
            }
        }
        $(".npc").unbind("click").click(event => this.showConvo(event))
    }

    showConvo(event) {
        this.levelId = $(event.currentTarget).data("level_id")
        this.npcIndex = $(event.currentTarget).data("npc_index")
        this.depthFirstIndex = 0
        this.npc = LEVELS[this.levelId].npcs[this.npcIndex]

        let name = this.npc.creature
        if (this.npc.options.name) name += " - " + this.npc.options.name
        $("#convo-tree").empty().append("<div class='convo-title'>Convo tree for " + name + "</div>")

        this.showTree($("#convo-tree"), "INTRO", this.npc.options.convo)

        $(".convo-toggle").unbind("click").click((event) => {
            let el = $(".children", $(event.currentTarget).parent().parent())
            el.toggle()
            $(event.currentTarget).empty().append(el.is(":visible") ? "-" : "+");
        })
    }

    showTree(el, answer, convo) {
        if(typeof convo === "string") {
            el.append("<div class='convo-indent'>" +
                "<div><span class='convo-answer'>" + answer + "</span></div>" +
                "<div class='convo'>TAG: " + convo + "</div>" + // todo: should be a link to edit the question pointed at
                "</div>")
        } else {
            this.depthFirstIndex += 1
            let name = convo.question ? convo.question : convo.cond.toString()
            el.append("<div class='convo-indent' data-depth_first_index='" + this.depthFirstIndex + "'>" +
                "<div><span class='convo-toggle'>-</span><span class='convo-answer'>" + answer + "</span></div>" +
                "<div class='convo-line convo'>" + name + "</div>" +
                "<div class='children'></div>" +
                "</div>")
            let parentEl = $(".convo-indent[data-depth_first_index='" + this.depthFirstIndex + "'] .children")
            if (convo.cond) {
                this.showTree(parentEl, "PASS", convo.pass)
                this.showTree(parentEl, "FAIL", convo.fail)
            } else {
                let c = 0
                for (let i = 0; i < convo.answers.length; i++) {
                    let result = convo.answers[i].result
                    if (result) {
                        let answer = (convo.answers[i].cond ? convo.answers[i].cond.toString() + " - " : "") + convo.answers[i].answer
                        this.showTree(parentEl, answer, result, convo.answers[i].cond)
                        c++
                    }
                }
                if (c == 0) $(".convo-toggle", parentEl.parent()).hide();
            }
        }
    }
}