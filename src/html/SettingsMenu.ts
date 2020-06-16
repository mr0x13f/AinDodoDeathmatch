import { HtmlUtil } from "./HtmlUtil";
import { ServerListMenu } from "./ServerListMenu";
import { Config } from "../Config";

export module SettingsMenu {

    let saveButton: HTMLButtonElement;
    let cancelButton: HTMLButtonElement;

    let playerNameInput: HTMLInputElement;

    export function show() {

        HtmlUtil.showElement("settings-section");
        
        getElements();

        saveButton.onclick = save;
        cancelButton.onclick = back;
        cancelButton.disabled = Config.getString("playerName") == null
        
        playerNameInput.value = Config.getString("playerName") || "";

    }

    function getElements() {
        saveButton = <HTMLButtonElement> document.getElementById("save-settings-button");
        cancelButton = <HTMLButtonElement> document.getElementById("cancel-settings-button");

        playerNameInput = <HTMLInputElement> document.getElementById("player-name");
    }

    function hide() {
        HtmlUtil.hideElement("settings-section");
    }

    function back() {
        hide();
        ServerListMenu.show();
    }

    function save() {
        if (playerNameInput.value.length == 0) {
            window.alert("Please enter a player name before continuing")
            return;
        }

        Config.setString("playerName", playerNameInput.value);
        back();
    }

}