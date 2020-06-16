import { HtmlUtil } from "./HtmlUtil";
import { GameClient } from "../GameClient";
import { GameMenu } from "./GameMenu";

export module JoiningMenu {

    export function show() {

        HtmlUtil.showElement("joining-section");

        GameClient.init(start);

    }

    export function hide() {
        HtmlUtil.hideElement("joining-section");
    }

    function start() {
        GameMenu.show();
        hide();
    }

}