import { Renderer, gl } from "../Renderer";
import { Shader } from "./Shader";
import { IVertexFormat } from "./IVertexFormat";

/*
    graphics/core is shader-agnostic
*/

export class Mesh {

    public shader: Shader;
    public vertices: number[][];
    public faces: number[]
    public vertexFormat: [string,string,number][];

    private VBO: WebGLBuffer;               // Vertices
    private VAO: WebGLVertexArrayObject;    // Vertex Format
    private EBO: WebGLBuffer;               // Faces

    constructor(shader:Shader, vertices:number[][], faces:number[], vertexFormat:IVertexFormat) {

        this.shader = shader;
        this.vertices = vertices;
        this.faces = faces;
        this.vertexFormat = <[string,string,number][]> vertexFormat;

        this.VBO = <WebGLBuffer> gl.createBuffer();
        this.VAO = <WebGLVertexArrayObject> gl.createVertexArray();
        this.EBO = <WebGLBuffer> gl.createBuffer();

        // Put all vertex components into a single array
        let vertexComponentArray = [];
        for (let vertex of vertices) {
            for (let component of vertex) {
                vertexComponentArray.push(component)
            }
        }

        // Bind vertices to VBO
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexComponentArray), gl.STATIC_DRAW);

        gl.bindVertexArray(this.VAO);

        // Bind faces to EBO
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW); 
        
        // Bind vertex format to VAO
        // https://learnopengl.com/img/getting-started/vertex_attribute_pointer_interleaved.png

        let vertexSize = 0;
        for (let attribute of this.vertexFormat) {

            let dataType = attribute[1];
            let components = attribute[2];
            let dataTypeSize = Renderer.dataTypes[dataType.toLowerCase()].size;

            vertexSize += dataTypeSize * components;

        }

        let offset = 0;
        for (let attribute of this.vertexFormat) {

            let attributeName = attribute[0];
            let dataType = attribute[1];
            let components = attribute[2];

            gl.vertexAttribPointer(<number> this.shader.getAttribute(attributeName), components, Renderer.dataTypes[dataType.toLowerCase()].native, false, vertexSize, offset);
            gl.enableVertexAttribArray(<number> this.shader.getAttribute(attributeName));

            let dataTypeSize = Renderer.dataTypes[dataType.toLowerCase()].size;
            offset += dataTypeSize * components;

        }

    }

    public draw(): void {

        gl.bindVertexArray(this.VAO);
        gl.drawElements(gl.TRIANGLES, this.faces.length, gl.UNSIGNED_SHORT, 0);

    }

}