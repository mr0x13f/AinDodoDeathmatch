import { gl } from "../Renderer";

/*
    graphics/core is shader-agnostic
*/

export class Texture {

    public url: string;
    public texture: WebGLTexture;
    public width: number = 1;
    public height: number = 1

    constructor(url:string, wrapMode:number) {

        this.url = url;

        let texture = <WebGLTexture> gl.createTexture();
        this.texture = texture;
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        // Temporarily fill the texture until the image is loaded, or keep it white if no image was given
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {

            this.width = image.width;
            this.height = image.height;

            gl.activeTexture(gl.TEXTURE0 + 0);
            gl.bindTexture(gl.TEXTURE_2D, texture);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
        };
    
        image.src = url;
        
    }

}