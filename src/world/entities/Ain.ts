import { Entity } from "../Entity";
import { Player } from "../Player";
import { IControllable } from "../interfaces/IControllable";
import { Sprite, ISpriteData } from "../../graphics/Sprite";
import { dt } from "../../GameClient";

const SPRITE:ISpriteData = {
    "texture": "assets/sprites/ain.png",
    "frameW": 96,
    "frameH": 48,

    "animations": {
        "idle": {
            "startX": 0,
            "startY": 0,
            "frames": 1
        },
        "walk": {
            "startX": 0,
            "startY": 0,
            "frames": 2
        },
        "dead": {
            "startX": 0,
            "startY": 96,
            "frames": 1
        }
    }
};

export class Ain extends Entity implements IControllable {

    public type:string = "Ain";

    // GameMaker values are in pixels/frame
    // so we multiply them by 60 to get pixels/second
    public static readonly MOVEMENT_SPEED   = 4 * 60;
    public static readonly JUMP_FORCE       = 13 * 60; 
    public static readonly AIR_JUMP_FORCE   = 10 * 60; 
    public static readonly GRAVITY          = 0.5 * 60*60;

    public static readonly MAX_HEALTH = 100;
    public static readonly OVERHEAL_DECAY_RATE = 1;

    public health:number = Ain.MAX_HEALTH;
    public sprite:Sprite = new Sprite(SPRITE);
    public player:Player|null = null;
    public isBlastJumping:boolean = false;

    protected spawn() {

    }

    protected update() {

        // Apply gravity
        this.vy += Ain.GRAVITY * dt;

    }

    protected draw() {

        

    }

    ///////////////////////////////////////////////////////////
    // Parsing
    ///////////////////////////////////////////////////////////

    public allowNetCreate = true;

    public getNetCreateData():any {
        return {
            ...super.getNetCreateData()
        };
    }
    
    public parseNetCreateData(data:any):void {
        super.parseNetCreateData(data);
    }

    public allowNetUpdate = true;

    public getNetUpdateData():any {
        return {
            ...super.getNetUpdateData()
        };
    }
    
    public parseNetUpdateData(data:any):void {
        super.parseNetUpdateData(data);
    }
    
}

export module AinFactory {

    export const TYPE_NAME = "Ain";

    export function build() {
        return new Ain();
    };

}