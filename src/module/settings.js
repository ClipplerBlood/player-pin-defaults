// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

export function registerSettings() {
  game.settings.register('player-pin-defaults', 'global', {
    name: 'player-pin-defaults.settings.names.global',
    hint: 'player-pin-defaults.settings.hints.global',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register('player-pin-defaults', 'pinImage', {
    name: 'player-pin-defaults.settings.names.pinImage',
    hint: 'player-pin-defaults.settings.hints.pinImage',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    filePicker: 'imagevideo',
  });

  game.settings.register('player-pin-defaults', 'playerColorImage', {
    name: 'player-pin-defaults.settings.names.playerColorImage',
    hint: 'player-pin-defaults.settings.hints.playerColorImage',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register('player-pin-defaults', 'playerToken', {
    name: 'player-pin-defaults.settings.names.playerToken',
    hint: 'player-pin-defaults.settings.hints.playerToken',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register('player-pin-defaults', 'imageSize', {
    name: 'player-pin-defaults.settings.names.imageSize',
    hint: 'player-pin-defaults.settings.hints.imageSize',
    scope: 'world',
    config: true,
    type: Number,
    default: 100,
  });

  game.settings.register('player-pin-defaults', 'fontSize', {
    name: 'player-pin-defaults.settings.names.fontSize',
    hint: 'player-pin-defaults.settings.hints.fontSize',
    scope: 'world',
    config: true,
    type: Number,
    default: 32,
  });

  game.settings.register('player-pin-defaults', 'anchorPoint', {
    name: 'player-pin-defaults.settings.names.anchorPoint',
    scope: 'world',
    config: true,
    type: Number,
    default: 1,
    choices: {
      0: 'Center',
      1: 'Bottom',
      2: 'Top',
      3: 'Left',
      4: 'Right',
    },
  });

  game.settings.register('player-pin-defaults', 'addPlayerName', {
    name: 'player-pin-defaults.settings.names.addPlayerName',
    hint: 'player-pin-defaults.settings.hints.addPlayerName',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register('player-pin-defaults', 'playerColorText', {
    name: 'player-pin-defaults.settings.names.playerColorText',
    hint: 'player-pin-defaults.settings.hints.playerColorText',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
}
