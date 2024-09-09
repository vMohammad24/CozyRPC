import { captilaizeString } from "./util";

export function csFormatVariables(text: string, info: CSGameInfo) {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (!(words[i].endsWith("}") && words[i].startsWith("{"))) continue;
        const word = words[i].replace(/{(.*?)}/g, (a, b) => b);
        if (word in info) {
            if (typeof info[word] == "object") continue;
            words[i] = captilaizeString(info[word])
            continue;
        }
        if (word in info.player) {
            words[i] = captilaizeString(info.player[word])
            continue;
        }
    }
    return words.join(" ");
}

export interface CSGameInfo {
    roundNumber: number;
    gameMode: string;
    mapName: string;
    player: CSPlayer;
}

export interface CSPlayer {
    player_name: string;
    team: "T" | "CT";
    kills: number;
    deaths: number;
    damage: number;
    assists: number;
    money: number;
    hs: number;
    ping: number;
}
