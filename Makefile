# `make test` plays the game through; `make pkg` builds the Arch package.
test:
	node test/playthrough.mjs

pkg: test
	rm -rf build && mkdir build
	cp PKGBUILD omaterminus.py web/* data/* build/
	cd build && makepkg -fd && mv *.pkg.tar.zst ..

.PHONY: test pkg
