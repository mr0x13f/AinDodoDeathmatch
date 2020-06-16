import { IBoundingBox } from "./IBoundingBox";

export interface IBrush extends IBoundingBox {

    x:number;
    y:number;
    w:number;
    h:number;

    z:number;
    solid:boolean;

    shadow:number;
    texture:string;
    textureOffsetX:number;
    textureOffsetY:number;
    textureScaleX:number;
    textureScaleY:number;

}