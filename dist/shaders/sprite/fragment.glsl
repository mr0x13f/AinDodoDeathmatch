precision mediump float;

struct Sprite {
    vec2 pos;
    vec2 size;
    mat2 rotationMatrix;
    vec2 alignment;
    sampler2D texture;
    vec2 texOffset;
    vec2 texScale;
};

uniform Sprite uSprite;

varying vec2 vTexCoord;

void main() {

    vec4 color = texture2D(uSprite.texture, vTexCoord);

    // Discard transparent pixels
    if (color.a < 0.5) discard;
    color.a = 1.0;

    gl_FragColor = color;
    
}   