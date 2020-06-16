precision mediump float;

struct Camera {
    vec2 pos;
    vec2 scale;
};

struct Brush {
    vec2 pos;
    vec2 size;
    float z;
    float shadow;
    sampler2D texture;
    vec2 texOffset;
    vec2 texScale;
};

uniform Brush uBrush;
uniform Camera uCamera;

attribute vec2 aPos; 
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {

    vec2 worldSpace = aPos * uBrush.size + uBrush.pos;
    vec2 viewSpace = (worldSpace - uCamera.pos) * uCamera.scale - vec2(1,1);

    gl_Position = vec4(viewSpace, uBrush.z, 1.0);

    vTexCoord = aTexCoord * uBrush.texScale - uBrush.texOffset;

}