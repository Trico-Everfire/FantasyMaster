const RACES = {
    HUMAN: "human",
    KOBOLD: "kobold",
    ELF: "elf",
    HALFELF: "half elf",
    ORC: "orc",
    DWARF: "dwarf",
    GNOME: "gnome",
    HALFLING: "halfling",
    HALFORC: "half orc",
    LIZARDFOLK: "lizard folk",
    DRAGONBORN: "dragonborn",
    STARDUSTSPHINX: "stardust sphinx",
    SKYFOLK: "sky folk"
}

const RACEDESCRIPTIONS = {
    HUMAN: `Most humans are the descendants of pioneers, conquerors, traders,
    travelers, refugees, and other people on the move. As a result,
    human lands are home to a mix of people—physically, culturally,
    religiously, and politically different. Hardy or fine, light-skinned or
    dark, showy or austere, primitive or civilized, devout or impious,
    humans run the gamut.`,
    KOBOLD: `Kobolds are dragon like creatures, Kobolds usually worship dragons or are send out by dragons to extend their hoard.
    some live peacefully in towns as shopkeeps, others roam dungeons and roads in the hopes of finding what their dragon lord wants.`,
    ELF: `Elves mingle freely in human lands, always welcome yet never at
    home there. They are well known for their poetry, dance, song, lore,
    and magical arts. Elves favor things of natural and simple beauty.
    When danger threatens their woodland homes, however, elves
    reveal a more martial side, demonstrating skill with sword, bow, and
    battle strategy.`,
    HALFELF: `Humans and elves sometimes wed, the elf attracted to the human's
    energy and the human to the elf's grace. These marriages end
    quickly as elves count years because a human's life is so brief, but
    they leave an enduring legacy—half-elf children.`,
    ORC: `The orc race survives in a vicious cycle of Malthusian principles. 
    While their population continues to grow exponentially, their territory, 
    food, and other resources can only appreciate linearly (if they increase at all). 
    Huge breeding numbers, fast maturation time, 
    and a massive gender disparity cause the orcs to forcibly kick out their adolescent (but still battle-ready) males at age eleven.`,
    DWARF: `Dwarves are known for their skill in warfare, their ability to with-
    stand physical and magical punishment, their knowledge of the
    earth’s secrets, their hard work, and their capacity for drinking ale.
    Their mysterious kingdoms, carved out from the insides of moun-
    tains, are renowned for the marvelous treasures that they produce as
    gifts or for trade.`,
    GNOME: `Gnomes are welcome everywhere as technicians, alchemists, and
    inventors. Despite the demand for their skills, most gnomes prefer
    to remain among their own kind, living in comfortable burrows
    beneath rolling, wooded hills where animals abound.`,
    HALFLING: `Halflings are clever, capable opportunists. Halfling
    individuals and clans find room for themselves
    wherever they can. Often they are strangers and
    wanderers, and others react to them with suspicion
    or curiosity. Depending on the clan, halflings might
    be reliable, hard-working (if clannish) citizens, or
    they might be thieves just waiting for the
    opportunity to make a big score and disappear in the
    dead of night. Regardless, halflings are cunning,
    resourceful survivors.`,
    HALFORC: `In the wild frontiers, tribes of human and orc barbarians live in
    uneasy balance, fighting in times of war and trading in times of
    peace. Half-orcs who are born in the frontier may live with either
    human or orc parents, but they are nevertheless exposed to both
    cultures. Some, for whatever reason, leave their homeland and travel
    to civilized lands, bringing with them the tenacity, courage, and
    combat prowess that they developed in the wilds.`,
    LIZARDFOLK: `Lizardfolk were semi-aquatic reptilian humanoids.
    Their skin was covered in scales and varied in color from dark green through to shades of brown and gray. 
    Taller than humans and powerfully built, lizardfolk were often between 6 and 7 feet (1.8–2.1 m) tall
    and weighed between 200 and 250 pounds (90.7–113 kg).
    Lizardfolk had non-prehensile muscular tails that grew to three or four feet in length,
    and these were used for balance.
    They also had sharp claws and teeth.`,
    STARDUSTSPHINX: `hee hee sphinx go brrr`,
    DRAGONBORN: `Dragonborn are bipedal creatures, 
    resembling a dragon in humanoid form. 
    They typically stand almost 6½ feet tall and are strongly built, 
    weighing over 300 pounds. 
    Unlike true dragons, they do not have wings or a tail, 
    although there are individual exceptions to this.`
}

const CLASSES = {
    BARBARIAN: "barbarian",
    BARD: "bard",
    CLERIC: "cleric",
    DRUID: "druid",
    FIGHTER: "fighter",
    MONK: "monk",
    PALADIN: "paladin",
    RANGER: "ranger",
    ROGUE: "rogue",
    SORCERER: "sorcerer",
    WIZARD: "wizard",
    HEALER: "healer"
}

Object.freeze(RACES);
Object.freeze(CLASSES);

exports.RACES = RACES;
exports.CLASSES = CLASSES;
exports.RACEDESCRIPTIONS = RACEDESCRIPTIONS;