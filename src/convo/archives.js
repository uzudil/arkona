import Convo from "./Convo"

export const FRAN = new Convo("'Tis a shame what happened to brother Pazu. Still, I'm glad thou hath solved the case. " +
	"Now I can return to my research.")
	.answer("It was hardly a challenge for a man of my intellect.")
	.answer("What research would that be?",
		new Convo("I wish I could aid thee, but my research concerns the growing of plants without sunlight.", "R_FRAN_RESEARCH")
			.answer("Fascinating. Well look at the time fly! I must go.")
			.answer("Any breakthroughs in your studies?",
				new Convo("Regretfully none so far. All my test subjects have withered without the aid of the sun.")
					.answer("Fancy that... ")
			)
	)
	.answer("Can you help me get back home?", "R_FRAN_RESEARCH")

export const XAN = new Convo("Ah thou again... the investigator. How can I help one already so knowledgeable?")
	.answer("Flattery will get you nowhere. See you around.")
	.answer("What do you study here?",
		new Convo("I study the alignment of the stars. Perhaps thou hath gazed into the night sky wondering about the stars?")
			.answer("A scientist of stars! Perfect. Can you help me return to my planet?",
				new Convo("Thou doth jest! There is no life outside of Arkona. Our existence is fragile and would wither in the vast emptiness of space.")
					.answer("You are right. It was foolish of me to ask.")
					.answer("There are great machines able to travel the void...",
						new Convo("If such machination were possible, would we have not learned of its existence already? Surely thou speaketh a tale. " +
							"There is nothing out there but cold and death.")
							.answer("I'm telling you, I came on one. And I need to return to the stars.",
								new Convo("Most exciting. If thou ever returns to dare the dark reaches of the heavens... take me with thee!")
									.answer("I will be sure to come and get you.")
									.answer("I don't think so. See you around.")
							)
							.answer("Yes ok, thanks for nothing.")
					)
			)
			.answer("Well that's interesting. I wish you well.")
	)

export const SMEN = new Convo("I'm forever thankful to thee for solving the murder of brother Pazu. It is so good to be back in my library again.")
	.answer("Say nothing of it.")
	.answerIf((arkona) => arkona.gameState["urhaw_notes"] == true, "Have you heard of a place called Urhaw?",
		new Convo("Not I, but if it's connected to Raighd, perhaps Marisan of Eldun knows of it.")
			.answer("I will ask him then.")
	)
	.answer("Ok... Now can you help me get back home?",
		new Convo("I looked into thy story a bit but my library is lacking on the subject. " +
			"None of my tomes discuss other heavenly bodies. I'm afraid this does not bode well for thee...")
			.answer("Why is that? Perhaps someone else has the answer.",
				new Convo("We the monks of Median are the keepers of knowledge in Arkona. If the information thou seeketh is not here, " +
					"it is not documented anywhere else.")
					.answer("Great. I'll keep looking all the same.")
					.answer("What do you suggest I do?",
						new Convo("Thou could perhaps settle into thy new life, here in Arkona...")
							.answer("Great idea, I'll see you around.")
							.answer("No. I must get back home.",
								new Convo("...perhaps with the aid of a good woman, thou could find a new meaning and purpose to thy...")
									.answer("Excellent idea. I will find the lucky lady straighaway.")
									.answer("Like I said already: no",
										new Convo("Well if thou insists... There is perhaps a way... It will be dangerous and I really should not " +
											"council thee to seek this path...")
											.answer("Maybe I'll take up your settling down idea instead")
											.answer("I'm not afraid of sacrifices, speak on monk",
												new Convo("I visited brother Pazu's cell to see why the Gramnor attacked him. I can't be sure exactly what happened, " +
													"but it seems he he studied an object that originated from outside of this world.", "R_PAZU_RESEARCH")
													.answer("Ok, I'm not going to do research. I want to fight my way home.")
													.answer("Interesting. Are you suggesting I continue his research?",
														new Convo("Aye that I do. Thread carefully on this path and remember what happened to Pazu. If thou art still " +
															"interested, look in his cell and read his notes. Thou will perhaps find something useful.", "",
															(arkona) => arkona.gameState["see_pazus_notes"] = true)
															.answer("Could you tell me again what I'm looking for?", "R_PAZU_RESEARCH")
															.answer("Thanks I will look thru Pazu's notes.")
													)
											)
									)
							)
					)
			)
	)
