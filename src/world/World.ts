import { IBrush } from "./interfaces/IBrush";
import { Entity } from "./Entity";
import { IGamemode } from "./interfaces/IGamemode";
import { IEntityFactory } from "./interfaces/IEntityFactory";
import { InfoPlayerStart } from "./entities/InfoPlayerStart";
import { NetClient } from "../network/NetClient";
import { Map } from "./Map";
import { GameClient } from "../GameClient";
import { Collection } from "../Collection";
import { GameServer } from "../GameServer";
import { NetServer } from "../network/NetServer";

export module World {

    export const GAMEMODES:{[id:string]:IGamemode} = {};
    export const ENTITY_FACTORIES:{[type:string]:IEntityFactory} = {};

    export let brushes:IBrush[] = [];
    export let entities = new Collection<Entity>();
    export let skyColor:string = "7282E0"; // 4747B2
    export let gamemode:IGamemode;
    export let spawnpoints:InfoPlayerStart[] = [];

    export function update() {

        for (let entity of World.entities) 
            entity.doUpdate();
        
    }

    export function registerGamemodes(...gamemodes:IGamemode[]) {
        for (let gamemode of gamemodes)
            GAMEMODES[gamemode.ID] = gamemode;
    }

    export function registerEntityFactories(...entityFactories:IEntityFactory[]) {
        for (let entityFactory of entityFactories)
            ENTITY_FACTORIES[entityFactory.TYPE_NAME] = entityFactory;
    }

    function addEntity(entity:Entity) {
        entities.set(entity.id, entity);
        entity.doSpawn();
    }

    export function buildEntity(type:string) {
        return ENTITY_FACTORIES[type].build();
    }

    function sv_getEntityCreateData(entity:Entity) {
        let data = entity.getNetCreateData();
        data.id = entity.id;
        data.type = entity.type;
        return data;
    }

    export function sv_addEntity(entity:Entity) {
        entity.id = GameServer.entitySerial.next();
        addEntity(entity);

        if (entity.allowNetCreate) {
            let data = sv_getEntityCreateData(entity);
            NetServer.broadcastReliable("create-entity", data);
        }
    }
    
    export function sv_getInitialEntityData() {
        let data:any[] = [];

        for (let entity of entities)
            if (entity.allowNetCreate)
                data.push(sv_getEntityCreateData(entity));

        return data;
    }

    function cl_parseEntityNetCreate(data:any) {
        let entity = buildEntity(data.type);
        entity.id = data.id;
        entity.parseNetCreateData(data);
        addEntity(entity);
    }

    function cl_parseEntityNetUpdate(data:any) {
        let entity = entities.get(data.id);
        entity.parseNetUpdateData(data);
    }

    NetClient.addNetHook("initial-geometry", (data:any) => {
        console.log("Got geometry data")
        Map.loadGeometryString(data.geometry, data.textures);
        GameClient.joiningRace.increment();
    });

    NetClient.addNetHook("initial-entities", (data:any) => {
        console.log("Got initial entity data")
        for (let entityData of data) 
            cl_parseEntityNetCreate(entityData);
         GameClient.joiningRace.increment();
    });

    NetClient.addNetHook("create-entity", (data:any) => {
        cl_parseEntityNetCreate(data);
    });

    NetClient.addNetHook("destroy-entity", (data:any) => {

    });

    NetClient.addNetHook("update-entity", (data:any) => {
        cl_parseEntityNetUpdate(data);
    });

}