# Maintainer: Steven Eno <seno@pacificachristian.org>
pkgname=omaterminus
pkgver=0.1.0
pkgrel=1
pkgdesc="PacTerminus: Pacifica's command-line quest, in a locked-down window"
arch=('any')
license=('MIT')
depends=('python' 'python-gobject' 'gtk3' 'webkit2gtk-4.1')
source=('omaterminus.py' 'index.html' 'style.css' 'engine.js' 'world.js' 'ui.js'
        'org.pacificachristian.OmaTerminus.desktop' 'omaterminus.svg')
sha256sums=('SKIP' 'SKIP' 'SKIP' 'SKIP' 'SKIP' 'SKIP' 'SKIP' 'SKIP')

package() {
  install -Dm755 omaterminus.py "$pkgdir/usr/share/omaterminus/omaterminus.py"
  install -Dm644 -t "$pkgdir/usr/share/omaterminus/web" index.html style.css engine.js world.js ui.js
  install -Dm644 org.pacificachristian.OmaTerminus.desktop "$pkgdir/usr/share/applications/org.pacificachristian.OmaTerminus.desktop"
  install -Dm644 omaterminus.svg "$pkgdir/usr/share/icons/hicolor/scalable/apps/omaterminus.svg"
  install -dm755 "$pkgdir/usr/bin"
  ln -s /usr/share/omaterminus/omaterminus.py "$pkgdir/usr/bin/omaterminus"
}
