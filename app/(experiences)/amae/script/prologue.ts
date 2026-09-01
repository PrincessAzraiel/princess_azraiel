// AMAE. All characters are adults. The backstory begins at university (he is
// nineteen when they meet, thirty in the present day). Nothing in this series is
// to depict anyone under eighteen; keep every flashback at university or later.

import { Day } from "../engine/types";

export const prologue: Day = {
  id: "prologue",
  label: "第〇課 · LESSON ZERO",
  jp: "やさしいこと",
  title: "SOMETHING KIND",
  start: "before",
  scenes: {
    /* ---------- the corridor ---------- */
    before: {
      place: "before any of this",
      beats: [
        { t: "memory", text: "She spoke another language." },
        { t: "memory", text: "Not at home; her family were as local as yours. She went and got it, on purpose, in her second year of the degree, the way other people took up climbing or a religion." },
        { t: "memory", text: "And then she taught her friends a handful of it. Not sentences. Six or seven words, drilled until they were automatic, which is exactly as many as you need." },
        { t: "pause" },
        { t: "memory", text: "They used them on you in the corridor. For four years, the whole of the degree. Two syllables, mostly, thrown at your back, and the laugh that came after it: a small clean laugh, like a coin dropped on a table." },
        { t: "memory", text: "One of them came up more than the others. You would know it anywhere. You could pick it out of a crowded room today, at thirty years old, and your stomach would go through the floor before your brain caught up." },
        { t: "memory", text: "You never found out what it meant. You never even established what language it was. That campus was two hundred miles from anywhere, and the library had one shelf of atlases, and there was nobody in forty miles to ask, and this was before you could simply hold a phone up to a sound." },
        { t: "pause" },
        { t: "memory", text: "You asked her once. Just once, and it took you a week to work up to it." },
        { t: "memory", text: "She thought about it for a moment. She was not cruel about it, which is the part you have never been able to file properly. She thought about it seriously, and then she told you it was something kind." },
        { t: "memory", text: "You have believed her for eleven years. Not stupidly. You know what it probably was. You have simply chosen, every day for eleven years, to take the version she gave you, because the other version is a thing you would then have to have lived through." },
        { t: "pause" },
        { t: "memory", text: "At twenty-six, three years after you both graduated, she started answering for you. Ordering your food, telling people what you thought. There was never a question, so there was never a yes; somebody called her your girlfriend and she did not correct them, and that was the entire courtship." },
        { t: "memory", text: "Your friends asked why she was with you. Worried, not cruel, which was worse. You had no answer, so you stopped seeing the ones who asked, and then the others, because it was easier than explaining the pattern." },
        { t: "pause" },
        { t: "memory", text: "In eleven years she has never asked you for anything. Then, in October, she asked you for one thing." },
        { t: "narration", text: "Come with me. Three months. My grandmother's house is empty and someone has to air it out." },
        { t: "narration", text: "You said yes before she finished the sentence. You would have said yes to anything. That is not a thing she did to you. You brought that with you, fully formed, at nineteen, and handed it over." },
      ],
      next: "road",
    },

    /* ---------- the road up ---------- */
    road: {
      place: "the valley road",
      time: "late afternoon",
      beats: [
        { t: "narration", text: "The train ran out of names for its stops, and then it ran out of stops." },
        { t: "narration", text: "She met you at the last one in a borrowed truck with a cracked windscreen and drove ninety minutes up into a valley while the map on your phone redrew itself, and redrew itself, and then stopped redrawing itself." },
        { t: "system", text: "圏外 · no service" },
        { t: "her", text: "Give me that." },
        { t: "narration", text: "You hand it over. It goes in the door pocket with a roll of tape and somebody's sunglasses. She does not look at you while she takes it and she does not say thank you, and neither omission is an accident." },
        { t: "dep", by: 3, note: "you handed it over" },
        { t: "pause" },
        { t: "narration", text: "Rice terraces cut and flooded for the winter. A shrine gate the colour of dried blood, leaning downhill. Cedar close enough on both sides to touch. No other car for forty minutes." },
        { t: "narration", text: "Every sign you pass is a shape. Not a word you have failed to read. A shape, the way a fence is a shape. There is no handhold on any of it anywhere." },
        { t: "narration", text: "It is here, somewhere between the fourth switchback and the fifth, that you understand what she has spent eleven years being fluent in, and where. You have been driving through it for an hour." },
        { t: "her", text: "Forty houses. Sixty-one people. The youngest is a man of fifty-four who is not well. No doctor, no police box, no station." },
        { t: "her", text: "And nobody up here has a word of English. Not one. I checked. I actually sat down and checked." },
        { t: "narration", text: "She says it the way other people say the weather looks like it might hold, and she does not look over to see how you took it. She has known how you would take it since you were nineteen." },
      ],
      next: "gate",
    },

    /* ---------- the first withholding ---------- */
    gate: {
      place: "the gate of the old house",
      time: "dusk",
      beats: [
        { t: "narration", text: "A woman is waiting at the gate. Eighty, maybe. Boots, an apron, a back bent into a comma by sixty winters of this exact hill." },
        {
          t: "jp",
          who: "the woman at the gate",
          jp: "「あら、おかえり。……この人が、例の?」",
          romaji: "Ara, okaeri. ...Kono hito ga, rei no?",
          her: "She says welcome home, and asks if you're the friend I mentioned.",
          truth: "Oh, you're back. …So this is the one.",
          guess: [
            "Hello again. Is this the man who telephoned about the roof?",
            "You're early. Is he coming inside or isn't he?",
          ],
        },
        { t: "her", text: "Bow. Lower than that." },
        { t: "narration", text: "You bend at the waist and hold it, and the blood comes into your face, and the body understands before the mind does: here, you are a thing that gets described. Not a thing that speaks." },
        {
          t: "jp",
          who: "the woman at the gate",
          jp: "「あらまあ、細いねえ。ちゃんと食べさせてあげてね。」",
          romaji: "Aramaa, hosoi nee. Chanto tabesasete agete ne.",
          her: "She says you have a kind face.",
          truth: "Goodness, he's thin. Make sure you feed him properly.",
          guess: [
            "What a long way you've come. You must both be exhausted.",
            "He's tall, isn't he. Mind his head on the beam.",
          ],
        },
        { t: "narration", text: "The old woman says one more thing. It is longer than the others. She looks at you the whole time she says it, then at the woman beside you, and waits." },
        {
          t: "silence",
          who: "the woman at the gate",
          jp: "「……ねえ。あの子、なんにもわからないの? ほんとうに、なんにも?」",
          romaji: "...Nee. Ano ko, nanni mo wakaranai no? Hontō ni, nanni mo?",
          truth: "…Tell me. He doesn't understand anything? Truly, nothing at all?",
        },
        { t: "narration", text: "You wait for it. You stand there with your face open like a dog at a door and you wait to be told what was just said about you." },
        { t: "narration", text: "She lets it sit. Four seconds. Five. Long enough that the old woman looks away first, embarrassed for you." },
        { t: "her", text: "Nothing. It wasn't about you." },
        { t: "narration", text: "It was about you. You watched it be about you." },
        { t: "dep", by: 4, note: "you accepted nothing as an answer" },
        { t: "favour", by: 1 },
      ],
      next: "house",
    },

    /* ---------- the passport ---------- */
    house: {
      place: "the old house",
      time: "evening",
      beats: [
        { t: "narration", text: "The house is bigger than it looked and colder than outside. Dirt-floored entry, a step up to boards worn silver, two hundred years of woodsmoke in the beams. One room has a kerosene heater. The rest have weather." },
        { t: "narration", text: "Your bag is where you set it down. She has not offered to carry anything and you have not asked, and that is how it has been for four years." },
        { t: "her", text: "Passport." },
        { t: "narration", text: "Not a question. Her hand is out, palm up, flat, the way you hold a hand out for keys you are owed." },
      ],
      choices: [
        { text: "Put it in her hand.", goto: "passport_taken", dep: 3, favour: 1 },
        {
          text: "Ask what she needs it for.",
          goto: "passport_asked",
          dep: 5,
          favour: -2,
          absentIf: "stopped_asking",
          hint: "you are going to hand it over anyway",
        },
      ],
    },

    passport_asked: {
      place: "the old house",
      time: "evening",
      beats: [
        { t: "narration", text: "You ask. Your voice does the thing it does, going up at the end, turning the question into a request for permission to have asked it." },
        { t: "narration", text: "She does not answer." },
        { t: "narration", text: "She keeps her hand exactly where it is. She does not lower it, does not sigh, does not repeat herself. She looks at you with mild patient interest, the way you would look at a machine that has made an unexpected noise but is probably fine." },
        { t: "narration", text: "It takes you nine seconds. You count them later, lying in the dark. Nine." },
        { t: "her", text: "There. Was that so much work?" },
        { t: "favour", by: -1 },
      ],
      next: "passport_taken",
    },

    passport_taken: {
      place: "the old house",
      time: "evening",
      beats: [
        { t: "narration", text: "She puts it in the drawer of the low chest by the alcove. The drawer runs on wood, not rollers, and closes with a sound like a held breath let out slowly." },
        { t: "system", text: "there is no lock on the drawer. that is worse, and you both know it." },
        { t: "pause" },
        { t: "narration", text: "There is one outlet in the room where you will sleep. Your charger is not in your bag. You look for it for eleven minutes before you understand that it is not lost." },
      ],
      choices: [
        { text: "Ask her for it.", goto: "charger_asked", dep: 6, favour: 2, hint: "she likes being asked" },
        { text: "Say nothing. Let the phone die.", goto: "charger_unasked", dep: 2, favour: -1 },
      ],
    },

    charger_asked: {
      place: "the old house",
      time: "evening",
      beats: [
        { t: "narration", text: "You ask, and you hear yourself put a small laugh in front of it to make it lighter, to make it easier for her to say yes, and the laugh comes out of you at nineteen years old." },
        { t: "her", text: "Mm. It's in the kitchen." },
        { t: "narration", text: "She does not get it. She does not say where in the kitchen. She goes back to what she was doing and the sentence lies there between you like something dropped, and you understand the shape of things now: she has given you permission, which is not the charger, and the gap between the two is the entire architecture." },
        { t: "narration", text: "You find it forty minutes later in a drawer with the coffee. Behind the coffee." },
      ],
      next: "coffee",
    },

    charger_unasked: {
      place: "the old house",
      time: "evening",
      beats: [
        { t: "narration", text: "You say nothing. You put the phone face down on the tatami at eleven percent and tell yourself that was a decision you made." },
        { t: "narration", text: "She notices. Of course she notices; it is the only thing in the house worth noticing tonight." },
        { t: "her", text: "You're sulking. It's fine. It'll still be in the kitchen tomorrow. And the day after." },
        { t: "narration", text: "She has made waiting into something you chose. It is not yet eight o'clock on the first night." },
      ],
      next: "coffee",
    },

    /* ---------- the thing she loves ---------- */
    coffee: {
      place: "the kitchen",
      time: "nine in the evening",
      beats: [
        { t: "narration", text: "At nine she makes coffee, and you watch her do it because there is nothing else in this house to look at." },
        { t: "narration", text: "She has brought equipment. In a bag, up a mountain, to a house with no heating, for three months: a hand grinder, a gooseneck kettle, a small scale, and one cup with a chip out of the rim that she has had for as long as you have known her." },
        { t: "narration", text: "She did not pack a second cup." },
        { t: "pause" },
        { t: "narration", text: "It takes her four and a half minutes and she does not vary any of it. Eighteen grams. Forty turns of the grinder, and she counts them under her breath in the other language. The kettle comes off the boil and she waits fifty seconds; you time it later, at the sink, without deciding to. Then she wets the grounds and lets it sit while it swells, and only then does she pour, in circles, from the middle out." },
        { t: "narration", text: "She drinks it standing at the window in the dark, holding the cup in both hands." },
        { t: "narration", text: "It is the only thing you have ever seen her do purely because she likes it." },
        { t: "pause" },
        { t: "narration", text: "You offer to make it tomorrow." },
        { t: "her", text: "No." },
        { t: "her", text: "You'd do it wrong, and then I'd have to drink it." },
        { t: "narration", text: "That is the whole exchange. She is not being unkind. She is being accurate. She goes back to the other room, and the refusal sits in you and starts to itch immediately." },
        { t: "dep", by: 5, note: "she would not let you" },
        { t: "pause" },
        { t: "narration", text: "You will watch her make it every night this week. By Thursday you can say the forty turns along with her, silently, at the right speed. By the following Tuesday you know that the fifty seconds is nearer fifty-five if the window is open." },
        { t: "narration", text: "Nobody has asked you to learn this. Nobody is going to ask you to learn this. She has never once mentioned it again." },
        { t: "narration", text: "And you are going to get so good at it." },
        { t: "dep", by: 4 },
        { t: "flag", set: "watched_coffee" },
      ],
      next: "shelf",
    },

    /* ---------- the shelf ---------- */
    shelf: {
      place: "the back room",
      time: "night",
      beats: [
        { t: "narration", text: "There is a room at the back with a shelf in it, and the shelf is full." },
        { t: "narration", text: "Forty or fifty volumes. Hand-sewn covers gone the colour of weak tea, foxed at the corners, numbered on the spine in ink that has faded unevenly the way ink does over decades. Graded readers. Character drills. A dictionary the size of a paving slab." },
        { t: "her", text: "My grandmother taught in the village school for thirty-one years. Nobody's opened those since she died." },
        { t: "narration", text: "You take one down and it falls open at a ruled page, and the handwriting is beautiful, and there are exercises, and a blank column down the side for the student to copy into." },
        { t: "narration", text: "Three months in a valley where you cannot ask for bread. And here is a shelf." },
        { t: "her", text: "Do what you like. You'll go quietly mad otherwise." },
        { t: "narration", text: "She does not offer to teach you. She does not sit down with you. She takes her coffee back to the other room, and the not-offering is so complete, so entirely without malice, that it does not once occur to you that it is the single most deliberate thing she has done today." },
        { t: "dep", by: 5, note: "you thanked her for the shelf" },
        { t: "pause" },
        { t: "narration", text: "You start that night. Of course you do." },
        { t: "narration", text: "And it is strange, immediately. Not wrong, just strange, the way old schoolbooks are strange. Formal. Repetitive. The example sentences all seem to be about the same two people." },
        {
          t: "read",
          label: "第一課 · lesson one · model sentences",
          jp: "わたくしは、ひとりでは何もできません。\nあの方が、決めてくださいます。\nあの方のおかげで、わたくしは安心しております。",
          romaji: "watakushi wa, hitori de wa nani mo dekimasen. / ano kata ga, kimete kudasaimasu. / ano kata no okage de, watakushi wa anshin shite orimasu.",
          you: "I cannot do anything by myself. That person decides for me. Thanks to that person, I am at peace.",
        },
        { t: "narration", text: "Your reading is correct. That is what it says. You worked it out yourself, character by character, and you got it right, and getting it right feels wonderful." },
        { t: "narration", text: "It is a drill for the humble register. Every beginner's book has one. You copy all three into the blank column, twice, because the second time your hand was neater." },
        { t: "pause" },
        {
          t: "read",
          label: "a note in the margin, in the same hand",
          jp: "※初学者は、意志形（〜しよう）を用いぬこと。無礼にひびく。受身と謙譲を用いよ。",
          romaji: "hajimete manabu mono wa, ishikei o mochiinu koto. burei ni hibiku. ukemi to kenjō o mochiiyo.",
          you: "Note: the beginner should not use the volitional form (“I shall”, “I will”). It sounds rude. Use the passive and the humble.",
        },
        { t: "narration", text: "Sensible. Every language does this. You do not walk into a village announcing your intentions. You underline it, because it is the sort of thing that will come up." },
        { t: "narration", text: "You will study these books for a hundred and some nights. You will get better every week; that part is entirely true. And in all of it you will never once be taught how to say I have decided, or I would rather, or I am going to." },
        { t: "narration", text: "Not forbidden. Never forbidden. Simply never given to you, in a language you can only build out of what you have been given." },
        { t: "dep", by: 6 },
        { t: "pause" },
        { t: "narration", text: "You get to lesson three at about one in the morning, which is the vocabulary list, which is where they put the animals." },
        {
          t: "read",
          label: "第三課 · vocabulary · no. 11",
          jp: "いぬ　【犬】",
          romaji: "inu",
          you: "dog.",
        },
        { t: "narration", text: "Two syllables." },
        { t: "narration", text: "You sit with the book open on your knees in a cold room in a valley of sixty-one people, and you are nineteen years old, and it is the corridor outside the department office, and the coin-drop laugh is going off behind you the way it has gone off in your head roughly once a week for eleven years." },
        { t: "narration", text: "It is on page eleven of the first volume. Not buried. Page eleven, of the first book, on the shelf she pointed you at, in the house she brought you to." },
        { t: "pause" },
        { t: "narration", text: "She is in the doorway with her coffee. You have no idea how long she has been in the doorway." },
        { t: "her", text: "Getting on all right?" },
        { t: "narration", text: "And here is the thing you will think about for the rest of your life, on the first night, before anything has actually happened to you." },
        { t: "narration", text: "You say yes. You say it is great, actually, the books are great. You turn the page." },
        { t: "narration", text: "Because if you say the word out loud, she has to answer it. And she will either lie to you, and you will know, or she will not lie to you, and you will know. And you have spent eleven years keeping something kind alive in a jar, and you are not going to be the one who opens it." },
        { t: "dep", by: 9, note: "you turned the page" },
        { t: "favour", by: 3 },
        { t: "pause" },
        { t: "narration", text: "The heater ticks. Past the gate the valley makes no sound whatsoever. Sixty-one people are asleep within two kilometres of you and not one of them could hear you if you screamed in a language they knew." },
        { t: "narration", text: "You study until three. You are so grateful for the shelf that at one point, alone, you say thank you out loud." },
      ],
      end: {
        title: "LESSON ZERO ENDS",
        lines: [
          "Nobody made you open the book. Nobody is going to have to make you open it tomorrow.",
          "You are genuinely learning. You will get better every week.",
          "You are nineteen years old and you have just asked her what it meant, and she has thought about it seriously, and she has told you it was something kind.",
        ],
        nextHref: "/amae/lesson-one",
        nextLabel: "第一課 · lesson one · 挨拶 · greetings",
      },
    },
  },
};
