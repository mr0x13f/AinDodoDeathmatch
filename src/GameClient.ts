import { Camera } from "./world/Camera";
import { Renderer } from "./graphics/Renderer";
import { Input } from "./Input";
import { World } from "./world/World";
import { NetClient } from "./network/NetClient";
import { Player } from "./world/Player";
import { Race } from "./Race";
import { Config } from "./Config";
import { Collection } from "./Collection";

export let dt:number;

export module GameClient {

    export let activeCamera:Camera;
    export let localPlayer:Player;
    export let players = new Collection<Player>();
    export let joiningRace:Race;
    let _onStart:()=>void;

    export function init(onStart:()=>void) {

        NetClient.init(onConnectionReady);
        Input.init();
        Renderer.init();

        joiningRace = new Race(6, start); // connectionReady, BrushShader, SpriteShader, initial-geometry, initial-entities, initial-players

        _onStart = onStart;

    }

    function onConnectionReady() {

        joiningRace.increment();

        NetClient.sendReliable("player-info", {
            name: Config.getString("playerName")
        });
        
    }

    function cl_parsePlayerNetCreate(data:any) {
        
    }

    export function start() {

        _onStart();
        console.log("Client started");

        activeCamera = new Camera();

        loop();

    }
    
    function draw() {

        activeCamera.draw();

    }

    function update() {

        Input.clear();
    
        World.update();
    
    }

    function loop() {
    
        let lastTime: number = 0;
    
        function run(time: number): void {
        
            dt = (time - lastTime) / 1000;
            lastTime = time;
    
            update();
            draw();
    
            window.requestAnimationFrame(run);
        
        }
    
        window.requestAnimationFrame(run);
    
    }

    NetClient.addNetHook("initial-players", (data:any) => {
        console.log("Got initial player data")
        for (let playerData of data) 
            cl_parsePlayerNetCreate(playerData);
        GameClient.joiningRace.increment();
    });

    NetClient.addNetHook("create-player", (data:any) => {
        cl_parsePlayerNetCreate(data);
    });

    NetClient.addNetHook("destroy-player", (data:any) => {

    });

}