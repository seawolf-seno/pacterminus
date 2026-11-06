# pacterminus

PacTerminus (package and app: `omaterminus`), an original command-line quest set at
Pacifica. Part of the school dev platform initiative (see `~/.claude/CLAUDE.md`).
Sibling of `omacanvas`/`omadesmos`; installed by `pacos` (Super+5). Fizzy: PacOS board, card #46.

- Original game in the genre. Don't copy MIT Terminus's world, rooms, characters or puzzles.
- All story text is in `web/world.js`; bump `version` on map/step changes. `make test` after.
- Real people: only public staff names from the school site (Mr. Knight) and Mr. Eno.
  Never students.
- Works offline: no fonts, scripts or anything else from the internet. The window blocks web requests.
- Unlock contract with pacos: `~/.local/share/omaterminus/complete` exists → student
  Hyprland config binds Super+1–4. pacos `bin/pacos-start` opens this at login until then.

## Status
- 0.1.0 (2026-11-01, pushed to github.com/seawolf-seno/pacterminus 2026-11-05): full playthrough passes in Node and in the desktop window on seno's
  machine (marker written, `hyprctl reload` called). Package builds.
- Not yet tested in the pacos VM as a student (gate + reload) or on a Framework.
- Content from the website mirror; the Drive "charter" couldn't be read (connector auth failed).
