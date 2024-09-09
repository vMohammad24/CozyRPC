import {
  OWGames,
  OWGamesEvents,
  OWHotkeys
} from "@overwolf/overwolf-api-ts";

import { AppWindow } from "../AppWindow";
import { kGamesFeatures, kHotkeys, kWindowNames } from "../consts";
import { CSGameInfo } from "../util/counterstrike";
import { formatVariables, overwatchMaps, OWGameInfo, OWPlayer } from "../util/overwatch";
import { DiscordRPCPlugin, LogLevel } from "../util/rpc";
import { captilaizeString } from "../util/util";
import WindowState = overwolf.windows.enums.WindowStateEx;


class InGame extends AppWindow {
  private static _instance: InGame;
  private _gameEventsListener: OWGamesEvents;
  private _eventsLog: HTMLElement;
  private _infoLog: HTMLElement;
  private rpc: DiscordRPCPlugin;
  private owInfo: OWGameInfo;
  private csInfo: CSGameInfo;
  private battleTag: string;
  private steamId: string;
  private clientId: string;
  private constructor() {
    super(kWindowNames.inGame);
    this._eventsLog = document.getElementById('eventsLog');
    this._infoLog = document.getElementById('infoLog');
    this.executeOn((() => { this.clientId = "1279931263897042984"; }).bind(this), (() => { this.clientId = "1281925581159530517"; }).bind(this))
    this.battleTag = "";
    this.owInfo = {
      gameState: null,
      gameType: null,
      mapName: null,
      player: {
        assists: null,
        battlenet_tag: null,
        damage: null,
        deaths: null,
        healed: null,
        hero_name: null,
        hero_role: null,
        is_local: false,
        is_teammate: false,
        kills: null,
        mitigated: null,
        player_name: null,
        team: null
      }
    } as OWGameInfo;
    this.resetInfo();
    this.setToggleHotkeyBehavior();
    this.setToggleHotkeyText();
    overwolf.extensions.current.getExtraObject("DiscordRPCPlugin", (r) => {
      this.rpc = r.object
      this.rpc.initialize(this.clientId, LogLevel.Info, (success) => {
        if (success) {
          console.log("Discord RPC Plugin initialized successfully!");
        } else {
          console.error("Failed to initialize Discord RPC Plugin.");
        }
      });
      this.rpc.onClientReady.addListener((c) => {
        this.logLine(this._infoLog, `RPC Connected`, true)
      })
      this.rpc.onClientError.addListener((c) => {
        this.logLine(this._infoLog, `ERRORRRRR: ${JSON.stringify(c)}`, true)
      })
      this.executeOn(this.updateActivityOW.bind(this), this.updateActivityCS.bind(this))
    })


  }

  private executeOn(ow: Function, cs: Function) {
    overwolf.games.getRunningGameInfo((info) => {
      switch (info.classId) {
        case 10844:
          console.log(`Running ${ow.toString()} for Overwatch`)
          ow();
          break;
        case 22730:
          console.log(`Running ${cs.toString()} for Counter Strike`)
          cs();
          break;
      }
    })
  }

  private resetInfo() {
    this.executeOn(() => {
      this.owInfo = {
        gameState: null,
        gameType: null,
        mapName: null,
        player: {
          assists: null,
          battlenet_tag: null,
          damage: null,
          deaths: null,
          healed: null,
          hero_name: null,
          hero_role: null,
          is_local: false,
          is_teammate: false,
          kills: null,
          mitigated: null,
          player_name: null,
          team: null
        }
      } as OWGameInfo;
    }, () => {
      this.csInfo = {
        gameState: null,
        gameType: null,
        mapName: null,
        player: {
          assists: null,
          battlenet_tag: null,
          damage: null,
          deaths: null,
          healed: null,
          hero_name: null,
          hero_role: null,
          is_local: false,
          is_teammate: false,
          kills: null,
          mitigated: null,
          player_name: null,
          team: null
        }
      } as CSGameInfo;
    })
  }


  private updateActivityCS() {
    const { player, gameType, gameState, mapName } = this.owInfo;
    // this.logLine(this._infoLog, player, true);
    const csState = localStorage.getItem('cs2State');
    const owDetails = localStorage.getItem('cs2Details');
    this.logLine(this._infoLog, `
      State: ${csState},
            Details: ${owDetails},
            `, true);
    this.logLine(this._infoLog, "Updating RPC", true);
    if (!player) {
      this.logLine(this._infoLog, "Tried updating while player is null", false);
    }
    if (!player.hero_name) {
      player.hero_name = ""
    }
    const inMenus = gameState == "match_ended" || player.kills == null;
    this.owInfo.gameType = (() => {
      console.log(gameState)
      if (gameState == "match_in_progress") {
        return captilaizeString(gameType);
      }
      if (inMenus) {
        return "In Menus"
      }
      return "";
    })();
    // this.logLine(this._eventsLog, `Map: ${ mapName }`, true);
    this.rpc.updatePresenceWithButtonsArray(inMenus ? this.owInfo.gameType : (csState ? formatVariables(csState, this.owInfo) : this.owInfo.gameType),
      inMenus ? "" : (owDetails ? formatVariables(owDetails, this.owInfo) : `KDA: ${player.kills} / ${player.deaths} / ${player.assists}`),
      'counterstrike',
      `On ${mapName || "Earth"}`,
      inMenus ? "" : player.hero_name.toLowerCase(),
      inMenus ? "" : `Playing as ${captilaizeString(player.hero_name)} `,
      true, 0, "",
      (c) => {
        if (!c.success) {
          this.logLine(this._infoLog, c, true)
        }
      });
  }

  private updateActivityOW() {
    const { player, gameType, gameState, mapName } = this.owInfo || {};
    this.logLine(this._infoLog, this.owInfo, true);
    const owState = localStorage.getItem('ow2State');
    const owDetails = localStorage.getItem('ow2Details');
    this.logLine(this._infoLog, `
      State: ${owState},
      Details: ${owDetails},
      `, true);
    this.logLine(this._infoLog, "Updating RPC", true);
    if (!player) {
      this.logLine(this._infoLog, "Tried updating while player is null", false);
    }
    if (!player.hero_name) {
      player.hero_name = ""
    }
    const inMenus = gameState == "match_ended" || player.kills == null;
    this.owInfo.gameType = (() => {
      console.log(gameState)
      if (gameState == "match_in_progress") {
        return captilaizeString(gameType);
      }
      if (inMenus) {
        return "In Menus"
      }
      return "";
    })();
    // this.logLine(this._eventsLog, `Map: ${ mapName } `, true);
    this.rpc.updatePresenceWithButtonsArray(inMenus ? this.owInfo.gameType : (owState ? formatVariables(owState, this.owInfo) : this.owInfo.gameType),
      inMenus ? "" : (owDetails ? formatVariables(owDetails, this.owInfo) : `KDA: ${player.kills} /${player.deaths}/${player.assists} `),
      'overwatch',
      `On ${mapName || "Earth"} `,
      inMenus ? "" : player.hero_name.toLowerCase(),
      inMenus ? "" : `Playing as ${captilaizeString(player.hero_name)} `,
      true, 0, "",
      (c) => {
        if (!c.success) {
          this.logLine(this._infoLog, c, true)
        }
      });
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new InGame();
    }

    return this._instance;
  }

  public async run() {
    const gameClassId = await this.getCurrentGameClassId();

    const gameFeatures = kGamesFeatures.get(gameClassId);

    if (gameFeatures && gameFeatures.length) {
      this._gameEventsListener = new OWGamesEvents(
        {
          onInfoUpdates: this.onInfoUpdates.bind(this),
          onNewEvents: function () { }
        },
        gameFeatures
      );

      this._gameEventsListener.start();
    }
  }

  private onInfoUpdates(info) {
    // this.logLine(this._eventsLog, info, false);
    if (info.game_info) {
      const { game_state } = info.game_info;
      if (game_state && (game_state == "match_ended" || game_state == "match_in_progress")) {
        this.owInfo.gameState = game_state
        if (game_state == "match_ended") {
          this.resetInfo()
        }
      };
    }
    if (info.match_info) {
      const { game_type, map } = info.match_info;
      if (game_type)
        this.owInfo.gameType = captilaizeString(game_type)
      if (map) {
        this.owInfo.mapName = overwatchMaps[map]
      }
    }
    // change roster_0 to scan for every roser until it gets the local player
    if (info.roster) {
      for (const r in info.roster) {
        const roster = JSON.parse(info.roster[r]) as OWPlayer;
        if (roster.is_local) {
          this.owInfo.player = roster;
          this.battleTag = roster.battlenet_tag;
          this.logLine(this._eventsLog, "Updated local player", true)
          break;
        } else {
          if (roster.battlenet_tag == this.battleTag) {
            this.owInfo.player = roster;
            this.logLine(this._eventsLog, "Updated local player(2)", true)
          }
        }
      }
    }
    this.executeOn(this.updateActivityOW.bind(this), this.updateActivityCS.bind(this))
    // this.logLine(this._infoLog, this.gameInfo, true);s
  }

  // Displays the toggle minimize/restore hotkey in the window header
  private async setToggleHotkeyText() {
    const gameClassId = await this.getCurrentGameClassId();
    const hotkeyText = await OWHotkeys.getHotkeyText(kHotkeys.toggle, gameClassId);
    const hotkeyElem = document.getElementById('hotkey');
    hotkeyElem.textContent = hotkeyText;
  }

  // Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
  private async setToggleHotkeyBehavior() {
    const toggleInGameWindow = async (
      hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
    ): Promise<void> => {
      console.log(`pressed hotkey for ${hotkeyResult.name}`);
      const inGameState = await this.getWindowState();

      if (inGameState.window_state_ex === WindowState.normal ||
        inGameState.window_state_ex === WindowState.maximized) {
        this.currWindow.minimize();
      } else if (inGameState.window_state_ex === WindowState.minimized ||
        inGameState.window_state === WindowState.closed) {
        this.currWindow.restore();
      }
    }

    OWHotkeys.onHotkeyDown(kHotkeys.toggle, toggleInGameWindow);
  }

  // Appends a new line to the specified log
  private logLine(log: HTMLElement, data, highlight) {
    const line = document.createElement('pre');
    line.textContent = JSON.stringify(data);

    if (highlight) {
      line.className = 'highlight';
    }

    // Check if scroll is near bottom
    const shouldAutoScroll =
      log.scrollTop + log.offsetHeight >= log.scrollHeight - 10;

    log.appendChild(line);

    if (shouldAutoScroll) {
      log.scrollTop = log.scrollHeight;
    }
  }

  private async getCurrentGameClassId(): Promise<number | null> {
    const info = await OWGames.getRunningGameInfo();
    return (info && info.isRunning && info.classId) ? info.classId : null;
  }
}

InGame.instance().run();