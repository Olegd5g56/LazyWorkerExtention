const GETTEXT_DOMAIN = 'lazy_worker-extension';

const { GObject, St, Clutter, GLib } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = ExtensionUtils.gettext;

let label;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Working day Indicator'));

        label = new St.Label({
            y_align: Clutter.ActorAlign.CENTER,
        })
        this.add_child(label);
        
        this.connect('button-press-event', () => {
            ExtensionUtils.openPrefs();
        });

    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    _updateIndicator() {
        let date = new Date();

        let now = (date.getHours()*60) + date.getMinutes();
        let begin = (this._settings.get_int('work-hours-begin') * 60) + this._settings.get_int('work-minutes-begin');
        let end = (this._settings.get_int('work-hours-end') * 60) + this._settings.get_int('work-minutes-end');
        label.set_text("Work:  " + this._settings.get_int('work-minutes-begin'));
        
        if(now < end && now >= begin){
            let passed_time = now - begin;
            let working_day = end - begin;
            let percent = Math.floor((passed_time / (working_day/100)));
            label.set_text("Work:  " + percent.toString() + "%" );
        }else{
            label.set_text("Work:  FREEDOM");
        }
    }

    enable() {
        this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.lazy_worker');
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);

        this._updateIndicator();

        this._timeoutId = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            5,                      
            () => {    
                this._updateIndicator();                      
                return GLib.SOURCE_CONTINUE;
            }
        );
        
        this._settingsChangedHandler = this._settings.connect('changed', () => {
            this._updateIndicator();
        });

    }

    disable() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = null;
        }
        
        if (this._settingsChangedHandler) {
            this._settings.disconnect(this._settingsChangedHandler);
            this._settingsChangedHandler = null;
        }

        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        
        if (this._settings) {
            this._settings = null;
        }
        
        if(label){
            label.destroy();
            label=null;
        }
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
