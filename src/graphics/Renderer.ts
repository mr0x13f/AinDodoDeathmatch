import { Util } from "../Util";
import { World } from "../world/World";
import { Input } from "../Input";
import { BrushShader } from "./shaders/BrushShader";
import { SpriteShader } from "./shaders/SpriteShader";

export let gl: WebGL2RenderingContext;

export module Renderer {

    export const CANVAS_ID = "glcanvas";
    export const SCREEN_WIDTH = 1024;
    export const SCREEN_HEIGHT = 768;

    export let canvas: HTMLCanvasElement;
    export let dataTypes: {[typeString:string]:{size:number, native:number}};

    export function init() {
        
        canvas = <HTMLCanvasElement> document.getElementById(CANVAS_ID);
        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        Input.setCanvas(canvas);

        gl = <WebGL2RenderingContext> canvas.getContext("webgl2");

        gl.enable(gl.CULL_FACE);

        dataTypes = {
            "float": {size: 4, native: gl.FLOAT},
            "byte": {size: 1, native: gl.BYTE}
        };

        BrushShader.init();
        SpriteShader.init();

    }

    export function clear() {

        let color = Util.vec4FromHex(World.skyColor);
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    }

}