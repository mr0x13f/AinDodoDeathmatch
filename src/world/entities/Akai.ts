import { Entity } from "../Entity";
import { Sprite, ISpriteData } from "../../graphics/Sprite";

const SPRITE:ISpriteData = {
    "texture": "assets/sprites/akai.png",
    "frameW": 50,
    "frameH": 36,
    "padding": 1,

    "animations": {
        "idle": {
            "startX": 0,
            "startY": 0,
            "frames": 1
        }
    }
};

export class Akai extends Entity {

    public type:string = "Akai";
    public sprite = new Sprite(SPRITE);

    protected spawn() {

        this.sprite.play("idle", 1, true);

    }

    protected update() {

    }

    protected draw() {

        this.sprite.draw(this.x, this.y);

    }

    ///////////////////////////////////////////////////////////
    // Parsing
    ///////////////////////////////////////////////////////////

    public allowMapCreate = true;
    public allowNetCreate = true;
    public allowNetUpdate = true;
    
}

export module AkaiFactory {

    export const TYPE_NAME = "Akai";

    export function build() {
        return new Akai();
    };

}