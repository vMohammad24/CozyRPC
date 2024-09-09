export const kGamesFeatures = new Map<number, string[]>([
  // CSGO
  [
    22730,
    [
      'match_info',
      'kill',
      'death',
      'assist',
      'headshot',
      'round_start',
      'match_start',
      'match_info',
      'match_end',
      'team_round_win',
      'bomb_planted',
      'bomb_change',
      'reloading',
      'fired',
      'weapon_change',
      'weapon_acquired',
      'info',
      'roster',
      'player_activity_change',
      'team_set',
      'replay',
      'counters',
      'mvp',
      'scoreboard',
      'kill_feed'
    ]
  ],
  // Overwatch
  [
    10844,
    [
      'game_info',
      'match_info',
      'kill',
      'death',
      'roster'
    ]
  ],
]);

export const kGameClassIds = Array.from(kGamesFeatures.keys());

export const kWindowNames = {
  inGame: 'in_game',
  desktop: 'desktop'
};

export const kHotkeys = {
  toggle: 'debug_menu'
};
