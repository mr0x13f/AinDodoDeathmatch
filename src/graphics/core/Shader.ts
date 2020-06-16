import { gl } from "../Renderer";
import { Util } from "../../Util";
import { Texture } from "./Texture";
import { Race } from "../../Race";

/*
    graphics/core is shader-agnostic
*/

export class Shader {

    public program:WebGLProgram;
    public sourceRace:Race;

    constructor(sourceUrl:string, onReady:()=>void) {

        let _vertexShaderSource:string;
        let _fragmentShaderSource:string;

        this.program = <WebGLProgram> gl.createProgram();

        this.sourceRace = new Race(2, () => {

            let vertexShader: WebGLShader = this.compileShader(gl.VERTEX_SHADER, _vertexShaderSource);
            let fragmentShader: WebGLShader = this.compileShader(gl.FRAGMENT_SHADER, _fragmentShaderSource);
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);
        
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
                window.alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.program));
            
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);

            onReady();
        });

        Util.httpGet(sourceUrl+"/vertex.glsl",
            (vertexShaderSource) => {
                _vertexShaderSource = vertexShaderSource;
                this.sourceRace.increment();
            });
            
        Util.httpGet(sourceUrl+"/fragment.glsl",
            (fragmentShaderSource) => {
                _fragmentShaderSource = fragmentShaderSource;
                this.sourceRace.increment();
            });

    }

    private compileShader(type:number, source:string): WebGLShader {

        var shader: WebGLShader = <WebGLShader> gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            window.alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
    
        return shader;
    }

    public getAttribute(attributeName:string):number|null {
        return gl.getAttribLocation(this.program, attributeName);
    }

    public sendNumber(uniformName:string, value:number) {
        let uniformLocation:WebGLUniformLocation = <WebGLUniformLocation> gl.getUniformLocation(this.program, uniformName);

        gl.uniform1f(uniformLocation, Number(value));
    }

    public sendVector(uniformName:string, ...vector:number[]) {
        let uniformLocation:WebGLUniformLocation = <WebGLUniformLocation> gl.getUniformLocation(this.program, uniformName);

        if (vector.length == 2)
            gl.uniform2fv(uniformLocation, vector);
        else if (vector.length == 3)
            gl.uniform3fv(uniformLocation, vector);
        else if (vector.length == 4)
            gl.uniform4fv(uniformLocation, vector);
    }

    public sendMatrix(uniformName:string, value:number[]) {
        let uniformLocation:WebGLUniformLocation = <WebGLUniformLocation> gl.getUniformLocation(this.program, uniformName);

        if (value.length == 4)
            gl.uniformMatrix2fv(uniformLocation, false, value);
        else if (value.length == 9)
            gl.uniformMatrix3fv(uniformLocation, false, value);
        else if (value.length == 16)
            gl.uniformMatrix4fv(uniformLocation, false, value);
    }

    public sendTexture(uniformName:string, texture:Texture, textureIndex:number) {
        let uniformLocation:WebGLUniformLocation = <WebGLUniformLocation> gl.getUniformLocation(this.program, uniformName);
        
        gl.activeTexture(gl.TEXTURE0 + textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        gl.uniform1i(uniformLocation, textureIndex);
    }


}