import { Entity } from "../Entity";
import { World } from "../World";

export class InfoPlayerStart extends Entity {

    public type:string = "InfoPlayerStart";

    protected spawn() {
        World.spawnpoints.push(this);
    }
    
    ///////////////////////////////////////////////////////////
    // Parsing
    ///////////////////////////////////////////////////////////

    public allowMapCreate = true;
    
}

export module InfoPlayerStartFactory {

    export const TYPE_NAME = "InfoPlayerStart";

    export function build() {
        return new InfoPlayerStart();
    };

}