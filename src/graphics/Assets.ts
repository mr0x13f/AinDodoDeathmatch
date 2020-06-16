import { Texture } from "./core/Texture";
import { gl } from "./Renderer";
import { AssetPool } from "./AssetPool";

export module Assets {

    export let mapTextures = new AssetPool<Texture>(loadMapTexture);
    export let spriteTextures = new AssetPool<Texture>(loadSpriteTexture);

    function loadMapTexture(path:string):Texture {
        return new Texture(path, gl.REPEAT);
    }

    function loadSpriteTexture(path:string):Texture {
        return new Texture(path, gl.CLAMP_TO_EDGE);
    }

}