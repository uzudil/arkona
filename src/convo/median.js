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
	.answer("I'm not the inspector, but maybe I can help. Tell me what happened.",
		new Convo("Brother Pazu's path through the Kada came to a sudden end. " +
			"I'm afraid I do not know how it happened.", "R_SMEN_MURDER")
			.answer("Where do I find brother Pazu's hut?",
				new Convo("His hut is to the south west of here.")
					.answer("I'll go and see what I can find out.")
					.answer("Ok, but before I do that, could you help me research a way to get home?", "R_SMEN_ARCHIVES")
			)
			.answer("Would anyone else know what happend?",
				new Convo("Thou should converse with the other cenobites here. " +
					"Perhaps thou can solve the riddle we could not.")
					.answer("I'll go and talk to the other monks.")
					.answer("Could you tell me again what happend?", "R_SMEN_MURDER")
			)
	)
	.answer("I'm only looking for some information.",
		new Convo("I'm sorry but I cannot aid thee until this investigation is concluded. " +
			"Perhaps if thou could assist in resolving the matter, the archives would be reopened.", "R_SMEN_ARCHIVES")
			.answer("If you won't help, I'll look for the answers myself.")
			.answer("I'd like to help... Tell me what happend.", "R_SMEN_MURDER")
	)

export const FRAN = new Convo("Blessed Kada provideth! I saw everything!")
	.answer("Everything? Tell me what happened.",
		new Convo("I was but halfway through my evening prayers, when... I saw him... " +
			"sneaking through the yard towards brother Pazu's hut! ...and all because of the onions.", "R_FRAN_MURDER")
			.answer("Uh... onions?",
				new Convo("Thou art but a visitor, but all is not at peace at Median. " +
					"There's been a feud among some of us, on account of a history of petty thefts.")
					.answer("Tell me about the thefts",
						new Convo("Most recently brother Pazu liberated some of brother Xan's onions. " +
							"I can only assume this drove him to a murderous rage!", "R_FRAN_ONIONS",
							(arkona) => arkona.gameState["XAN_ACCUSED"] = true)
							.answer("So... brother Xan murdered Pazu over some onions.",
								new Convo("Exactly. Thou hast solved the crime!")
									.answer("This is ridiculous. I'm going now.")
									.answer("So brother Xan also somehow acquired vast magical powers and vaporized Pazu?", "R_FRAN_THINK")
							)
							.answer("Even if that is the case, how was Pazu reduced to charred bones?",
								new Convo("Uh well, thou mayest have a good point there. I did not think... " +
									"Well, thou should still confront brother Xan and ask what he was doing " +
									"sneaking around during the night.", "R_FRAN_THINK")
									.answer("I think I've heard enough petty nonsense for one day.")
									.answer("Very well, I'll talk to brother Xan.")
							)
					)
					.answer("This is so boring. I'm practically falling asleep right now...")
			)
			.answer("He? Who? One of the brothers?", "R_FRAN_ONIONS")
	)
	.answer("Uh... I'm only looking for a way to get back home.",
		new Convo("I would be glad to assist thee but our archives are locked until the murder is solved.")
			.answer("I see, I'll just have to take matters into my own hands.")
			.answer("What can you tell me about the night of the murder?", "R_FRAN_MURDER")
	)

export const XAN = new Convo("Brother Pazu did not deserve his fate.")
	.answer("Why, what happened to brother Pazu?")
	.answer("I really could not care less. Now, could you help me get back home?")
