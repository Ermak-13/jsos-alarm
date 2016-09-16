var Widget = require('./widget'),
    Shortcut = require('./shortcut'),
    locales = require('./locales');

I18n.registryDict(locales);
OS.installModule('TODO', {
  Widget: Widget,
  Shortcut: Shortcut
});
