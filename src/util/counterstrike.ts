export interface CSGameInfo {
    gameType: string;
    gameState: string;
    mapName: string;
    player: CSPlayer;
}

export interface CSPlayer {
    player_name: string;
    is_local: boolean;
    hero_name: string;
    hero_role: string;
    team: number;
    kills: number;
    deaths: number;
    damage: number;
    assists: number;
    healed: number;
    mitigated: number;
    battlenet_tag: string;
    is_teammate: boolean;
}
