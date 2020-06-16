import { Shader } from "../core/Shader";
import { gl, Renderer } from "../Renderer";
import { IBrush } from "../../world/interfaces/IBrush";
import { Camera } from "../../world/Camera";
import { Mesh } from "../core/Mesh";
import { IVertexFormat } from "../core/IVertexFormat";
import { World } from "../../world/World";
import { Assets } from "../Assets";
import { GameClient } from "../../GameClient";

export module BrushShader {

    export let shader:Shader;
    export let brushMesh:Mesh;
    export let vertexFormat:IVertexFormat;

    export function init() {

        vertexFormat = [
            ["aPos", "float", 2],
            ["aTexCoord", "float", 2],
        ];

        shader = new Shader("shaders/brush", () => {

            GameClient.joiningRace.increment();

            brushMesh = new Mesh( shader, [
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

    export function drawBrush(brush:IBrush) {

        let texture = Assets.mapTextures.get(brush.texture);
        shader.sendVector("uBrush.pos", brush.x, brush.y);
        shader.sendVector("uBrush.size", brush.w, brush.h);
        shader.sendNumber("uBrush.z", brush.z);
        shader.sendNumber("uBrush.shadow", brush.shadow);
        shader.sendTexture("uBrush.texture", texture, 0);
        shader.sendVector("uBrush.texOffset", brush.textureOffsetX / brush.w, brush.textureOffsetY / brush.h);
        shader.sendVector("uBrush.texScale", 1 / brush.textureScaleX * brush.w / texture.width, 1 / brush.textureScaleY * brush.h / texture.height);

        brushMesh.draw();
    }

}