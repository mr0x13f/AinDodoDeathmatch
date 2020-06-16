import { ServerListMenu } from "./html/ServerListMenu";
import { Config } from "./Config";
import { SettingsMenu } from "./html/SettingsMenu";
import { World } from "./world/World";
import { Deathmatch } from "./world/gamemodes/Deathmatch";
import { InfoPlayerStartFactory } from "./world/entities/InfoPlayerStart";
import { AinFactory } from "./world/entities/Ain";
import { AkaiFactory } from "./world/entities/Akai";
import { DeathmatchClassic } from "./world/gamemodes/DeathmatchClassic";

window.onload = main;

function main() {

    Config.init();

    World.registerGamemodes(
        DeathmatchClassic,
        Deathmatch,
    );

    World.registerEntityFactories(
        AinFactory,
        InfoPlayerStartFactory,
        AkaiFactory,
    );

    if (Config.getString("playerName"))
        ServerListMenu.show();
    else
        SettingsMenu.show();

}

