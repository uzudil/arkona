import Convo from './Convo'

export const ARADUN = Convo.condition((arkona) => arkona.gameState["visit_eldun"],
	new Convo("Thou hath returned. What news from Marisan of Eldun?")
		.answer("I'm still working on it")
		.answer("Could you tell me again why I'm going to Eldun?", "R_MARISAN"),
	Convo.condition((arkona) => arkona.gameState["seen_aradun"],
		new Convo("How art thou progressing with the resolution of the murder?")
			.answer("Can you tell me again what happened?", "R_MURDER")
			.answer("I'm still investigating")
			.answer("I know who did it!",
				Convo.condition((arkona) => arkona.gameState["R_DARK_SHAPE"] == true,
					new Convo("Blessed Kada! What hath thou found out? I must know!")
						.answer("The brothers saw a large dark shape, covered in feathers that night.",
							new Convo("Very interesting. Dost thou know anything else?")
								.answer("The creature's feathers were found around Pazu's hut.",
									new Convo("Thou should take one of the feathers to Marisan of Eldun. He is a master of " +
										"all natural lore and will give thee more information.", "R_MARISAN",
										(arkona) => arkona.gameState["visit_eldun"] = true)
										.answer("No. I solved the murder and now you must tell me how I can get home.", "R_MORE_SERIOUSLY")
										.answer("Yes... ok... and how do I get to Eldun?",
											new Convo("Walk back whence thou came. In the woods, take the road heading north. " +
												"Marisan's tower of Eldun sits atop a rocky craig not far from the woods.")
												.answer("Tell me again why I'm going to see Marisan?", "R_MARISAN")
												.answer("I'm not going anywhere. I'll open the archives myself.")
												.answer("I'll come back when I have more info about the feathers.")
										)
								)
						),
					new Convo("Blessed Kada! Who is the killer? Thou should keep me in suspense no longer.")
						.answer("It was brother Xan.",
							new Convo("But how and why? We're not wizards who cast evil magics to burn the flesh. And there is no motive for such a heinous crime!", "R_JUST_KIDDING")
								.answer("I actually have no idea - I'm still investigating.",
									new Convo("Thou should take the investigation more seriously and not accuse innocents of a wrong-doing. " +
										"We will not reopen the archives until this matter is resolved.", "R_MORE_SERIOUSLY")
										.answer("Ok, ok. I'll keep looking.")
										.answer("Forget it. I've spent enough time here already.")
								)
								.answer("Just wanted to see your reaction to this.", "R_MORE_SERIOUSLY")
						)
						.answer("Brother Smen is responsible.", "R_JUST_KIDDING")
						.answer("Brother Fran is guilty.", "R_JUST_KIDDING")
				)
			),
		new Convo("Thank the Kada, thou art finally here. Hurry, we left everything untouched!")
			.answer("I... have no idea what you're talking about.",
				new Convo("Then thou art not the police inspector? This murder has all of us confused!", "R_NOT_INSPECTOR",
					(arkona) => arkona.gameState["seen_aradun"] = true)
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
		)
	)

export const SMEN = new Convo("A visitor comes at this dark time? Art thou the police inspector we sent for?")
	.answer("I'm not the inspector, but maybe I can help. Tell me what happened.",
		new Convo("Brother Pazu's path through the Kada came to a sudden end. " +
			"I'm afraid I do not know how it happened.", "R_SMEN_MURDER")
			.answer("Where do I find brother Pazu's hut?",
				new Convo("His hut is to the south west of here.")
					.answer("I'll go and see what I can find out.")
					.answer("Ok, but before I do that, could you help me research a way to get home?", "R_SMEN_ARCHIVES")
			)
			.answer("Would anyone else know what happened?",
				new Convo("Thou should converse with the other cenobites here. " +
					"Perhaps thou can solve the riddle we could not.")
					.answer("I'll go and talk to the other monks.")
					.answer("Could you tell me again what happened?", "R_SMEN_MURDER")
			)
			.answerIf((arkona) => arkona.gameState["SMEN_FEATHER"] == true, "I heard you've been studying ravens...",
				new Convo("Thou art correct, the Kada bade me to study the birds. Why art thou concerned with my research?")
					.answer("I'm a birder myself. Perhaps I could see what bird books you have here?", "R_SMEN_ARCHIVES")
					.answer("Another monk saw large black feathers by Pazu's hut on the night he was killed.",
						new Convo("Yes, yes... I remember now... That night, I saw a large dark shape descending on Pazu's hut. " +
							"At the time I thought it but a vision granted to me through intense meditation.", "",
							(arkona) => arkona.gameState["R_DARK_SHAPE"] = true)
							.answer("You crazy zealot, how did you not think this important? I have to tell Aradun.")
							.answer("Right, it's probably just part of \"the Kada\". Now about opening the archives...", "R_SMEN_ARCHIVES")
					)
			)
	)
	.answer("I'm only looking for some information.",
		new Convo("I'm sorry but I cannot aid thee until this investigation is concluded. " +
			"Perhaps if thou could assist in resolving the matter, the archives would be reopened.", "R_SMEN_ARCHIVES")
			.answer("If you won't help, I'll look for the answers myself.")
			.answer("I'd like to help... Tell me what happened.", "R_SMEN_MURDER")
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
								new Convo("Exactly. Thou hath solved the crime!")
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
	.answer("Why, what happened to brother Pazu?",
		new Convo("Brother Pazu was killed by some kind of dark magic. Thou should visit his hut to the south and see the destruction for thyself. " +
			"Mayheps thou canst solve the riddle of his demise.", "R_XAN_MURDER")
			.answer("I will go there now.")
			.answer("No thanks, I don't need to see a burned, dead body!")
			.answerIf((arkona) => arkona.gameState["XAN_ACCUSED"] == true, "I heard Pazu and you had a disagreement",
				new Convo("Thou hath heard correctly. Pazu and I feuded over some onions he stole from me. " +
					"I visited him last night to put the issue to rest. That's when I saw the feathers.")
					.answer("So you admit you were out during the night of the murder?",
						new Convo("Aye, I went to Pazu's hut to make peace. I'm no murderer! On the way over I noticed some large, " +
							"black feathers by his hut. I assumed they were from brother Smen's research.", "R_XAN_SNEAK")
							.answer("Tell me more about these feathers.", "R_FEATHERS")
							.answer("And I think you murdered Pazu. I will tell Aradun.")
					)
					.answer("Oh, this just keeps getting better. What feathers did you see?",
						new Convo("When I went to visit Pazu, the night he was killed, I noticed some black feathers around his hut. " +
							"Perhaps it's not related but thou should ask brother Smen about his research on ravens.",
							"R_FEATHERS", (arkona) => arkona.gameState["SMEN_FEATHER"] = true)
							.answer("I always thought Smen looked suspicious! I'll talk to him.")
							.answer("Don't try to change the subject. You were sneaking around at night!", "R_XAN_SNEAK")
					)
			)
	)
	.answer("I really could not care less. Now, could you help me get back home?",
		new Convo("Aye, I would help thee find thy answers, but brother Aradun locked the archives until the matter of Pazu's death is put to rest. " +
			"If thou can solve the crime I will find what info we have.")
			.answer("I'm really not in the mood for this.")
			.answer("How did Pazu die?", "R_XAN_MURDER")
	)
