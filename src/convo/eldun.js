import Convo from './Convo'

export const MARISAN = Convo.condition((arkona) => arkona.gameState["marisan_key"],
	Convo.condition((arkona) => arkona.gameState["marisan_purple_tome"],
		new Convo("I see thou hath found the book. Let's see if my guess was correct... Yes, sadly it is as I thought. " +
			"The force at Median has been preparing its invasion for many eons. I will try to explain all...")
			.answer("Don't bother. Just give me the name of the creature and I'll be on my way")
			.answer("Ugh ok... go ahead, I can't wait to hear the whole boring story.")
			.answer("Tell me, what attacked brother Pazu?")
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
						.answer("I... no. What is the Raighd?")
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
