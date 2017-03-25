import Convo from "./Convo"

// eslint-disable-next-line no-unused-vars
const COMMON = new Convo("Our town of Voln has stood here for near a millennia!", "VOLN_COMMON")
    .answer("Tell me what lies to the north.",
        new Convo("Hast thou not heard of the Raighd to the north? Our town is all that stops its chaos from running wild over all of Arkona!")
            .answer("What is this Raighd?",
                new Convo("Dost thou know nothing? The Raighd is the bane of our time! It's a vast stretch of untamed land, infested with evil " +
                    "that lies to the north of here.", "VOLN_COMMON_RAIGHD")
                    .answer("Can one visit this place?",
                        new Convo("Not sure why thou would want to. Certain doom is all that thou shalt find! If thou insists, talk to Mayor Gratt.")
                            .answer("Who is mayor Gratt?", "VOLN_COMMON_GRATT")
                            .answer("Anything else notable about this town?", "VOLN_COMMON")
                    )
            )
    )
    .answer("Any notable persons in town?",
        new Convo("Aye, Mayor Gratt lives in the tall house. The Horned Wyvern pub is helmed by Kat and is always busy. And we also have a Hermit.")
            .answer("What does the mayor do?",
                new Convo("Mayor Gratt manages our town. He decides who is allowed into the Raighd. " +
                    "If thou art looking for work, thou should ask if he needs anything done.", "VOLN_COMMON_GRATT")
                    .answer("What is the Raighd?", "VOLN_COMMON_RAIGHD")
                    .answer("I will look him up, thanks.")
                    .answer("Anything else notable about this town?", "VOLN_COMMON")
            )
            .answer("What does Kat sell at the Horned Wyvern?",
                new Convo("The Wyvern is the town pub. Northern ale and southern wine are what most of the locals quaff, but " +
                    "ask Kat if thou art looking for something more exotic.")
                    .answer("I will ask her, thanks")
                    .answer("Anything else notable about this town?", "VOLN_COMMON")
            )
            .answer("Tell me about this Hermit.",
                new Convo("Aye, he lives in a hut next to a river to the south-west of town. He seems to be a harmless fellow, " +
                    "keeping to himself mostly. Rumor has it he is a former member of the Black Guard!")
                    .answer("What is the Black Guard?",
                        new Convo("The Black Guard is a notorious organization of assassin mercenaries. Some say they're somehow connected with the Raighd.", "",
                            (arkona) => arkona.gameState["HERMIT_ASSASSIN"] = true
                        )
                            .answer("What is the Raighd?", "VOLN_COMMON_RAIGHD")
                            .answer("Interesting... Anything else in town I should know about?", "VOLN_COMMON")
                    )
                    .answer("What a load of nonsense. I'll be going now.")
                    .answer("Anything else notable about this town?", "VOLN_COMMON")
            )
    )

export const RHEE = new Convo("What can a simple farmer do for thee, stranger?")
    .answer("Tell me about your town", "VOLN_COMMON")

export const TRAVOR = new Convo("Halt there stranger, do not attempt to enter the Raighd!")
    .answer("Tell me about your town", "VOLN_COMMON")

export const HISO = new Convo("'I will bring it right back', she said, but it's been years!")
    .answer("Tell me about your town", "VOLN_COMMON")

export const NISO = new Convo("Having good neighbors is key to a peaceful life!")
    .answer("Tell me about your town", "VOLN_COMMON")

export const ENCAT = new Convo("Ah traveler, let me know if thou art looking to make some easy coin.")
    .answer("Tell me about your town", "VOLN_COMMON")

export const VERNON = new Convo("Need a bit of wisdom, stranger? My library stands at thy service!")
    .answer("Tell me about your town", "VOLN_COMMON")

export const HERMIT = new Convo("All life is sacred and the woods shelter us in times of need. Meditate on that, stranger.")
    .answer("Why do you choose to live here alone?",
        new Convo("If thou wishes to be one with divinity, thou should do as I and live in peaceful isolation. The woods provide for us all.", "HERMIT_ALONE")
            .answer("How do you survive by yourself?",
                new Convo("I subsist on plants and water. Divine nature's creatures may not be touched. I revere them and they leave me be. Such is the true path.")
                    .answer("Do you consider the Raighd also divine?",
                        new Convo("Yes, the Raighd is but a vast forest. Peaceful to those wishing it no harm. I have walked along its ancient paths only but yesterday.")
                            .answer("How did you get into the Raighd? I thought it was blocked off...",
                                new Convo("I will teach thou the way past the magic blockade and into the Raighd, if thou could bring me the lost book of Lorneon.", "HERMIT_RAIGHD")
                                    .answer("Sounds crazy, no thanks.")
                                    .answer("Sure thing, where can I find this book?",
                                        new Convo("Thy helpfulness makes me glad stranger. Unfortunately, the book has been lost for many eons and none now " +
                                            "live who know where to find it. If thou should get it in thy travels, bring it to me.", "",
                                            (arkona) => arkona.gameState["QUEST_BOOK_LORNEON"] = true)
                                            .answer("You can count on it. Goodbye!")
                                    )
                            )
                            .answer("Ok that's crazy. Tell me again how you survive here alone?", "HERMIT_ALONE")
                    )
                    .answer("Well ok then... I won't disturb you anymore.")
            )
            .answer("Do you not become lonely?",
                new Convo("Nay, stranger. The divine breath of the woods is my constant companion.")
                    .answer("Well, enjoy it then.")
                    .answer("That's... great. Tell me more about how you survive here.", "HERMIT_ALONE")
            )
            .answer("That's just great... I'll be going back to civilization now.")
    )
    .answerIf((arkona) => arkona.gameState["HERMIT_ASSASSIN"] == true, "That's not what I heard... stranger...",
        new Convo("Much of what we hear is but the idle chatter of the bored... We may choose to understand some of it, and discard the errant thoughts.")
            .answer("That's a good philosophy. How do you live here by yourself?", "HERMIT_ALONE")
            .answer("Being a former assassin cannot be hand-waved over. Explain yourself!",
                new Convo("Aye, thou art correct stranger. The errors of my younger self haunt me to this day. Alas, I cannot tell thee of that time: " +
                    "the vows of secrecy bind me still.")
                    .answer("I understand. Tell me instead, how do you survive here alone?", "HERMIT_ALONE")
                    .answer("OK, ok... but did you kill many men?",
                        new Convo("I already told thee... I cannot divulge...")
                            .answer("...More than 3? Did you kill more than 3 people?",
                                new Convo("I...").
                                answer("...just a show of fingers...",
                                    new Convo("...").
                                    answer("...unless it's more than the number of fingers you have?",
                                        new Convo("...thou doth persist...")
                                            .answer("I must know",
                                                new Convo("It will soon be one more dead, unless thou stops thy ceaseless questioning! " +
                                                    "Sweet sunshine, what am I saying?! I vowed to never walk that path of darkness again. I must meditate on this...")
                                                    .answer("So it is true, you were once an assassin!",
                                                        new Convo("...forgive thy useless servant, divine breath of Nature. " +
                                                            "I will walk and make my peace at thy Great Oak Heart of the Raighd soon...")
                                                            .answer("Wait, you know how to get into the Raighd?", "HERMIT_RAIGHD")
                                                            .answer("What is the Great Oak Heart the Raighd?",
                                                                new Convo("At the center of the Raighd is a huge sentient oak. All energies of the Raighd are bound about it. " +
                                                                    "If thou wishes to convey a message to the Raighd, start with this oak tree.")
                                                                    .answer("I have no such wish. Goodbye!")
                                                                    .answer("To know this, you must have visited the Raighd. How did you do this?", "HERMIT_RAIGHD")
                                                            )
                                                            .answer("I'm sorry to have upset you... I will be leaving now.")
                                                    )
                                                    .answer("I will leave you to your thoughts.")
                                            )
                                            .answer("Ok fine. How do you survive here alone?", "HERMIT_ALONE")
                                    )
                                )
                            )
                    )
            )
    )

export const KAT = new Convo("What'll it be dear? Ale or wine?").answer("Thanks, I'm leaving now.")

export const MAYOR = new Convo("Ah a stranger in our town. What brings thee to Voln, traveler?").answer("Thanks, I'm leaving now.")
