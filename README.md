# PacTerminus

An original command-line quest set at Pacifica Christian High School, Santa Monica.
The Pacifica Cup has gone missing before the All-School Retreat. Students find it
by moving around Main Campus (18th St) and Seawolf Campus (20th St) with real shell
commands: `ls`, `cd`, `pwd`, `cat`, `mv`, `cp`, `mkdir`, `rm`, `grep`, hidden files,
`~` and full paths. It takes about 15–20 minutes.

On pacos student machines it is the first thing a student sees. Finishing it unlocks
Canvas, Omawrite, Omacalc and Desmos.

## Layout

- `web/`: the game. `engine.js` is a pretend file system and shell (no DOM),
  `world.js` holds the map and all story text, `ui.js` draws it. Works offline.
- `omaterminus.py`: locked-down GTK/WebKit window (no web access, no dev tools).
  When the game finishes it writes `~/.local/share/omaterminus/complete` and runs
  `hyprctl reload`.
- `test/playthrough.mjs`: plays the whole game and checks it finishes.

## Run

```sh
make test                  # play through in Node
python3 omaterminus.py     # desktop window (marker goes to your own ~/.local/share)
xdg-open web/index.html    # or just open it in a browser
make pkg                   # Arch package; pacos's `make repo` builds it too
```

## Change the story

Edit `web/world.js`. Bump `version` there when you change the map or steps, so
saved games restart cleanly. Then run `make test`.
