import { World } from "./world/World";
import { NetServer } from "./network/NetServer";
import { Player } from "./world/Player";
import { Map } from "./world/Map";
import { RemoteClient } from "./network/RemoteClient";
import { Serial } from "./Serial";
import { Collection } from "./Collection";

export let dt:number;

export module GameServer {

    export let dt:number;
    export let players = new Collection<Player>();
    export let playerSerial:Serial;
    export let entitySerial:Serial;

    export function init() {

        playerSerial = new Serial();
        entitySerial = new Serial();

        Map.load("maps/dm_crossfire.ain", onReady);

    }

    function onReady() {

        NetServer.init(onClientConnectionReady);

    }

    function onClientConnectionReady(client:RemoteClient) {

        client.sendReliable("initial-geometry", {
            geometry: Map.geometry,
            textures: Map.textures,
        });

        client.sendReliable("initial-entities", World.sv_getInitialEntityData() );

    }

    function sv_getInitialPlayerData(client?:RemoteClient|null) {
        let data:any[] = [];

        for (let player of players) {
            let playerData = player.getNetCreateData();
            playerData.local = player.client == client;
            data.push( playerData );
        }

        return data;
    }

    export function start() {

        loop();

    }

    function update() {
    
        World.update();
    
    }

    function loop() {
    
        let lastTime: number = 0;
    
        function run(time: number): void {
        
            dt = (time - lastTime) / 1000;
            lastTime = time;
    
            update();
    
            window.requestAnimationFrame(run);
        
        }
    
        window.requestAnimationFrame(run);
    
    }

    NetServer.addNetHook("player-info", (data:any, sender:RemoteClient) => {

        if (sender.player)
            return;

        let player = new Player();
        player.client = sender;
        sender.player = player;
        player.id = playerSerial.next();
        player.name = data.name;
        players.set(player.id, player);
        
        sender.sendReliable("initial-players", sv_getInitialPlayerData(sender));

        // TODO notify other players that a new player joined

    });

}