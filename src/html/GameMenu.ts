import { HtmlUtil } from "./HtmlUtil";
import { GameClient } from "../GameClient";

export module GameMenu {

    export function show() {

        HtmlUtil.showElement("game-section");
        HtmlUtil.hideElement("logo");

    }

    export function hide() {
        HtmlUtil.hideElement("game-section");
        HtmlUtil.showElement("logo");
    }

}