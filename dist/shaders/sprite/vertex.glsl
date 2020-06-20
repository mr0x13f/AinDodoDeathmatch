precision mediump float;

struct Camera {
    vec2 pos;
    vec2 scale;
};

struct Sprite {
    vec2 pos;
    vec2 size;
    mat2 rotationMatrix;
    vec2 alignment;
    sampler2D texture;
    vec2 texOffset;
    vec2 texScale;
};

uniform Camera uCamera;
uniform Sprite uSprite;

attribute vec2 aPos; 
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {

    vec2 alignmentOffset = uSprite.alignment * uSprite.size;
    vec2 worldSpace = (aPos * uSprite.size - alignmentOffset) * uSprite.rotationMatrix + uSprite.pos + alignmentOffset;
    vec2 viewSpace = (worldSpace - uCamera.pos) * uCamera.scale - vec2(1,1);

    gl_Position = vec4(viewSpace, 0.0, 1.0);

    vTexCoord = aTexCoord * uSprite.texScale - uSprite.texOffset;
}