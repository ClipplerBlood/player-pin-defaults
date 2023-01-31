import { registerSettings } from './settings.js';

/* global libWrapper */
const modSetting = (x) => game.settings.get('player-pin-defaults', x);
export const pinCushionInstalled = () => game.modules.get('pin-cushion') != null;

Hooks.once('init', async () => {
  console.log('player-pin-defaults | Initializing player-pin-defaults');
  registerSettings();

  /*
  getData wrapper.
  Here we override with the custom defaults what is presented to the player in  the NoteConfig.
  Won't be used if GM or if the defaults have already been applied
   */
  libWrapper.register('player-pin-defaults', 'NoteConfig.prototype.getData', function (wrapped, ...args) {
    let noteData = wrapped(...args);

    // Show only the original text, without the name
    const originalText = this.document.flags['player-pin-defaults']?.originalText;
    if (originalText) noteData.data.text = originalText;

    const isDefaulted = this.document.flags['player-pin-defaults']?.isDefaulted;
    if (game.user.isGM || isDefaulted) return noteData;
    console.log(noteData);
    // Apply the defaults
    const defaults = getPinDefaults();
    noteData = mergeObject(noteData, defaults);

    return noteData;
  });

  /*
  getSubmitData wrapper.
  Here we perform operations after the note has been submitted. Operations include:
  - Adding the character name
  - Store the text before adding the name
  - Setting a flag to indicate that the new defaults have been applied
   */
  libWrapper.register('player-pin-defaults', 'NoteConfig.prototype._getSubmitData', function (wrapped, ...args) {
    const data = wrapped(...args);

    // Append name
    if (modSetting('addPlayerName')) {
      const characterName =
        this.document.flags['player-pin-defaults']?.characterName ?? game.user.character?.name ?? game.user.name;
      data['flags.player-pin-defaults.originalText'] = data.text;
      data['flags.player-pin-defaults.characterName'] = characterName;
      data.text += `\n${characterName}`;
    }

    // Set flags
    if (game.user.isGM || this.document.flags['player-pin-defaults']?.isDefaulted) return data;
    data['flags.player-pin-defaults.isDefaulted'] = true;
    if (!game.user.isGM && modSetting('alwaysShowText') && pinCushionInstalled()) {
      data['flags.pin-cushion.textAlwaysVisible'] = true;
    }
    return data;
  });
});

/**
 * Returns the object containing the defaults used for overriding the getData in NoteConfig
 */
function getPinDefaults() {
  // Grab data from user
  const playerColor = game.user.color;
  const tokenImg = game.user.character.prototypeToken?.texture.src;

  // Icon (token or default)
  const usePlayerToken = modSetting('playerToken') && tokenImg?.length > 0;
  const defaultImage = modSetting('pinImage');
  let customIcon = null;
  if (usePlayerToken) customIcon = tokenImg;
  else if (defaultImage?.length > 0) customIcon = defaultImage;

  // Tint
  const usePlayerColorTint = modSetting('playerColorImage');
  let tintIcon = null;
  if (usePlayerColorTint && !usePlayerToken) tintIcon = playerColor;

  // Returned object
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

  // Remove nulls & return
  defaults = flattenObject(defaults);
  // eslint-disable-next-line no-unused-vars
  defaults = Object.fromEntries(Object.entries(defaults).filter(([_, v]) => v != null));
  defaults = expandObject(defaults);
  return defaults;
}
