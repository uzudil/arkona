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
                new Convo("Mayor Gratt manages our town. She decides who is allowed into the Raighd. " +
                    "If thou art looking for work, thou should ask if she needs anything done.", "VOLN_COMMON_GRATT")
                    .answer("What is the Raighd?", "VOLN_COMMON_RAIGHD")
                    .answer("I will look her up, thanks.")
                    .answer("Anything else notable about this town?", "VOLN_COMMON")
            )
            .answer("What does Kat sell at the Wyvern?")
            .answer("Tell me about this Hermit.")
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
    .answer("Tell me about your town", "VOLN_COMMON")

export const KAT = new Convo("What'll it be dear? Ale or wine?")
    .answer("Tell me about your town", "VOLN_COMMON")

export const MAYOR = new Convo("Ah a stranger in our town. What brings thee to Voln, traveler?")
    .answer("Tell me about your town", "VOLN_COMMON")
