import { Shader } from "../core/Shader";
import { gl, Renderer } from "../Renderer";
import { Camera } from "../../world/Camera";
import { Mesh } from "../core/Mesh";
import { IVertexFormat } from "../core/IVertexFormat";
import { Sprite } from "../Sprite";
import { Assets } from "../Assets";
import { GameClient } from "../../GameClient";
import { Util } from "../../Util";

export module SpriteShader {

    export let shader:Shader;
    export let spriteMesh:Mesh;
    export let vertexFormat:IVertexFormat;

    export function init() {

        vertexFormat = [
            ["aPos", "float", 2],
            ["aTexCoord", "float", 2],
        ];

        shader = new Shader("shaders/sprite", () => {
            
            GameClient.joiningRace.increment();

            spriteMesh = new Mesh( shader, [
                    [ 1, 1,     1.0, 0.0,],
                    [ 1, 0,     1.0, 1.0,],
                    [ 0, 0,     0.0, 1.0,],
                    [ 0, 1,     0.0, 0.0,],
                ], [
                    3, 1, 0,
                    3, 2, 1,
                ], vertexFormat);
    
        });
    }

    export function use() {
        gl.useProgram(shader.program);
    }

    export function setCamera(camera:Camera) {
        shader.sendVector("uCamera.pos", camera.x, camera.y);
        shader.sendVector("uCamera.scale", 1 / Renderer.SCREEN_WIDTH * 2, 1 / Renderer.SCREEN_HEIGHT * 2);
    }

    export function drawSprite(spriteDrawCall:ISpriteDrawCall) {

        let texture = Assets.spriteTextures.get(spriteDrawCall.texture);
        let rotationMatrix = Util.rotationMatrix(spriteDrawCall.rotation);
        
        shader.sendVector("uSprite.pos", spriteDrawCall.x, spriteDrawCall.y);
        shader.sendVector("uSprite.size", spriteDrawCall.w, spriteDrawCall.h);
        shader.sendMatrix("uSprite.rotationMatrix", rotationMatrix);
        shader.sendVector("uSprite.alignment", spriteDrawCall.alignX, spriteDrawCall.alignY);
        shader.sendTexture("uSprite.texture", texture, 0);
        shader.sendVector("uSprite.texOffset", spriteDrawCall.textureOffsetX / texture.width, spriteDrawCall.textureOffsetY / texture.height);
        shader.sendVector("uSprite.texScale", 1 / spriteDrawCall.textureScaleX * spriteDrawCall.w / texture.width, 1 / spriteDrawCall.textureScaleY * spriteDrawCall.h / texture.height);

        spriteMesh.draw();
    }

}

export interface ISpriteDrawCall {
    texture:string;
    rotation:number;
    alignX:number;
    alignY:number;
    x:number;
    y:number;
    w:number;
    h:number;
    textureOffsetX:number;
    textureOffsetY:number;
    textureScaleX:number;
    textureScaleY:number;
}