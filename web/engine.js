// PacTerminus engine: a tiny pretend file system and shell. No DOM here, so the
// whole game can be played from a test (test/playthrough.mjs).
(function (root) {
  "use strict";

  const COMMANDS = ["ls", "cd", "pwd", "cat", "mv", "cp", "rm", "mkdir", "grep",
    "help", "hint", "man", "clear", "whoami", "history", "restart"];

  const MANUAL = {
    ls: "ls [-a] [place]  List what's here. -a also shows hidden names (they start with a dot).",
    cd: "cd <place>  Move. cd .. goes up one level, cd ~ goes home, cd / goes to the top.",
    pwd: "pwd  Print where you are (your working directory).",
    cat: "cat <file>  Show what a file says.",
    mv: "mv <from> <to>  Move a file into a folder, or rename it.",
    cp: "cp <from> <to>  Copy a file. The original stays where it is.",
    rm: "rm <file>  Remove a file. There is no trash can and no undo.",
    mkdir: "mkdir <name>  Make a new folder.",
    grep: "grep [-i] <word> <file>  Show only the lines that contain <word>. -i ignores upper/lower case.",
    help: "help  List the commands.",
    hint: "hint  Get a nudge on your current goal.",
    man: "man <command>  Show how a command works.",
    clear: "clear  Clear the screen.",
    whoami: "whoami  Print your name.",
    history: "history  Show the commands you've typed.",
    restart: "restart  Start the game over from the beginning.",
  };

  const clone = (x) => JSON.parse(JSON.stringify(x));

  function createGame(makeWorld, opts = {}) {
    const world = makeWorld();
    const user = opts.user || "seawolf";
    let s = opts.save && opts.save.version === world.version ? opts.save : fresh();
    let out = [];
    let confirmRestart = false;

    function fresh() {
      return { version: world.version, fs: clone(world.fs), cwd: world.home, step: 0,
        complete: false, history: [], started: false };
    }

    // ---- paths -----------------------------------------------------------------
    function parts(path) {
      let p = path;
      if (p === "~" || p.startsWith("~/")) p = world.home + p.slice(1);
      const start = p.startsWith("/") ? [] : s.cwd.split("/").filter(Boolean);
      for (const seg of p.split("/")) {
        if (!seg || seg === ".") continue;
        if (seg === "..") start.pop();
        else start.push(seg);
      }
      return start;
    }
    const abs = (path) => "/" + parts(path).join("/");
    function get(path) {
      let node = s.fs;
      for (const seg of parts(path)) {
        if (!node || node.type !== "dir" || !node.children[seg]) return null;
        node = node.children[seg];
      }
      return node;
    }
    function parentOf(path) {
      const p = parts(path);
      const name = p.pop();
      return { dir: get("/" + p.join("/")), name, path: "/" + p.join("/") };
    }
    const pretty = (path) => (path === world.home || path.startsWith(world.home + "/"))
      ? "~" + path.slice(world.home.length) : path;
    const exists = (path) => !!get(path);

    // ---- output ----------------------------------------------------------------
    const say = (text, cls) => { for (const line of String(text).split("\n")) out.push({ text: line, cls }); };
    const err = (text) => say(text, "err");

    // ---- commands --------------------------------------------------------------
    const cmds = {
      ls(args) {
        const all = args.includes("-a");
        const target = args.find((a) => !a.startsWith("-")) || ".";
        const node = get(target);
        if (!node) return err(`ls: ${target}: nothing here by that name`), false;
        if (node.type === "file") return say(target), true;
        const names = Object.keys(node.children).filter((n) => all || !n.startsWith(".")).sort();
        if (!names.length) say(all ? "(empty)" : "(nothing you can see — some names may be hidden)", "dim");
        for (const n of names) say(node.children[n].type === "dir" ? n + "/" : n, node.children[n].type === "dir" ? "dir" : "file");
        return true;
      },
      cd(args) {
        const target = args[0] || "~";
        const node = get(target);
        if (!node) return err(`cd: ${target}: no place by that name. Try ls to see where you can go.`), false;
        if (node.type !== "dir") return err(`cd: ${target}: that's a file, not a place. Try cat ${target}`), false;
        if (node.locked) return err(node.locked), false;
        s.cwd = abs(target);
        if (node.desc) say(node.desc, "desc");
        return true;
      },
      pwd() { say(s.cwd); return true; },
      cat(args) {
        if (!args.length) return err("cat: which file? Example: cat welcome.txt"), false;
        let ok = true;
        for (const a of args) {
          const node = get(a);
          if (!node) { err(`cat: ${a}: no such file`); ok = false; }
          else if (node.type === "dir") { err(`cat: ${a}: that's a place. Try cd ${a}`); ok = false; }
          else say(node.text, "text");
        }
        return ok;
      },
      mv(args) { return moveOrCopy("mv", args, true); },
      cp(args) { return moveOrCopy("cp", args, false); },
      rm(args) {
        const recursive = args.some((a) => /^-[a-z]*r/.test(a));
        const files = args.filter((a) => !a.startsWith("-"));
        if (!files.length) return err("rm: which file? Example: rm junk.txt"), false;
        let ok = true;
        for (const a of files) {
          const node = get(a);
          const { dir, name } = parentOf(a);
          if (!node) { err(`rm: ${a}: no such file`); ok = false; continue; }
          if (node.fixed || node.keep) { err(`rm: ${a}: ${node.keep || "that's part of Pacifica. Leave it be."}`); ok = false; continue; }
          if (node.type === "dir" && !recursive) { err(`rm: ${a}: is a folder (rm only removes files)`); ok = false; continue; }
          if (node.type === "dir" && hasFixed(node)) { err(`rm: ${a}: let's not demolish the campus.`); ok = false; continue; }
          delete dir.children[name];
        }
        return ok;
      },
      mkdir(args) {
        const names = args.filter((a) => !a.startsWith("-"));
        if (!names.length) return err("mkdir: what should the new folder be called?"), false;
        let ok = true;
        for (const a of names) {
          const { dir, name } = parentOf(a);
          if (!dir || dir.type !== "dir") { err(`mkdir: ${a}: the place above it doesn't exist`); ok = false; }
          else if (dir.children[name]) { err(`mkdir: ${a}: already exists`); ok = false; }
          else if (!validName(name)) { err(`mkdir: ${a}: use letters, numbers, dashes or dots`); ok = false; }
          else dir.children[name] = { type: "dir", children: {} };
        }
        return ok;
      },
      grep(args) {
        const flags = args.filter((a) => a.startsWith("-"));
        const rest = args.filter((a) => !a.startsWith("-"));
        if (rest.length < 2) return err("grep: try grep <word> <file>"), false;
        const [pattern, ...files] = rest;
        const ci = flags.includes("-i");
        const want = ci ? pattern.toLowerCase() : pattern;
        let found = false;
        for (const f of files) {
          const node = get(f);
          if (!node || node.type !== "file") { err(`grep: ${f}: no such file`); continue; }
          for (const line of node.text.split("\n")) {
            if ((ci ? line.toLowerCase() : line).includes(want)) {
              out.push({ text: (files.length > 1 ? f + ": " : "") + line, cls: "text", mark: pattern, ci });
              found = true;
            }
          }
        }
        if (!found) say(`(no lines contain "${pattern}"${ci ? "" : " — grep cares about upper/lower case"})`, "dim");
        return found;
      },
      help() {
        say("Commands you can use:", "dim");
        for (const c of ["ls", "cd", "pwd", "cat", "mv", "cp", "rm", "mkdir", "grep"]) say("  " + MANUAL[c]);
        say("Also: hint, man <command>, clear, history, whoami. Tab finishes names; ↑ repeats commands.", "dim");
        return true;
      },
      hint() {
        const step = currentStep();
        say(step ? step.hint || step.goal : "You've finished! Explore as much as you like.", "hint");
        return true;
      },
      man(args) {
        if (!args[0]) return err("man: which command? Example: man ls"), false;
        if (!MANUAL[args[0]]) return err(`man: no manual for ${args[0]}`), false;
        say(MANUAL[args[0]]);
        return true;
      },
      clear() { out.push({ clear: true }); return true; },
      whoami() { say(user); return true; },
      history() { s.history.forEach((h, i) => say(`${String(i + 1).padStart(4)}  ${h}`)); return true; },
      restart() {
        if (!confirmRestart) {
          confirmRestart = true;
          say("This starts the whole game over. Type restart again to confirm.", "hint");
          return true;
        }
        const wasComplete = s.complete;
        s = fresh();
        s.complete = wasComplete;
        out.push({ clear: true });
        intro();
        return true;
      },
    };

    function hasFixed(node) {
      if (node.fixed) return true;
      return node.type === "dir" && Object.values(node.children).some(hasFixed);
    }
    const validName = (n) => /^[A-Za-z0-9._-]+$/.test(n) && n !== "." && n !== "..";

    function moveOrCopy(name, args, move) {
      const paths = args.filter((a) => !a.startsWith("-"));
      if (paths.length !== 2) return err(`${name}: try ${name} <from> <to>`), false;
      const [from, to] = paths;
      const node = get(from);
      if (!node) return err(`${name}: ${from}: no such file`), false;
      if (node.type === "dir") return err(`${name}: ${from}: is a place. Here you can only ${move ? "move" : "copy"} files.`), false;
      if (move && node.fixed) return err(`${name}: ${from}: ${node.fixed === true ? "it's fixed in place." : node.fixed}`), false;
      const src = parentOf(from);
      let dest = get(to);
      let destDir, destName;
      if (dest && dest.type === "dir") { destDir = dest; destName = src.name; }
      else {
        const p = parentOf(to);
        if (!p.dir || p.dir.type !== "dir") return err(`${name}: ${to}: no place by that name`), false;
        destDir = p.dir; destName = p.name;
        if (!validName(destName)) return err(`${name}: ${to}: use letters, numbers, dashes or dots`), false;
      }
      if (destDir.locked) return err(destDir.locked), false;
      const existing = destDir.children[destName];
      if (existing === node) return err(`${name}: ${from} is already there`), false;
      if (existing && (existing.fixed || existing.keep)) return err(`${name}: ${to}: something important already has that name`), false;
      const copy = move ? node : clone(node);
      if (!move) { delete copy.fixed; }
      if (move) delete src.dir.children[src.name];
      destDir.children[destName] = copy;
      return true;
    }

    // ---- story -----------------------------------------------------------------
    const currentStep = () => world.steps[s.step];
    const api = { get, exists, abs, home: world.home, cwd: () => s.cwd };

    function startStep() {
      const step = currentStep();
      if (!step) return;
      if (step.chapter) say(`\n━━ ${step.chapter} ━━`, "chapter");
      if (step.onStart) step.onStart(s.fs, api);
      say("Goal: " + step.goal, "goal");
    }

    function checkProgress(ev) {
      let step = currentStep();
      while (step && step.check(ev, api)) {
        if (step.done) say(step.done, "story");
        if (step.onDone) step.onDone(s.fs, api);
        s.step++;
        step = currentStep();
        if (step) startStep();
        else finish();
        ev = { cmd: null }; // a new step only counts commands typed after it starts
      }
    }

    function finish() {
      s.complete = true;
      say(world.ending, "story");
      out.push({ complete: true });
    }

    function intro() {
      say(world.intro, "story");
      startStep();
      s.started = true;
    }

    // ---- public ----------------------------------------------------------------
    function run(line) {
      out = [];
      const text = line.trim();
      if (text) s.history.push(text);
      if (s.history.length > 200) s.history.shift();
      const [cmd, ...args] = tokenize(text);
      if (!cmd) return out;
      if (cmd !== "restart") confirmRestart = false;
      let ok = false;
      if (cmds[cmd]) ok = cmds[cmd](args) !== false;
      else if (cmd === "sudo") err("Nice try. Seawolves earn their privileges here. 🐺");
      else if (cmd === "exit" || cmd === "logout") say("Finish the quest first — then the rest of your computer unlocks.", "hint");
      else err(`${cmd}: command not found. Type help to see what you can use.`);
      if (!s.complete || currentStep()) checkProgress({ cmd, args, ok, cwd: s.cwd });
      return out;
    }

    function tokenize(t) {
      return (t.match(/"[^"]*"|'[^']*'|\S+/g) || []).map((x) => x.replace(/^["']|["']$/g, ""));
    }

    function complete(line) {
      const toks = line.split(/\s+/);
      const last = toks[toks.length - 1];
      let options;
      if (toks.length === 1) options = COMMANDS.filter((c) => c.startsWith(last));
      else {
        const slash = last.lastIndexOf("/");
        const base = slash >= 0 ? last.slice(0, slash + 1) : "";
        const partial = last.slice(slash + 1);
        const dir = get(base || ".");
        if (!dir || dir.type !== "dir") return { line, options: [] };
        options = Object.keys(dir.children)
          .filter((n) => n.startsWith(partial) && (partial.startsWith(".") || !n.startsWith(".")))
          .map((n) => base + n + (dir.children[n].type === "dir" ? "/" : ""));
      }
      if (options.length === 1) {
        toks[toks.length - 1] = options[0];
        const done = toks.join(" ");
        return { line: options[0].endsWith("/") ? done : done + " ", options: [] };
      }
      // Extend to the longest shared prefix.
      let prefix = options[0] || last;
      for (const o of options) while (!o.startsWith(prefix)) prefix = prefix.slice(0, -1);
      if (prefix.length > last.length) { toks[toks.length - 1] = prefix; return { line: toks.join(" "), options: [] }; }
      return { line, options };
    }

    function begin() {
      out = [];
      if (!s.started) intro();
      else {
        say(world.welcomeBack, "story");
        const step = currentStep();
        if (step) say("Goal: " + step.goal, "goal");
      }
      return out;
    }

    return {
      begin, run, complete,
      prompt: () => `${user}@pacifica:${pretty(s.cwd)}$`,
      goal: () => (currentStep() ? currentStep().goal : "Quest complete! Explore as you like."),
      chapter: () => { for (let i = s.step; i >= 0; i--) if (world.steps[i] && world.steps[i].chapter) return world.steps[i].chapter; return "Free roam"; },
      progress: () => ({ step: s.step, total: world.steps.length }),
      isComplete: () => s.complete,
      save: () => clone(s),
      history: () => s.history.slice(),
    };
  }

  root.PacTerminus = { createGame };
})(typeof window !== "undefined" ? window : globalThis);
