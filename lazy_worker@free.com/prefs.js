const { GObject, Gtk } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {
}

function buildPrefsWidget() {
    let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.lazy_worker');
    let builder = new Gtk.Builder();
    builder.add_from_file(`${ExtensionUtils.getCurrentExtension().path}/settings.ui`);

    let widget = builder.get_object('lazy_worker-settings');
    
    let workHoursBegin = builder.get_object('work-hours-begin');
    let workHoursEnd = builder.get_object('work-hours-end');
    let workMinutesBegin = builder.get_object('work-minutes-begin');
    let workMinutesEnd = builder.get_object('work-minutes-end');

    workHoursBegin.set_value(settings.get_int('work-hours-begin'));
    workHoursEnd.set_value(settings.get_int('work-hours-end'));
    workMinutesBegin.set_value(settings.get_int('work-minutes-begin'));
    workMinutesEnd.set_value(settings.get_int('work-minutes-end'));

    workHoursBegin.connect('value-changed', (spin) => {
        settings.set_int('work-hours-begin', spin.get_value_as_int());
    });

    workHoursEnd.connect('value-changed', (spin) => {
        settings.set_int('work-hours-end', spin.get_value_as_int());
    });
    
    workMinutesBegin.connect('value-changed', (spin) => {
        settings.set_int('work-minutes-begin', spin.get_value_as_int());
    });

    workMinutesEnd.connect('value-changed', (spin) => {
        settings.set_int('work-minutes-end', spin.get_value_as_int());
    });

    return widget;
}


