import Convo from './Convo'

export const MARISAN = new Convo("Why art thou disturbing my research?")
		.answer("I'm just passing through")
		.answer("What are you doing here?")
		.answerIf((arkona) => arkona.gameState["visit_eldun"] == true, "What can you tell me about these feathers?")
