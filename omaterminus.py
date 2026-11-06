#!/usr/bin/env python3
"""Omaterminus: PacTerminus, Pacifica's command-line quest, in a locked-down window.

The game is a local web page (no internet). Finishing it writes
~/.local/share/omaterminus/complete and reloads Hyprland; the pacos student desktop
only binds Canvas, Omawrite, Omacalc and Desmos once that file exists.
"""

import json
import os
import subprocess
import sys

import gi

gi.require_version("Gdk", "3.0")
gi.require_version("Gtk", "3.0")
gi.require_version("WebKit2", "4.1")
from gi.repository import Gdk, Gio, GLib, Gtk, WebKit2  # noqa: E402

APP_ID = "org.pacificachristian.OmaTerminus"
HERE = os.path.dirname(os.path.realpath(__file__))
WEB_DIR = os.path.join(HERE, "web")
DATA_DIR = os.path.join(GLib.get_user_data_dir(), "omaterminus")
CACHE_DIR = os.path.join(GLib.get_user_cache_dir(), "omaterminus")
MARKER = os.path.join(DATA_DIR, "complete")

# Block every web request: the game is entirely local.
BLOCK_WEB = json.dumps([{"trigger": {"url-filter": f"^{scheme}:"}, "action": {"type": "block"}}
                        for scheme in ("https?", "wss?", "ftp")])


def unlock():
    """Write the marker once, then reload Hyprland so the app shortcuts appear."""
    if os.path.exists(MARKER):
        return
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(MARKER, "w") as f:
            f.write(GLib.DateTime.new_now_local().format_iso8601() + "\n")
    except OSError as e:
        print(f"omaterminus: couldn't save completion: {e}", file=sys.stderr)
        return
    try:
        subprocess.run(["hyprctl", "reload"], timeout=10, capture_output=True)
    except (OSError, subprocess.SubprocessError):
        pass  # not on Hyprland; the shortcuts appear at next login


class TerminusWindow(Gtk.ApplicationWindow):
    def __init__(self, app):
        super().__init__(application=app, title="PacTerminus")
        self.set_default_size(1100, 760)
        self.set_icon_name("omaterminus")

        view = WebKit2.WebView(web_context=app.context, user_content_manager=app.content)
        settings = view.get_settings()
        settings.set_enable_developer_extras(False)
        settings.set_enable_write_console_messages_to_stdout(False)
        settings.set_enable_back_forward_navigation_gestures(False)
        view.connect("decide-policy", self.on_decide_policy)
        view.connect("create", lambda v, a: None)  # no popups
        view.connect("permission-request", lambda v, r: r.deny() or True)
        view.connect("context-menu", lambda *a: True)  # no "Reload"/"Inspect"
        view.connect("web-process-terminated", lambda v, r: v.reload())
        self.view = view
        self.add(view)
        self.connect("key-press-event", self.on_key)

    def on_decide_policy(self, view, decision, kind):
        if kind in (WebKit2.PolicyDecisionType.NAVIGATION_ACTION, WebKit2.PolicyDecisionType.NEW_WINDOW_ACTION):
            uri = decision.get_navigation_action().get_request().get_uri()
            path = GLib.filename_from_uri(uri)[0] if uri.startswith("file://") else None
            if not path or not os.path.realpath(path).startswith(WEB_DIR + os.sep):
                decision.ignore()
                return True
        return False

    def on_key(self, win, event):
        ctrl = event.state & Gdk.ModifierType.CONTROL_MASK
        key = Gdk.keyval_name(event.keyval)
        v = self.view
        zoom = {"equal": 0.1, "plus": 0.1, "minus": -0.1}
        if ctrl and key in zoom:
            v.set_zoom_level(min(3.0, max(0.5, v.get_zoom_level() + zoom[key])))
            return True
        if ctrl and key == "0":
            v.set_zoom_level(1.0)
            return True
        if ctrl and key in ("r", "R") or key == "F5":
            return True  # a reload would just restart the intro text
        return False


class OmaTerminus(Gtk.Application):
    def __init__(self):
        super().__init__(application_id=APP_ID, flags=Gio.ApplicationFlags.FLAGS_NONE)

    def do_startup(self):
        Gtk.Application.do_startup(self)
        manager = WebKit2.WebsiteDataManager(base_data_directory=DATA_DIR, base_cache_directory=CACHE_DIR)
        self.context = WebKit2.WebContext.new_with_website_data_manager(manager)
        self.content = WebKit2.UserContentManager()
        # Tell the page who is playing and that it runs in the desktop app.
        host = json.dumps({"user": GLib.get_user_name(), "native": True})
        self.content.add_script(WebKit2.UserScript.new(
            f"window.PACTERMINUS = {host};",
            WebKit2.UserContentInjectedFrames.TOP_FRAME,
            WebKit2.UserScriptInjectionTime.START, None, None))
        self.content.register_script_message_handler("omaterminus")
        self.content.connect("script-message-received::omaterminus", self.on_message)

    def do_activate(self):
        if self.get_windows():
            self.get_windows()[0].present()
            return
        win = TerminusWindow(self)
        win.show_all()
        # Nothing loads until the web blocker is in place: fail closed.
        store = WebKit2.UserContentFilterStore.new(os.path.join(CACHE_DIR, "filters"))
        store.save("block-web", GLib.Bytes.new(BLOCK_WEB.encode()), None, self.on_filter_ready, win)

    def on_filter_ready(self, store, result, win):
        try:
            self.content.add_filter(store.save_finish(result))
        except GLib.Error as e:
            print(f"omaterminus: couldn't start safely: {e.message}", file=sys.stderr)
            return
        win.view.load_uri(GLib.filename_to_uri(os.path.join(WEB_DIR, "index.html")))
        win.view.grab_focus()

    def on_message(self, manager, result):
        value = result.get_js_value()
        if value.is_string() and value.to_string() == "complete":
            unlock()


if __name__ == "__main__":
    GLib.set_prgname(APP_ID)  # Wayland app id, matches the .desktop file
    sys.exit(OmaTerminus().run(sys.argv))
