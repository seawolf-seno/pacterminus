// Plays the whole game through the engine and checks it finishes. Run: node test/playthrough.mjs
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const web = new URL("../web/", import.meta.url);
for (const f of ["engine.js", "world.js"]) (0, eval)(readFileSync(new URL(f, web), "utf8"));

const game = globalThis.PacTerminus.createGame(globalThis.PacTerminusWorld, { user: "test29" });
game.begin();
const script = [
  "ls", "cat welcome.txt", "pwd", "cd ..", "ls", "cd front-office", "cat note-from-mr-knight.txt",
  "rm retreat-map.txt", // refused, map is kept
  "mv retreat-map.txt ~/backpack", "ls ~/backpack", "cat ~/backpack/retreat-map.txt",
  "cd ../chapel", "grep Cup announcements.txt",
  "cd ../library", "ls", "ls -a", "cat .torn-page.txt",
  "cd ../philosophy-theology", "cat socrates.txt", "mkdir ~/backpack/questions",
  "cp big-question.txt ~/backpack/questions",
  "cd ../stem-lab", "cat lab-notebook.txt", "cd /seawolf-campus/art-studio",
  "cd storage-closet", "rm cardboard-boxes", "cd storage-closet", "ls",
  "rm pacifica-cup", // refused
  "mv pacifica-cup /main-campus/front-office",
];
let lastOut;
for (const cmd of script) {
  const before = game.progress().step;
  lastOut = game.run(cmd);
  console.log(`${String(before).padStart(2)} $ ${cmd}`);
}
assert.ok(game.isComplete(), "game should be complete, stuck at: " + game.goal());
assert.ok(lastOut.some((l) => l.complete), "completion signal");
// Save/restore round trip.
const again = globalThis.PacTerminus.createGame(globalThis.PacTerminusWorld, { save: game.save() });
assert.ok(again.isComplete());
// Tab completion.
const g2 = globalThis.PacTerminus.createGame(globalThis.PacTerminusWorld, {});
g2.begin();
assert.equal(g2.complete("cat wel").line, "cat welcome.txt ");
assert.equal(g2.complete("cd back").line, "cd backpack/");
assert.ok(g2.run("cd /nowhere")[0].cls === "err");
assert.ok(g2.run("rm -r /main-campus")[0].text.includes("demolish"));
console.log("OK: finished in", script.length, "commands");
