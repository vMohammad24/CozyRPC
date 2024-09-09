import { captilaizeString } from "./util";

export function owFormatVariables(text: string, info: OWGameInfo) {
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

export interface OWGameInfo {
    gameType: string;
    gameState: string;
    mapName: string;
    player: OWPlayer;
    details: string;
    state: string;
}

export interface OWPlayer {
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

export const overwatchMaps = {
    3314: "Antarc Pebibsula",
    2018: "Busan",
    1645: "Ilios",
    1634: "Lijiang Tower",
    1719: "Lijiang Tower Lunar New Year",
    1207: "Nepal",
    1694: "Oasis",
    2087: "Circuit Royal",
    707: "Dorado",
    2628: "Havana",
    1878: "Junkertown",
    2161: "Rialto",
    1467: "Route 66",
    3205: "Shambali Monastery",
    388: "Watchpoint Gibraltar",
    1886: "Blizzard World",
    2651: "Blizzard World Winter",
    1677: "Eichenwalde",
    2036: "Eichenwalde Halloween",
    687: "Hollywood",
    1707: "Hollywood Halloween",
    212: "Kings Row",
    1713: "Kings Row Winter",
    2892: "Midtown",
    468: "Numbani",
    2360: "Paraiso",
    2868: "Coloesseo",
    3411: "Esperanca",
    2795: "New Queen Street",
    3603: "New Junk City",
    3390: "Suravasa"
}