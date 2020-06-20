import { HtmlUtil } from "./HtmlUtil";
import { ServerListMenu } from "./ServerListMenu";
import { Matchmaking } from "../network/Matchmaking";
import { GameServer } from "../GameServer";
import { World } from "../world/World";
import { ServerMenu } from "./ServerMenu";

export module HostMenu {

    let backButton: HTMLButtonElement;
    let startButton: HTMLButtonElement;
    let serverNameInput: HTMLInputElement;
    let gamemodeSelect: HTMLSelectElement;

    export function show() {

        HtmlUtil.showElement("host-section");
        
        getElements();
        getGamemodes();

        backButton.onclick = back;
        startButton.onclick = start;

    }

    function getElements() {
        backButton = <HTMLButtonElement> document.getElementById("back-to-server-list-button");
        startButton = <HTMLButtonElement> document.getElementById("start-server-button");
        serverNameInput = <HTMLInputElement> document.getElementById("server-name");
        gamemodeSelect = <HTMLSelectElement> document.getElementById("gamemode");
    }

    function getGamemodes() {
        HtmlUtil.clearChildren(gamemodeSelect);

        for (let gm in World.GAMEMODES) {
            let option = <HTMLOptionElement> document.createElement("OPTION");
            option.innerText = World.GAMEMODES[gm].NAME;
            option.value = World.GAMEMODES[gm].ID;
            gamemodeSelect.appendChild(option);
        }

        gamemodeSelect.value = "dmc";
    }

    function hide() {
        HtmlUtil.hideElement("host-section");
    }

    function back() {
        hide();
        ServerListMenu.show();
    }

    function start() {
        backButton.disabled = true;
        startButton.disabled = true;

        Matchmaking.registerServer(serverNameInput.value, () => {
            // Register success
            ServerMenu.show();
            hide();
        }, (message) => {
            // Register Fail
            window.alert("Failed to create server: "+message);
            backButton.disabled = false;
            startButton.disabled = false;
        });
    }

}