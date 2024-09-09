import { OWWindow } from "@overwolf/overwolf-api-ts";
import { LogLevel } from "./util/rpc";

// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared accross the desktop and in-game windows.
export class AppWindow {
  protected currWindow: OWWindow;
  protected mainWindow: OWWindow;
  protected maximized: boolean = false;

  constructor(windowName) {
    this.mainWindow = new OWWindow('background');
    this.currWindow = new OWWindow(windowName);
    // header functions
    const closeButton = document.getElementById('closeButton');
    const maximizeButton = document.getElementById('maximizeButton');
    const minimizeButton = document.getElementById('minimizeButton');
    const header = document.getElementById('header');
    this.setDrag(header);

    closeButton.addEventListener('click', () => {
      this.mainWindow.close();
    });

    minimizeButton.addEventListener('click', () => {
      this.currWindow.minimize();
    });

    maximizeButton.addEventListener('click', () => {
      if (!this.maximized) {
        this.currWindow.maximize();
      } else {
        this.currWindow.restore();
      }

      this.maximized = !this.maximized;
    });
    // states
    const detailsInput = document.getElementById('rpcDetails') as HTMLInputElement;
    const stateInput = document.getElementById('rpcState') as HTMLInputElement;
    const detailsText = document.getElementById('rpcStatusDetails');
    const stateText = document.getElementById('rpcStatusState');
    const form = document.getElementById('rpcForm');
    const variables = document.getElementById('openModal');
    const rpcImage = document.getElementById('rpcImage') as HTMLImageElement;
    const gameButtons = document.getElementsByClassName('navIcon');
    const rpcTitle = document.getElementById('rpcStatusTitle');
    const username = document.getElementById('username');

    overwolf.extensions.current.getExtraObject("DiscordRPCPlugin", (r) => {
      const rpc = r.object
      rpc.initialize("1279931263897042984", LogLevel.None, (user) => {

      })
      rpc.onClientReady.addListener((user) => {
        username.innerText = user.user.Username;
      })

    })
    // consts
    const games = [
      {
        id: 'ow2',
        name: 'Overwatch 2'
      },
      {
        id: 'cs2',
        name: 'Counter Strike 2'
      }
    ]
    if (form) {
      let currentGame = localStorage.getItem('currentGame');
      if (!currentGame) {
        const a = games[0].id;
        localStorage.setItem('currentGame', a);
        currentGame = a;
      }
      document.getElementById(currentGame).classList.add('active');
      let modal = document.getElementById(currentGame + 'Modal') as HTMLDialogElement;
      variables.onclick = () => {
        modal.showModal();
      }
      const update = (game: string) => {
        localStorage.setItem('currentGame', game);
        currentGame = game;
        rpcImage.src = `../../img/${game}.png`;
        rpcTitle.textContent = games.find(g => g.id === game).name;
        modal = document.getElementById(game + 'Modal') as HTMLDialogElement;
        const details = localStorage.getItem(`${game}Details`);
        const state = localStorage.getItem(`${game}State`);
        detailsInput.value = details;
        detailsText.textContent = details;
        stateInput.value = state;
        stateText.textContent = state;
      }
      update(currentGame);


      detailsInput.addEventListener('input', () => {
        detailsText.textContent = detailsInput.value;
      })
      stateInput.addEventListener('input', () => {
        stateText.textContent = stateInput.value;
      })

      form.onsubmit = async (e) => {
        e.preventDefault();
        const details = detailsInput.value;
        const state = stateInput.value;
        localStorage.setItem(`${currentGame}Details`, details);
        localStorage.setItem(`${currentGame}State`, state);
      }
      for (let i = 0; i < gameButtons.length; i++) {
        gameButtons[i].addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const game = target.id;
          for (let j = 0; j < gameButtons.length; j++) {
            gameButtons[j].classList.remove('active');
          }
          target.classList.add('active');
          update(game);
        })
      }
    }
  }

  public async getWindowState() {
    return await this.currWindow.getWindowState();
  }

  private async setDrag(elem) {
    this.currWindow.dragMove(elem);
  }
}
