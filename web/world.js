// PacTerminus world: Pacifica Christian High School, Santa Monica.
// All story text lives here. Edit freely; bump `version` when you change the
// map or steps, so saved games restart cleanly instead of breaking.
(function (root) {
  "use strict";

  const HOME = "/main-campus/front-gate";
  const BAG = HOME + "/backpack";

  // Small builders keep the map below readable.
  const dir = (desc, children = {}, extra = {}) => ({ type: "dir", desc, children, ...extra });
  const file = (text, extra = {}) => ({ type: "file", text: text.trim(), ...extra });
  const sign = (text) => file(text, { fixed: "it's fixed to the wall." });
  const person = (text) => file(text, { fixed: "people aren't files you can move around. (Well — here they are, but be polite.)" });

  const MISSION = `"Pacifica Christian High School is a liberal arts high school devoted to teaching
young men and women from all neighborhoods to think critically and wisely, instilling
heartfelt joy and interest in learning, while encouraging lives of faith, character,
and service to the glory of God."`;

  const ANNOUNCEMENTS = `
CHAPEL ANNOUNCEMENTS — read these before you leave!
---------------------------------------------------
Welcome back, Seawolves. Chapel is every week, and everyone comes.
Worship team: practice moves to Tuesday at lunch.
Thank you to everyone who brought food for the Thanksgiving Potluck & Food Drive.
The Wolf Post is looking for writers and photographers. Find an editor at lunch.
Retreat teams will be posted Friday. Start working on your skit now.
Pre-Retreat Team Rally is Thursday after school. Wear your team color.
Reminder: bring a sleeping bag, a water bottle and shoes that can get muddy.
The mud pit is optional. (It is not really optional.)
Lost and found is overflowing. Three hoodies, one trombone, zero excuses.
Faculty–student lunch sign-ups are open. Pick a teacher you haven't had yet.
Homecoming boat dance tickets go on sale soon. The boat leaves from Marina del Rey.
Cultural Heritage Festival volunteers: meet in the commons on Monday.
The Ugly Sweater Christmas Party committee needs ugly sweaters. Very ugly.
i.Sight auditions for music, dance, theater and spoken word open next month.
Science Olympiad: the STEM lab is open late on Wednesdays.
Seawolf Vets Luncheon: write a thank-you card for a veteran in the library.
Last seen: the Pacifica Cup was taken from the trophy shelf to the library for a photo.
Please return library books to the cart, not the floor.
Prayer requests can go in the box by the door. Someone reads every one.
Parking on 18th Street is for drop-off only. Walk, bike or ride when you can.
Students moving between campuses: stay together and use the crosswalks on Wilshire.
"Think and live well." See you next week.
`;

  const fs = dir("Santa Monica. The Pacific Ocean is 18 blocks west.", {
    "main-campus": dir(
      "Main Campus, 18th Street. Students cross the courtyard between classes, and someone is always laughing.",
      {
        "front-gate": dir("The front gate on 18th Street. This is home base: cd ~ always brings you back here.", {
          "welcome.txt": sign(`
WELCOME TO PACIFICA CHRISTIAN HIGH SCHOOL
1730 Wilshire Boulevard, Santa Monica · Founded 2005 · First graduates 2008
"Forged in the City. Formed by Christ. Ready for the World."

Every place here is a folder, and every thing is a file. Your computer works the same way.
You are in the front-gate folder. Main Campus is the folder *around* it.

To step out of a folder into the one around it, use:   cd ..
`),
          backpack: dir("Your backpack. Things you carry live here.", {
            "lunch.txt": file("A turkey sandwich and an apple. Lunch with a teacher is a Pacifica tradition.", { keep: "you'll want that at lunch." }),
          }),
        }),
        "front-office": dir("The front office. Phones ring, someone offers you a granola bar, and the Head of School's door is open.", {
          "note-from-mr-knight.txt": sign(`
Welcome to Pacifica! I'm Mr. Knight, Head of School.

We have a problem. The Pacifica Cup — the trophy every retreat team competes for —
is missing, and the All-School Retreat is this week. No Cup, no competition.

I hear you're new. New eyes see things the rest of us walk past.
Will you find it and bring it back to this office?

Take the retreat map on my desk. It shows where to start.

                                               — James M. Knight, Head of School
`),
          "retreat-map.txt": file(`
RETREAT CHECKLIST (unofficial, written in pencil)
1. Chapel — the announcements always say where things went.
2. Philosophy & Theology — ask a good question before you go looking.
3. STEM lab — somebody there fixes everything.
Main Campus is 18th Street. Seawolf Campus is 20th Street. Wilshire connects them.
`, { keep: "you'll need the map. Keep it." }),
          "mission.txt": sign("OUR MISSION\n" + MISSION),
        }),
        chapel: dir("The chapel. Every week the whole school gathers here to pray, sing, and hear a short message.", {
          "announcements.txt": sign(ANNOUNCEMENTS),
          "prayer-box.txt": sign("A wooden box for prayer requests. Someone reads every one."),
        }),
        library: dir("The library. Quiet, sunny, and full of the Great Conversation: the thinkers who came before us.", {
          "book-cart.txt": sign("A cart of returned books: Plato, Augustine, Austen, Lewis, a calculus textbook with a coffee ring."),
          "trophy-shelf.txt": sign("An empty spot on the trophy shelf, with a little dust outline of a cup."),
          ".torn-page.txt": file(`
A torn page, tucked behind the trophy shelf where nobody would see it:

  "Photo done! Took the Cup to the STEM lab to fix the wobbly handle.
   Ask about it in Philosophy & Theology first — you'll know why."
`, { keep: "it's a clue. Keep it." }),
        }),
        "philosophy-theology": dir(
          "The Pacifica Center for Philosophy + Theology. Chairs in a circle. A sign: Intellectual Hospitality · Leisure in Learning · Socratic Method · Creative Opposition.",
          {
            "socrates.txt": person(`
A marble bust of Socrates sits on the shelf. Someone gave him sunglasses.

"You are looking for a cup. Good. But do you know what you are really looking for?
 At Pacifica we learn HOW to think, not WHAT to think. A good question is worth keeping.

 Make a folder in your backpack to keep your questions:   mkdir ~/backpack/questions
 Then copy my question into it:   cp big-question.txt ~/backpack/questions
 Copy, don't take — the next student needs it too."
`),
            "big-question.txt": file(`
THE BIG QUESTION
What does it mean to think and live well?
(Keep this one. You'll be asked it again, in a hundred different ways, for four years.)
`, { fixed: "copy it with cp. The next student needs it too." }),
          }
        ),
        "stem-lab": dir("The STEM lab. Goggles on hooks, a hydrogen car on the bench, and a whiteboard that says ENGINEERING WEEK in three colors.", {
          "hydrogen-car.txt": sign("A model hydrogen car, built for the Hydrogen Car Competition. Its sticker says: SEAWOLF SPEED."),
          "lab-notebook.txt": sign(`
LAB NOTEBOOK — Mr. Eno

Fixed the handle on the Pacifica Cup (superglue + patience).
PACARTS borrowed it for an i.Sight set piece, so it went to the art studio
on Seawolf Campus, over on 20th Street.

Seawolf Campus isn't inside Main Campus, so cd seawolf-campus won't work from here.
Use the full path, starting from the very top (/):

    cd /seawolf-campus/art-studio
`),
        }),
      }
    ),
    "wilshire-blvd": dir("Wilshire Boulevard. Upperclassmen walk between campuses here all day.", {
      "cafe.txt": sign("A café on Wilshire. Seniors grab coffee here between classes. It smells like cinnamon."),
      "crosswalk.txt": sign("Look both ways. Then look again. Seawolves travel in packs."),
    }),
    "seawolf-campus": dir("Seawolf Campus, 20th Street. Both campuses are busy all day.", {
      commons: dir("The commons. The Associated Student Government is planning Homecoming & Spirit Week.", {
        "asg-flyer.txt": sign("SPIRIT WEEK: theme days, faculty vs. students games, the boat dance. We are the Wolfpack!"),
        "mmm-poster.txt": sign("MOVIES, MUNCHIES & MADNESS (\"Triple M\") — the first Friday night of the year. Mystery movie."),
      }),
      "art-studio": dir("The art studio. Paint everywhere, a half-built i.Sight set, and music playing. Over 70% of students take part in i.Sight.", {
        "isight-set.txt": sign("A cardboard stage set for i.Sight: a lighthouse, a wave, and an empty spot labeled CUP GOES HERE."),
        "cardboard-boxes": file("A tower of empty cardboard boxes, stacked right in front of the storage closet.", {
          keep: "the art teacher says leave the boxes alone for now.",
        }),
        "storage-closet": dir("The storage closet. Paint cans, extension cords, and a dusty spotlight.", {}, {
          locked: "cd: storage-closet: a tower of cardboard-boxes is blocking the door.",
        }),
      }),
    }),
    pier: dir("The Santa Monica Pier, 18 blocks west of campus. The Pacific is huge today. (You walked a long way.)", {
      "ocean.txt": sign("Waves, gulls, and the Ferris wheel. Creation is beautiful. Now get back to class!"),
    }),
  });

  // ---- step checks --------------------------------------------------------------
  const ran = (name) => (ev) => ev.cmd === name && ev.ok;
  const catOf = (path) => (ev, g) => ev.cmd === "cat" && ev.ok && ev.args.some((a) => g.abs(a) === path);
  const lsOf = (path, flag) => (ev, g) =>
    ev.cmd === "ls" && ev.ok && (!flag || ev.args.includes(flag)) &&
    g.abs(ev.args.find((a) => !a.startsWith("-")) || ".") === path;
  const at = (path) => (ev, g) => g.cwd() === path;
  const has = (path) => (ev, g) => g.exists(path);

  const steps = [
    { chapter: "Chapter 1 · First Bell",
      goal: "Look around. Type ls and press Enter.",
      hint: "ls lists everything in the place you're in. Just type: ls",
      check: ran("ls"),
      done: "Those are the things here. Names ending in / are places (folders); the rest are files." },
    { goal: "Read the welcome sign:  cat welcome.txt",
      hint: "cat shows what a file says. Type cat, a space, then the file name: cat welcome.txt  (Tip: type cat w and press Tab.)",
      check: catOf(HOME + "/welcome.txt") },
    { goal: "Where are you, exactly? Type pwd.",
      hint: "pwd means print working directory. It shows your full location, starting from the top (/).",
      check: ran("pwd"),
      done: "That's your address: you're in front-gate, inside main-campus, inside / (the top)." },

    { chapter: "Chapter 2 · Main Campus",
      goal: "Step out of the gate onto Main Campus:  cd ..",
      hint: "Two dots mean the folder around you. Type: cd ..",
      check: at("/main-campus") },
    { goal: "Look around with ls, then go to the front office:  cd front-office",
      hint: "From main-campus, type: cd front-office",
      check: at("/main-campus/front-office") },
    { goal: "Mr. Knight left you a note. Read it.",
      hint: "Use ls to see the files, then cat the note: cat note-from-mr-knight.txt",
      check: catOf("/main-campus/front-office/note-from-mr-knight.txt") },

    { chapter: "Chapter 3 · Pack Your Bag",
      goal: "Put the map in your backpack:  mv retreat-map.txt ~/backpack",
      hint: "mv moves a file. ~ means your home (the front gate), so ~/backpack is your backpack from anywhere. Type: mv retreat-map.txt ~/backpack",
      check: has(BAG + "/retreat-map.txt"),
      done: "Packed. ~ is a shortcut for home, so ~/backpack works no matter where you are." },
    { goal: "Check what you're carrying:  ls ~/backpack",
      hint: "ls can look inside another place without going there: ls ~/backpack",
      check: lsOf(BAG) },
    { goal: "Read the map:  cat ~/backpack/retreat-map.txt",
      hint: "cat works with a path too: cat ~/backpack/retreat-map.txt",
      check: catOf(BAG + "/retreat-map.txt") },

    { chapter: "Chapter 4 · Chapel",
      goal: "Go to the chapel. From here it's up one, then in:  cd ../chapel",
      hint: "../chapel means: go up to main-campus, then into chapel. If you're lost, cd /main-campus/chapel always works.",
      check: at("/main-campus/chapel") },
    { goal: "The announcements are long. Find the line about the Cup:  grep Cup announcements.txt",
      hint: "grep shows only the lines that contain a word. Capital C matters! Type: grep Cup announcements.txt",
      check: (ev, g) => ev.cmd === "grep" && ev.ok && ev.args.some((a) => g.abs(a) === "/main-campus/chapel/announcements.txt"),
      done: "grep saves you reading a hundred lines. Next stop: the library." },

    { chapter: "Chapter 5 · Library",
      goal: "Go to the library and look around.",
      hint: "Type cd ../library, then ls",
      check: lsOf("/main-campus/library") },
    { goal: "No Cup. But some names are hidden: they start with a dot. Try:  ls -a",
      hint: "-a means all. Type: ls -a",
      check: lsOf("/main-campus/library", "-a"),
      done: "Hidden files are everywhere on a real computer, too. Settings usually hide that way." },
    { goal: "Read the torn page.",
      hint: "Don't forget the dot: cat .torn-page.txt",
      check: catOf("/main-campus/library/.torn-page.txt") },

    { chapter: "Chapter 6 · Philosophy & Theology",
      goal: "Go to Philosophy & Theology and read socrates.txt",
      hint: "cd ../philosophy-theology  then  cat socrates.txt",
      check: catOf("/main-campus/philosophy-theology/socrates.txt") },
    { goal: "Make a folder for questions:  mkdir ~/backpack/questions",
      hint: "mkdir makes a new folder. Type: mkdir ~/backpack/questions",
      check: (ev, g) => g.exists(BAG + "/questions") && g.get(BAG + "/questions").type === "dir" },
    { goal: "Copy the big question into it:  cp big-question.txt ~/backpack/questions",
      hint: "cp copies; the original stays. Type: cp big-question.txt ~/backpack/questions",
      check: has(BAG + "/questions/big-question.txt"),
      done: "Socrates nods (as much as marble can). \"Now go find your cup.\"" },

    { chapter: "Chapter 7 · STEM Lab",
      goal: "Go to the STEM lab and read the lab notebook.",
      hint: "cd ../stem-lab  then  cat lab-notebook.txt",
      check: catOf("/main-campus/stem-lab/lab-notebook.txt") },
    { goal: "Cross to Seawolf Campus with a full path:  cd /seawolf-campus/art-studio",
      hint: "A path that starts with / starts from the very top, so it works from anywhere: cd /seawolf-campus/art-studio",
      check: at("/seawolf-campus/art-studio"),
      done: "You walked down Wilshire to 20th Street. A path starting with / works from anywhere." },

    { chapter: "Chapter 8 · Art Studio",
      goal: "The Cup must be in the storage closet. Try to go in.",
      hint: "Type: cd storage-closet",
      check: (ev) => ev.cmd === "cd" && (ev.args[0] || "").replace(/\/$/, "") === "storage-closet" },
    { goal: "Clear the boxes out of the way:  rm cardboard-boxes",
      hint: "rm removes a file for good. There's no trash can and no undo, so always check the name first. Type: rm cardboard-boxes",
      check: (ev, g) => !g.exists("/seawolf-campus/art-studio/cardboard-boxes"),
      onStart: (fs) => {
        const boxes = fs.children["seawolf-campus"].children["art-studio"].children["cardboard-boxes"];
        if (boxes) delete boxes.keep;
      },
      onDone: (fs) => {
        const studio = fs.children["seawolf-campus"].children["art-studio"];
        studio.children["storage-closet"].locked = null;
        studio.children["storage-closet"].children["pacifica-cup"] = {
          type: "file", keep: "rm is forever. You can't delete the Pacifica Cup!",
          text: "THE PACIFICA CUP. Silver, a little scratched, handle freshly glued. Names of every winning retreat team are engraved around the base.",
        };
      },
      done: "Gone for good: that's what rm does. The closet door swings open." },
    { goal: "Go into the storage closet and look around.",
      hint: "cd storage-closet  then  ls",
      check: lsOf("/seawolf-campus/art-studio/storage-closet"),
      done: "There it is, behind a spotlight. The Pacifica Cup!" },

    { chapter: "Chapter 9 · Homecoming",
      goal: "Send the Cup to Mr. Knight's office in one move:  mv pacifica-cup /main-campus/front-office",
      hint: "mv can move a file to any place by its full path. Type: mv pacifica-cup /main-campus/front-office",
      check: has("/main-campus/front-office/pacifica-cup") },
  ];

  const intro = `
 ____             _____                   _
|  _ \\ __ _  ___ |_   _|__ _ __ _ __ ___ (_)_ __  _   _ ___
| |_) / _\` |/ __|  | |/ _ \\ '__| '_ \` _ \\| | '_ \\| | | / __|
|  __/ (_| | (__   | |  __/ |  | | | | | | | | | | |_| \\__ \\
|_|   \\__,_|\\___|  |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|___/

Welcome to Pacifica, Seawolf.

This computer listens to typed commands. Learn a few, finish the quest,
and the rest of your computer unlocks: Canvas, Omawrite, Omacalc and Desmos.

Stuck? Type hint. Forgot a command? Type help.`;

  const ending = `
━━ Quest complete ━━
Mr. Knight sets the Pacifica Cup back on the trophy shelf.

"You found it. More than that: you learned your way around. That's what we hope
for every student here — to be known, to be mentored, and to be prepared.
The retreat starts Friday. Welcome to the Wolfpack."

You learned: ls, cat, pwd, cd, mv, cp, mkdir, rm, grep, hidden files, ~ and full paths.`;

  root.PacTerminusWorld = () => ({
    version: 1,
    home: HOME,
    fs: JSON.parse(JSON.stringify(fs)),
    steps,
    intro,
    ending,
    welcomeBack: "Welcome back, Seawolf. Picking up where you left off.",
  });
})(typeof window !== "undefined" ? window : globalThis);
