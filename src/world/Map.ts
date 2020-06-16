import { World } from "./World";
import { Util } from "../Util";

interface IMapData {
    geometry:string;
    textures:string[];
    entities:any[];
}

export module Map {

    export let geometry:string;
    export let textures:string[];

    export function load(url:string, onReady:()=>void) {
        Util.httpGet(url,
        (data) => {
            loadString(data);
            onReady();
        }, (code) => {
            // 
        });
    }

    function loadString(mapString:string) {
        let mapData = <IMapData> JSON.parse(mapString);
        loadGeometryString(mapData.geometry, mapData.textures);

        for (let entityData of mapData.entities) {
            let entity = World.buildEntity(entityData.type);

            if (!entity.allowMapCreate) {
                console.log("Tried to create invalid map entity "+entityData.type);
                continue;
            }

            entity.parseMapData(entityData);
            World.sv_addEntity(entity);
        }
    }

    export function loadGeometryString(geometry:string, textures:string[]) {

        Map.geometry = geometry;
        Map.textures = textures;

        World.brushes = [];

        let lines = geometry.split(";");
        
        for (let brushString of lines) {
            if (brushString == "")
                continue;

            let properties = brushString.split(",");

            World.brushes.push({
                x: parseFloat(properties[0]),
                y: parseFloat(properties[1]),
                w: parseFloat(properties[2]),
                h: parseFloat(properties[3]),
                z: parseFloat(properties[4]),
                solid: parseInt(properties[5]) == 1,
                shadow: parseFloat(properties[6]),
                texture: textures[parseInt(properties[7])],
                textureOffsetX: parseFloat(properties[8]),
                textureOffsetY: parseFloat(properties[9]),
                textureScaleX: parseFloat(properties[10]),
                textureScaleY: parseFloat(properties[11]),
            });
        }

    }

}