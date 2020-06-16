export interface ISpriteData {
    texture:string;
    frameW:number;
    frameH:number;
    animations:{[name:string]:ISpriteAnimation};
}

export interface ISpriteAnimation {
    frames:number;
    startX:number;
    startY:number;
}

export class Sprite {

    public texture:string;
    public frameW:number;
    public frameH:number;
    public animations:{[name:string]:ISpriteAnimation};

    constructor(data:ISpriteData) {

        this.texture = data.texture;
        this.frameW = data.frameW;
        this.frameH = data.frameH;
        this.animations = data.animations;
    }

}