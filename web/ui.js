// PacTerminus screen: draws the engine's output and handles typing.
(function () {
  "use strict";
  const SAVE_KEY = "pacterminus-save";
  const host = window.PACTERMINUS || {}; // set by the desktop app: { user, native }
  const $ = (id) => document.getElementById(id);
  const log = $("log"), input = $("input"), screen = $("screen");

  let save = null;
  try { save = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { /* fresh game */ }
  const game = PacTerminus.createGame(PacTerminusWorld, { user: host.user, save });

  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(game.save())); } catch (e) { /* not saved */ }
  }

  function line(entry) {
    if (entry.clear) { log.textContent = ""; return; }
    if (entry.complete) { celebrate(); return; }
    const div = document.createElement("div");
    if (entry.cls) div.className = entry.cls;
    if (entry.mark) highlight(div, entry.text, entry.mark, entry.ci);
    else div.textContent = entry.text;
    log.appendChild(div);
  }

  function highlight(div, text, word, ci) {
    const hay = ci ? text.toLowerCase() : text;
    const needle = ci ? word.toLowerCase() : word;
    let i = 0, j;
    while ((j = hay.indexOf(needle, i)) >= 0) {
      div.append(text.slice(i, j));
      const m = document.createElement("mark");
      m.textContent = text.slice(j, j + word.length);
      div.append(m);
      i = j + word.length;
    }
    div.append(text.slice(i));
  }

  function echo(text) {
    const div = document.createElement("div");
    div.className = "cmd";
    const p = document.createElement("span");
    p.className = "p";
    p.textContent = game.prompt() + " ";
    div.append(p, text);
    log.appendChild(div);
  }

  function refresh() {
    $("prompt").textContent = game.prompt();
    $("goal").textContent = game.isComplete() ? "" : "Goal: " + game.goal();
    $("chapter").textContent = game.isComplete() ? "Quest complete" : game.chapter();
    const p = game.progress();
    $("progress-fill").style.width = Math.min(100, (100 * p.step) / p.total) + "%";
    screen.scrollTop = screen.scrollHeight;
  }

  function celebrate() {
    // The desktop app writes the unlock marker and reloads the desktop.
    try { window.webkit.messageHandlers.omaterminus.postMessage("complete"); } catch (e) { /* web version */ }
    if (!host.native) $("apps").hidden = true;
    $("done").hidden = false;
    $("stay").focus();
  }
  $("stay").addEventListener("click", () => { $("done").hidden = true; input.focus(); });

  // Already finished on an earlier run? Re-send, in case the unlock didn't land.
  if (game.isComplete()) {
    try { window.webkit.messageHandlers.omaterminus.postMessage("complete"); } catch (e) { /* web */ }
  }

  let history = game.history(), cursor = history.length;

  $("line").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = "";
    echo(text);
    game.run(text).forEach(line);
    history = game.history();
    cursor = history.length;
    persist();
    refresh();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const r = game.complete(input.value);
      input.value = r.line;
      if (r.options.length) {
        echo(input.value);
        line({ text: r.options.join("   "), cls: "dim" });
        refresh();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cursor > 0) input.value = history[--cursor];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      cursor = Math.min(history.length, cursor + 1);
      input.value = history[cursor] || "";
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      log.textContent = "";
    }
  });

  // Clicking anywhere puts you back at the prompt (but leave text selection alone).
  screen.addEventListener("click", () => { if (!window.getSelection().toString()) input.focus(); });

  game.begin().forEach(line);
  persist();
  refresh();
  input.focus();
})();
