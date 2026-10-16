import * as migration_20261016_121846_initial from './20261016_121846_initial';

export const migrations = [
  {
    up: migration_20261016_121846_initial.up,
    down: migration_20261016_121846_initial.down,
    name: '20261016_121846_initial'
  },
];
