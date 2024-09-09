import { captilaizeString } from "./util";

export function csFormatVariables(text: string, info: CSGameInfo) {
    return text.replace(/{(.*?)}/g, (match, key) => {
        if (key in info && typeof info[key] !== "object") {
            return captilaizeString(info[key]);
        } else if (key in info.player) {
            return captilaizeString(info.player[key]);
        }
        return match;
    });
}

export interface CSGameInfo {
    roundNumber: number;
    gameMode: string;
    mapName: string;
    gamePhase: string;
    player: CSPlayer;
}

export interface CSPlayer {
    playerName: string;
    team: "T" | "CT";
    kills: number;
    deaths: number;
    damage: number;
    assists: number;
    money: number;
    hs: number;
    ping: number;
}
