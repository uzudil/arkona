import Convo from "./Convo"

export const COW = new Convo("Moo.").answer("Uh, thanks for that.")

export const SHARYA = new Convo("Harm me not, mighty warrior, I beg thee!")
	.answer("I am not a warrior, but a spaceman, lost on this planet.",
		new Convo("Didst thou not slay the metal demon I saw in the sky?", "R_DEMON")
			.answer("You must be referring to my spaceship. It was damaged and I need tools to fix it.", "R_TOOLS")
			.answer("Yes I bested the beast with my bare hands. Now how do I get home?",
				new Convo("Thou looks to have lost thy way. I am but a simple farmer and can't help thee much. " +
					"Thou should go see the blackrobes at Median, they will show thee the way home.", "R_HELP")
					.answer("That sounds ominous... Who are these blackrobes?",
						new Convo("Dost thou know nothing of our world? The blackrobed cenobites gather and organize all " +
							"knowledge in Arkona. Surely they know how to get thee home.", "R_MONKS")
							.answer("Excellent idea, I will find them. Which way to Median?", "R_MEDIAN")
							.answer("Thanks, I'll go find these keepers of knowledge.")
					)
					.answer("Thanks for the info. How do I get to Median?",
						new Convo("Take the path through the woods to the west. It will take thee to Median. " +
							"In the woods, thou should watch out for beasts.", "R_MEDIAN")
							.answer("And the monks there can help me?", "R_MONKS")
							.answer("Great thanks, I'll be on my way.")
							.answer("These beasts... are they dangerous?",
								new Convo("Thou art a mighty warrior, a pack of wolves will mean nothing to thee. " +
									"I though, usually carry a weapon.")
									.answer("Yes... ehm... I will dispatch them with ease.")
									.answer("A weapon wouldn't hurt. Where can I find one?", "R_TOOLS")
							)
					)
					.answer("Thans for nothing. I'll just find my own way home.")
			)
	)
	.answer("What makes you think I'm a mighty warrior?", "R_DEMON")
	.answer("I will not harm you woman, now show me to the nearest space port.",
		new Convo("Thou speaketh in a strange tongue. What is a \"space port\"? " +
			"If thou art after my cows, thou canst look elsewhere.")
			.answer("I need to get off this planet and go back home.", "R_HELP")
			.answer("Then maybe you could help me fix my ship. Show me your tools!",
				new Convo("Thou canst use my rake and hoe. They're in the shed to the south.", "R_TOOLS")
					.answer("Uhm... not the kind of tools I was looking for.", "R_HELP")
					.answer("Yes perfect! I will put them to good use.")
			)
	)
