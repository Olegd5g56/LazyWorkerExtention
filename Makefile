Size := $(shell du -k lazy_worker@free.com | tail -n 1 | awk '{print $$1}')
Version := $(shell awk '/"version"/{print $$2}' lazy_worker@free.com/metadata.json)
deb:
	glib-compile-schemas lazy_worker@free.com/schemas/
	install -d /tmp/gnome-shell-extension-lazy-worker/usr/share/gnome-shell/extensions/
	cp -r lazy_worker@free.com /tmp/gnome-shell-extension-lazy-worker/usr/share/gnome-shell/extensions/
	install -D -t /tmp/gnome-shell-extension-lazy-worker/DEBIAN/ control
	sed -i 's/Installed-Size: 0/Installed-Size: $(Size)/g' /tmp/gnome-shell-extension-lazy-worker/DEBIAN/control
	sed -i 's/Version:/Version: $(Version)/g' /tmp/gnome-shell-extension-lazy-worker/DEBIAN/control
	dpkg-deb --build /tmp/gnome-shell-extension-lazy-worker/ gnome-shell-extension-lazy-worker.deb
	rm -rf /tmp/gnome-shell-extension-lazy-worker/
install:
	glib-compile-schemas lazy_worker@free.com/schemas/
	cp -r lazy_worker@free.com ~/.local/share/gnome-shell/extensions/
uninstall:
	rm -r ~/.local/share/gnome-shell/extensions/lazy_worker@free.com
clean:
	rm -rf gnome-shell-extension-lazy-worker.deb /tmp/gnome-shell-extension-lazy-worker
	
