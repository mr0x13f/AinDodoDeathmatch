import { HtmlUtil } from "./HtmlUtil";
import { GameServer } from "../GameServer";

export module ServerMenu {

    export function show() {

        HtmlUtil.showElement("server-section");

        GameServer.init();
    }

    export function hide() {
        HtmlUtil.hideElement("server-section");
    }

}