import { Shader } from "../core/Shader";
import { gl, Renderer } from "../Renderer";
import { Camera } from "../../world/Camera";
import { Mesh } from "../core/Mesh";
import { IVertexFormat } from "../core/IVertexFormat";
import { Sprite } from "../Sprite";
import { Assets } from "../Assets";
import { GameClient } from "../../GameClient";

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

    export function drawSprite(sprite:Sprite, x:number, y:number, r:number=0) {

        let texture = Assets.spriteTextures.get(sprite.texture);
        shader.sendVector("uSprite.pos", x, y);
        shader.sendTexture("uSprite.texture", texture, 0);

        spriteMesh.draw();
    }

}