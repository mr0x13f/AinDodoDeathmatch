import { SpriteShader } from "./shaders/SpriteShader";

export interface ISpriteData {
    texture:string;
    frameW:number;
    frameH:number;
    padding:number;
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
    public padding:number;
    public animations:{[name:string]:ISpriteAnimation};

    private animationStartTime:number = 0;
    private currentAnimation:ISpriteAnimation|null = null;
    private loop:boolean = false;
    private speed:number = 1;

    constructor(data:ISpriteData) {

        this.texture = data.texture;
        this.frameW = data.frameW;
        this.frameH = data.frameH;
        this.animations = data.animations;
        this.padding = data.padding;
    }

    public play(anim:string, speed:number, loop:boolean) {

        this.animationStartTime = Date.now();
        this.currentAnimation = this.animations[anim];
        this.speed = speed;
        this.loop = loop;

    }

    public draw(x:number, y:number, rotation:number=0, alignX:number=0.5, alignY:number=0.5, scaleX:number=1, scaleY:number=scaleX) {

        if (this.currentAnimation == null)
            return;

        let delta = (Date.now() - this.animationStartTime) / 1000;
        let frameIndex = delta * this.speed;

        if (this.loop)
            frameIndex %= this.currentAnimation.frames;
        else
            frameIndex = Math.min(frameIndex, this.currentAnimation.frames-1);

        frameIndex = Math.floor( frameIndex );
        let currentFrameX = this.currentAnimation.startX;
        let currentFrameY = this.currentAnimation.startY + frameIndex * (this.frameH + this.padding);
        
        SpriteShader.drawSprite({
            texture: this.texture,
            rotation: rotation,
            alignX: alignX,
            alignY: alignY,
            x: x,
            y: y,
            w: this.frameW*scaleX,
            h: this.frameH*scaleY,
            textureOffsetX: -currentFrameX,
            textureOffsetY: -currentFrameY,
            textureScaleX: scaleX,
            textureScaleY: scaleY,
        });

    }

}