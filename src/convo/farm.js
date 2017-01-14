import Convo from './Convo'

export const CONVO = new Convo("Harm me not, mighty warrior, I beg thee!", "sharya.start")
	.answer("I am not a warrior, but a spaceman, lost on this planet.",
		new Convo("Didst thou not slay the metal demon I saw in the sky?", "R_DEMON")
			.answer("You must be referring to my spaceship. It was damaged and I need tools to fix it.",
				Convo.ref("R_TOOLS")
			)
			.answer("Yes I bested the beast with my bare hands. Tell me about this land.")
	)
	.answer("What makes you think I'm a mighty warrior?", Convo.ref("R_DEMON"))
	.answer("I will not harm you woman, now show me to the nearest space port.",
		new Convo("Thou speaketh in a strange tongue. What is a \"space port\"? If thou art after my cows, thou canst look elsewhere.")
			.answer("I need to get off this planet and go back home.")
			.answer("Then maybe you could help me fix my ship. Show me your tools!",
				new Convo("Thou canst use my rake and hoe. They're in the shed to the south.", "R_TOOLS")
					.answer("Uhm... not the kind of tools I was looking for.")
					.answer("Yes perfect! I will put them to good use.")
			)
	)

