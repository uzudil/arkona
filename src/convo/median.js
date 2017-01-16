import Convo from './Convo'

export const ARADUN = new Convo("Thank the Kada, thou art finally here. Hurry, we left everything untouched!")
	.answer("I... have no idea what you're talking about.",
		new Convo("Then thou art not the police inspector? This murder has all of us confused!", "R_NOT_INSPECTOR")
			.answer("I'm not the inspector. I'm just here looking for information.",
				new Convo("We're simple monks of the Kada, dedicated to gathering all knowledge. I would help thee but not until the murder has been solved.")
					.answer("Very well. Tell me what happened", "R_MURDER")
					.answer("I want nothing to do with this.")
			)
			.answer("Why, I am the inspector. Show me to the crime scene.",
				new Convo("It's brother Pazu... he's been... incinerated as if by a foul magic. We left his hut untouched. Thou should also talk to my brethren, they may know more.", "R_MURDER")
					.answer("I will see what I can do")
					.answer("Your brethren? Are there other monks here?",
						new Convo("Brother Xan, Brother Fran and Brother Smen are meditating in their cells. Thou canst find them to the north of here.")
							.answer("Thanks, I will speak with them.")
							.answer("Why would someone murder a monk? Was anything stolen?", "R_TREASURE")
					)
			)
			.answer("Murder?! It's been nice talking to you. I'll come back later.")
	)
	.answer("Yes, you have done well. Now, show me to your treasury.",
		new Convo("We have no earthly goods, only tomes of wisdom. I would show these to thee if not for this foul crime.", "R_TREASURE")
			.answer("Tell me more about what happened.", "R_MURDER")
			.answer("I'll just show myself around then.")
	)
	.answer("I don't think I'm the one you're expecting...", "R_NOT_INSPECTOR")

export const SMEN = new Convo("A visitor comes at this dark time? Art thou the police inspector we sent for?")
	.answer("I'm not the inspector, but maybe I can help. Tell me what happened.")
	.answer("I'm only looking for some information.")

export const FRAN = new Convo("Blessed Kada provideth! I saw everything!")
	.answer("Everything? Tell me what happened.")
	.answer("Uh... I'm only looking for a way to get back home.")

export const XAN = new Convo("Brother Pazu did not deserve his fate.")
	.answer("Why, what happened to brother Pazu?")
	.answer("I really could not care less. Now, could you help me get back home?")
