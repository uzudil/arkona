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
                    "If thou art looking for work, thou should ask if he needs anything done. He lives in the tall house.", "VOLN_COMMON_GRATT")
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
    .answer("Do you ever venture inside the Raighd?",
        new Convo("Even if I wanted to, I wouldn't know how. Thou hath seen the magical barrier, no? It prevents entry to all.", "VOLN_FARMER_RAIGHD")
            .answer("I thought the locals had a way in...",
                new Convo("Nay, only Mayor Gratt knows how to enter. But why would thee travel there? Nothing but death awaits thee in the Raighd.")
                    .answer("I know, thanks.")
                    .answer("What do you grow in these fields?", "VOLN_FARMER")
            )
    )
    .answer("What kind of plants do you grow here?",
        new Convo("Thou aren't truly interested in farming. But just for humoring me, I'll tell thee that I grow anything this village needs. " +
            "Us farmers just do what the mayor tells us.", "VOLN_FARMER")
            .answer("Great, thanks for the info.")
            .answer("Does being so close to the Riaghd make it more difficult to grow things?",
                new Convo("Nay, the Raighd is held back by the magical barriers. It does has no effect on this side of the walls.")
                    .answer("Do you ever go inside the Raighd?", "VOLN_FARMER_RAIGHD")
                    .answer("Goodbye.")
            )
    )
    .answer("Tell me about your town", "VOLN_COMMON")

export const TRAVOR = new Convo("Halt there stranger, do not attempt to enter the Raighd! Thou should know what " +
    "happened the last time someone passed throught the magical blockade.")
    .answer("I'll do as I see fit.")
    .answer("Very well, tell me what happened the last time.",
        new Convo("In the year 628 the crazed mystic Fellorthal passed through here and entered the Raighd. After an " +
            "initial few calm weeks it became apparent that his passing came at a high price!")
            .answer("What was this... price?",
                new Convo("A dark host of the Raighd's minions broke through our defenses and decimated all in their path. Were it not " +
                    "for the unified armies of the circuit towns, none would live now to tell this tale.")
                    .answer("Tell me more about this dark host...",
                        new Convo("The Raighd sent out flying demons, shambling undead horrors, incorporeal aberrations that tested the very foundations of our sanity... " +
                            "Finally there came a column of Living Flame, scortching all in its path...")
                            .answer("How did the village armies fight against these beasts?",
                                new Convo("It took every ounce of magical energy to beat back the ravening servants of chaos and erect the magical barrier, " +
                                    "thou sees here. Since that day, no one entered and the Raighd stayed quiet on the other side.")
                                    .answer("Impressive story, but I still need to get in.",
                                        new Convo("I see there is no dissuading thee... Thou should talk to Mayor Gratt, only he can grant thee entrance to thy certain doom.")
                                            .answer("Where do I find Mayor Gratt?", "VOLN_COMMON_GRATT")
                                            .answer("Ok I'll look him up, thanks.")
                                    )
                                    .answer("I have no wish to unleash hell - I'll be leaving now.")
                            )
                    )
                    .answer("Uh-huh... I've had enough of this. Goodbye.")
            )
            .answer("Just because it happened once, it won't happen again. Stand aside!")
    )
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

export const MAYOR = Convo.condition((arkona) => arkona.gameState["QUEST_URGIL"] == true,
    new Convo("Hath thou vanquished Urgil the goblin foe? How doth thy quest?")
        .answer("Still working on it..."),
    new Convo("Ah a stranger in our town. Welcome to Voln, traveler, one of the guardian cities of Arkona!")
    .answer("What exactly do you guard the land from?",
        new Convo("Our town of Voln has stood here since the magical barriers were erected to keep the Raighd from taking over all of Arkona.")
            .answer("The Raighd... what is that?",
                new Convo("Has no one told thee about the vast, primeval tangle of pure Evil just over the magical boundaries? " +
                    "The Raighd is an untamed land of malevolent energy right here on our doorstep.")
                    .answer("What would happen if the barrier disappeared?",
                        new Convo("The barrier was put in place after the last time the forces of the Raighed poured into Arkona, " +
                            "killing all in sight. Never again do we want to witness that host of horrors pillaging our land.")
                            .answer("Yes, I'm glad the barrier is in place")
                            .answer("Is it possible for a traveler to enter the Raighd?", "VOLN_ENTER_RAIGHD")
                    )
                    .answer("So there is no way past the magical barriers and into the Raighd?",
                        new Convo("There is a way in. If I and the other border towns' mayors consider the candidate worthy, the barrier is lifted. " +
                            "However in my years of service, I've never met such a legend...", "VOLN_ENTER_RAIGHD")
                            .answer("I wish to pass through the barrier",
                                new Convo("Then thou must enter the Path of the Circuit: in each boundary town perform a heroic feat! " +
                                    "Thou should start here in Voln: we have a slight goblin problem.")
                                    .answer("Tell me about the problem with goblins",
                                        new Convo("To the west lies the ruined fortress of Thornperil. It stood empty for long, but recently a large " +
                                            "goblin named Urgil and his forces moved in. From there they raid and harrass our farmers.", "VOLN_GOBLIN_FORT")
                                            .answer("Wow ok, I have no wish to get killed over some cabbages")
                                            .answer("I could help solve your goblin problem",
                                                new Convo("If thou could rid us of the goblins and survive, I'd reward thee with the Badge of Heroism. " +
                                                    "It is a part of becoming a Hero of the Circuit - a title revered in all of Arkona!", "VOLN_MEDAL")
                                                    .answer("That sounds great! I'll do it.",
                                                        new Convo("Thou art valiant indeed! Return to me when the goblins of Thornperil are dead.", "",
                                                            (arkona) => arkona.gameState["QUEST_URGIL"] = true)
                                                            .answer("Which way lies their fortress again?", "VOLN_GOBLIN_FORT")
                                                            .answer("See you soon")
                                                    )
                                                    .answer("How about some money instead of a lousy medal?",
                                                        new Convo("If thou art interested in gold, perhaps speak with Encat the merchant. He's looking to hire " +
                                                            "an enterprising mercenary.")
                                                            .answer("I just might! See ya.")
                                                            .answer("I changed my mind - tell me about the medal again", "VOLN_MEDAL")
                                                    )
                                            )
                                    )
                                    .answer("That sounds scary... maybe next time")
                            )
                            .answer("I'm not surprised. Why would anyone be stupid enough to enter the Raighd?")
                    )
            )
            .answer("I'm glad for that. So everything has been peaceful lately?",
                new Convo("Aye, apart from that accursed goblin fort to the west.")
                    .answer("Tell me about this fort")
                    .answer("Interesting... well, I must be going")
            )
    )
    .answer("Nice place. Do you have any work for an adventuring type?", "VOLN_GOBLIN_FORT")
)
