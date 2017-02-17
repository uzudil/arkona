import Convo from "./Convo"

export const MARISAN =
	Convo.condition((arkona) => arkona.gameState["urhaw_notes"],
		new Convo("Thou hath returned again. As much as I enjoy thy company and incessant questioning, I must return to my studies of the Raighd.")
			.answer("The Raighd... can you tell about that again?", "R_MARISAN_RAIGHD")
			.answer("Tell me about the Gramnor once more.",
				new Convo("The Gramnor is a large winged demon that attacks its victims using magical energy summoned from the Raighd. " +
					"It's almost never seen outside of the Raighd, wherein it is much more powerful.")
					.answer("Sounds just lovely...")
					.answer("Could you tell me about the Raighd?", "R_MARISAN_RAIGHD")
			)
			.answer("The monk killed by the Gramnor studied this green stone...",
				new Convo("Let me see that... I can tell thee this stone is not of this world. " +
					"Perhaps from the Raighd or another world in the stars.", "R_MARISAN_STONE")
					.answer("His notes spoke of a place called Urhaw",
						new Convo("Urhaw was once a border fortress, with the purpose to hold back the advancing of the Raighd. " +
							"Long ago overrun it now lies within the borders. Legends say it is but an abandoned ruin.")
							.answer("Has no one visited Urhaw recently?",
								new Convo("Many years ago, after the attacks from the Raighd, the border cities " +
									"created a magical barrier around it.")
									.answer("Can one still enter the Raighd?", "R_MARISAN_WALL")
							)
							.answer("That's all I needed to know. Goodbye.")
							.answer("Tell me about this green stone again.", "R_MARISAN_STONE")
					)
					.answer("His notes talked about the Illumis",
						new Convo("I have heard of the Illumis but I confess I don't know much about it. It's some kind of spoken power unique to the Raighd.")
							.answer("I'll keep searching for more information on it.")
							.answer("Tell me about this green stone again.", "R_MARISAN_STONE")
					)
			),
		Convo.condition((arkona) => arkona.gameState["marisan_key"],
			Convo.condition((arkona) => arkona.gameState["marisan_purple_tome"],
				new Convo("I see thou hath found the book. Let's see if my guess was correct... Yes, sadly it is as I thought. " +
					"Now, tell me: how did brother Pazu die?")
					.answer("He died of natural causes",
						new Convo("Well, perhaps I was wrong then. Tell Brother Aradun, I know not what creature these feathers came from.", "R_MARISAN_WRONG_ANSWER")
							.answer("Thanks for trying anyway.")
					)
					.answer("Only his charred bones were found...",
						new Convo("Aye, as I thought. Only one creature wreaks this kind of destruction but its existence is of legend only. " +
							"How much doth thee know of the Raighd?")
							.answer("Nothing. What is the Raighd?", "R_MARISAN_RAIGHD")
							.answer("I've heard all about it already. Tell me of this creature.",
								new Convo("Aye, it was one of the old horrors, last seen 500 years ago. A champion of darkness, it is a large " +
									"winged demon called the Gramnor. Why it attacked Pazu, I know not.", "",
									(arkona) => arkona.gameState["gramnor_research"] = true)
									.answer("I will tell the monks of Median of this.")
									.answer("How does the Gramnor attack its victim?",
										new Convo("It wields old magic straight from the heart of the Raighd. Its ability to summon a conflagration is well known. " +
											"Thou should also know, the beast is less powerful outside the Raighd than therein.")
											.answer("Tell me again of the Raighd.", "R_MARISAN_RAIGHD")
											.answer("Thanks for the info. I will inform Aradun.")
									)
							)
					)
					.answer("It was caused by an animal attack!", "R_MARISAN_WRONG_ANSWER")
				,
				new Convo("Have thou found the book I need to finish my research? It's in my private library and thou has the key.")
					.answer("Hang on, I'm still working on it.")
					.answer("Oh yeah the book. I'll be right back")
			),
			new Convo("By the light of Hazeun, why art thou disturbing my research? Thou will regret this unwelcome intrusion.")
				.answer("Uh... I think I'll be going now.")
				.answer("What do you study here? Could you help me get back home?",
					new Convo("Dost thou know nothing? I am Marisan and this is my tower at Eldun. My research is of the lore of nature: " +
						"the science and mystery of Arkona. My work is complex and I don't like visitors.")
						.answer("I'm stranded on this planet, could you help me get back home?",
							new Convo("Fascinating! Thou shows a strain of lunacy I have never encountered before. Fell to Arkona " +
								"from another heavenly body, thou say?")
								.answer("Yes! I am not crazy, my ship is damaged and I must get back home.",
									new Convo("Even if thou tells the truth, I cannot help thee reach thy home. The only ones who could possibly aid thee are the monks of Median.", "R_MARISAN_HOME")
										.answer("How do I reach the monks of Median?",
											new Convo("Thou should take the road to the south. Follow it along the river and when thou comes to a great " +
												"forest, head west. The abbey at Median is just past the rocky hills.")
												.answer("Great, thanks. Could you tell me about your research again?", "R_MARISAN_STUDY")
												.answer("Thanks I'll go pay these monks a visit.")
										)
										.answer("Great, I'll go find these monks. Thanks for the info!")
								)
								.answer("How can you call yourself a scientist?! What do you study here?", "R_MARISAN_STUDY")
						)
						.answer("I'm sorry for the interruption. I will be going now.")
						.answer("I am also interested in science. What are you researching at the moment?",
							new Convo("For the last few years, I've been studying the Raighd. Have thou read much about it? " +
								"A fascinating subject, vast and little understood.", "R_MARISAN_STUDY")
								.answer("I... no. What is the Raighd?",
									new Convo("Our known lands of Arkona are but the perimeter of our world. " +
										"Endless, tangled forests and vast cave systems cover the center, known as the Raighd.", "R_MARISAN_RAIGHD")
										.answer("I see. That's... fascinating... I will be leaving now.")
										.answer("Has anyone entered this... Raighd?",
											new Convo("Aye, some have yes. Each time the Raighd responded to the intrusion by sending forth a host of horrors, killing many." +
												"Eventually the border cities created a magical barrier.")
												.answer("What form of creatures came from the Raighd?",
													new Convo("Many were large winged demons, capable of much destruction. " +
														"Others were purely magical beings, made of foul vapors. No one withstood their attacks.")
														.answer("Tell me again about how they keep people out of the Raighd.", "R_MARISAN_WALL")
														.answer("Has anyone seen of these creatures recently?",
															new Convo("No one has for the last five hundred years. All we know of them comes from the " +
																"legends recorded in books.")
																.answer("Let these old horrors sleep, I say.")
																.answer("Tell me again of the Raighd.", "R_MARISAN_RAIGHD")
																.answer("Thanks for the info!")
														)
												)
												.answer("I see, so no one can enter the Raighd anymore?",
													new Convo("Nay, it is yet possible, albeit not simple. If thou wanted to venture into the Raighd, thou should " +
														"first prove thy skill by completing the Circuit.", "R_MARISAN_WALL")
														.answer("Tell me of the Circuit.",
															new Convo("Thou must visit each of the border cities and complete a task, set by the mayor. If thou can survive all " +
																"five trials, the mayors will grant thee entrance to the Raighd.")
																.answer("Where are these border cities?",
																	new Convo("Thou can begin in the town of Voln, to the north.")
																		.answer("I will start there. Thanks for the info!")
																		.answer("Tell me again about the Raighd.", "R_MARISAN_RAIGHD")
																)
																.answer("No thanks, but tell me how you study the Raighd?", "R_MARISAN_HOW_STUDY")
														)
														.answer("No thanks, I have no wish to enter the Raighd.")
												)
												.answer("How do you study the Raighd if no one can enter?", "R_MARISAN_HOW_STUDY")
										)
										.answer("And why do you study this wild land?",
											new Convo("Scientific curiosity is a strong force. I study the Raighd from afar with the great telescope mounted atop this tower.", "R_MARISAN_HOW_STUDY")
												.answer("I wish you success in your studies.")
												.answer("Can your science also send me back home?", "R_MARISAN_HOME")
										)
								)
								.answer("Yes, I have several of them back home. Speaking of which, can you help me return home?", "R_MARISAN_HOME")
						)
				)
				.answerIf((arkona) => arkona.gameState["visit_eldun"] == true, "I'm only looking for information about these feathers..."
					, new Convo("I am no mere birder, son! What makes thou think I am interested in thy feathers?")
						.answer("Brother Aradun of Median sent for your help identifying them.",
							new Convo("Aradun, hmm? Very well let me see them... Very interesting indeed. There is something... " +
								"I have not seen in many an age... I...", "R_MURDER_CLUE")
								.answer("What is it? Can you identify them?",
									new Convo("I have a foul suspicion, I know these feathers. In order to be sure, thou will bring me a tome from my library. " +
										"Take thee this key. In the room below, look for a large purple book and bring it to me.", "R_MARISAN_MORE_INFO",
										(arkona) => arkona.gameState["marisan_key"] = true)
										.answer("Can't you just guess without the damned book? I'm not your servant.",
											new Convo("Unfortunately my last servant took a rather long leave. And I could make a guess but I find it good practice " +
												"to consult science before hazarding alarming guesswork. Fetch thee my book!")
												.answer("Very well. I'll be back with the book.")
												.answer("I think I've had enough of your crackpot ideas. Goodbye.")
										)
										.answer("I will be back with book.")
								)
								.answer("Something what? What creature left these behind?", "R_MARISAN_MORE_INFO")
						)
						.answer("There was a murder at Median... These feathers are the only clue we have.", "R_MURDER_CLUE")
						.answer("You're right, I will be leaving now.")
				)
		)
	)

export const SARA = new Convo("Welcome to Eldun, young sir. If thou brings deliveries for the lord, thou can leave it here with me")
	.answer("Eldun? What kind of place is this?",
		new Convo("The mountain-top fastness of Eldun is the outpost of the fabled mystic Marisan. Deep thinker and knower of the lore of all of Arkona.")
			.answer("Where can I find this Lord Marisan?",
				new Convo("His lordship resides in the tower to northeast. Be warned though young sir, Lord Marisan does not take kindly to interruptions!", "R_MARISAN_TOWER")
					.answer("I'll be sure to knock first. Thanks!")
					.answer("Well, maybe I shouldn't bother him then.")
			)
			.answer("Well, that's nice. I'll be along now.")
	)
	.answer("No deliveries, just visiting. Who is this \"lord\"?",
		new Convo("Why it is Lord Marisan of Eldun. Wisest mystic of the land of Arkona. What do you wish of him?")
			.answer("My business is my own. Where can I find him?", "R_MARISAN_TOWER")
			.answer("No reason, just curious.")
	)

export const ARTON = Convo.condition((arkona) => arkona.gameState["boots_of_wandering"],
	new Convo("Thank you again for thy gift of the key to Lord Marisan's Library. " +
		"Just the other day, I was rewarded by finding a half-eaten crumpet, left by... the Lord himself!")
		.answer("You have no shame Arton. I must be going now. Goodbye."),
	Convo.condition((arkona) => arkona.gameState["arton_hired"],
		new Convo("Have thou found the key to Lord Marisan's inner library for me?")
			.answerIf((arkona) => arkona.gameState["marisan_key"], "Yes, here take it",
				new Convo("Excellent! A pleasure doing business with thee! As I promised, here are the Boots of " +
					"Wandering for thy trouble.", "R_ARTON_BOOTS",
					(arkona) => arkona.gameState["boots_of_wandering"] = true)
					.answer("I will put these to good use!")
			)
			.answer("I'm still working on it."),
		new Convo("Arton of Ranada, at your service. I can tell a fellow scientist when I see one!")
			.answer("Yes. Quite. What is your field of research?",
				new Convo("The subject of my studies is none other than Lord Marisan of Eldun, himself. A fascinating subject and " +
					"I've devoted my life to it. I moved here to Eldun specifically to help with my research.", "R_ARTON_STUDY")
					.answer("What have you learned about him so far?",
						new Convo("As the results of years of research - literally, thousands of hours of... \"observation\", I can " +
							"report with excellent confidence that Lord Marisan does in fact live in the tower to the north!", "R_MARISAN_STALKER",
							(arkona) => arkona.gameState["marisan_stalker"] = true)
							.answer("Well that is... astounding. What else have you learned?",
								new Convo("Moreover I have ascertained with veritable certainty, that the Lord Marissan keeps many tomes of knowledge in his tower. " +
									"He peruses these extensively!")
									.answer("Amazing! Anything else?",
										new Convo("Even more fascinating facts could be unearthed if only I had access to his library. Alas he keeps it locked. " +
											"If thou could just get me its key... I would be grateful.")
											.answer("No. I will not break into Marisan's house and steal for you. Goodbye.")
											.answer("Exactly how grateful are we talking?",
												new Convo("All in the name of science, right? Thou are wise to consider my offer! If thou could... procure the key for me, " +
													"I would give thee a pair of Boots of Wandering!")
													.answer("It is a deal.",
														new Convo("Thou will not regret this. Return to me once thou has the key to Lord Marisan's library", null,
															(arkona) => arkona.gameState["arton_hired"] = true)
															.answer("Great, see you when I have the key")
													)
													.answer("No way bro, you do your own stealing.")
											)
									)
									.answer("You're not much even at stalking, correct? See you later.")
							)
							.answer("Wow, ok. I'm going now.")
					)
					.answer("Uh, I believe that's called stalking and is in fact illegal.",
						new Convo("Nonsense my friend! Lord Marisan would be delighted to learn he is the subject of my " +
							"scientific curiosity. If thou would but hear what I know of him, thou could rest easy about my motives.")
							.answer("Very well, tell me what you know.", "R_MARISAN_STALKER")
							.answer("I will not be accessory to this. Goodbye!")
					)
			)
			.answer("Ah, no I'm just a traveler stranded on this planet.",
				new Convo("A traveler from another planet? Thou doth tell a good joke.")
					.answer("No one belives me...")
					.answer("What is it you do here?", "R_ARTON_STUDY")
			)
	)
)