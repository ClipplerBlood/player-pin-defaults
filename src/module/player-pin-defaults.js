import { registerSettings } from './settings.js';

/* global libWrapper */
const modSetting = (x) => game.settings.get('player-pin-defaults', x);

Hooks.once('init', async () => {
  console.log('player-pin-defaults | Initializing player-pin-defaults');
  registerSettings();
  libWrapper.register('player-pin-defaults', 'NoteConfig.prototype.getData', getNoteConfigData);
  libWrapper.register('player-pin-defaults', 'NoteConfig.prototype._getSubmitData', function (wrapped, ...args) {
    const data = wrapped(...args);
    if (modSetting('addPlayerName') && !game.user.isGM) {
      data.text += `\n${game.user.character?.name ?? game.user.name}`;
    }
    return data;
  });
});

/**
 * Wrapper for NoteConfig.getData
 * Data returned is overridden by the module's
 * The wrapped function returns an object (noteData) which contains a .data field, which contains what we want to modify
 * So we override noteData.data
 * @param wrapped
 * @param args
 * @return {*}
 */
function getNoteConfigData(wrapped, ...args) {
  let noteData = wrapped(...args);
  if (game.user.isGM) return noteData;

  const defaults = getPinDefaults();
  // console.log(noteData);
  noteData = mergeObject(noteData, defaults);
  // console.log(noteData);
  return noteData;
}

/**
 * Returns the object containing the defaults used for overriding the getData in NoteConfig
 */
function getPinDefaults() {
  const playerColor = game.user.color;
  const tokenImg = game.user.character.prototypeToken?.texture.src;
  const usePlayerToken = modSetting('playerToken') && tokenImg?.length > 0;
  const defaultImage = modSetting('pinImage');

  let customIcon = null;
  if (usePlayerToken) customIcon = tokenImg;
  else if (defaultImage?.length > 0) customIcon = defaultImage;

  const usePlayerColorTint = modSetting('playerColorImage');
  let tintIcon = null;
  if (usePlayerColorTint && !usePlayerToken) tintIcon = playerColor;

  let defaults = {
    data: {
      global: modSetting('global'),
      iconSize: modSetting('imageSize'),
      textAnchor: modSetting('anchorPoint'),
      textColor: modSetting('playerColorText') ? playerColor : null,
      fontSize: modSetting('fontSize'),
      texture: {
        tint: tintIcon,
      },
    },
    icon: {
      selected: customIcon ? '' : null,
      custom: customIcon,
    },
  };

  defaults = flattenObject(defaults);
  // eslint-disable-next-line no-unused-vars
  defaults = Object.fromEntries(Object.entries(defaults).filter(([_, v]) => v != null));
  defaults = expandObject(defaults);
  return defaults;
}
